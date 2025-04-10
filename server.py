from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX
import tempfile
import os
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS

# Configuration
UPLOAD_FOLDER = tempfile.mkdtemp()
ALLOWED_EXTENSIONS = {'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/forecast', methods=['POST'])
def forecast():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Process the file and generate forecast
            forecast_result = generate_forecast(filepath)
            return jsonify(forecast_result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # Clean up
            if os.path.exists(filepath):
                os.remove(filepath)
    
    return jsonify({'error': 'Invalid file type. Only CSV files are allowed.'}), 400

def generate_forecast(filepath, forecast_days=30):
    # Load and validate data
    try:
        df = pd.read_csv(filepath)
        
        # Check required columns
        required_columns = {'date', 'Quantity'}
        if not required_columns.issubset(df.columns):
            missing = required_columns - set(df.columns)
            raise ValueError(f"Missing required columns: {missing}")
        
        # Convert date column
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        if df['date'].isnull().any():
            raise ValueError("Invalid date format in date column")
            
        # Prepare data
        daily_data = df.groupby('date')['Quantity'].sum().reset_index()
        daily_data = daily_data.set_index('date').asfreq('D').fillna(0)
        
        # Add features
        daily_data['dayofweek'] = daily_data.index.dayofweek
        daily_data['month'] = daily_data.index.month
        daily_data['is_weekend'] = (daily_data.index.dayofweek >= 5).astype(int)
        
        # Holiday handling
        if 'Holiday' in df.columns:
            holidays = df[df['Holiday'].notna()].drop_duplicates(['date'])
            holiday_dates = pd.to_datetime(holidays['date'].unique())
            daily_data['is_holiday'] = daily_data.index.isin(holiday_dates).astype(int)
        else:
            daily_data['is_holiday'] = 0
        
        # Model training
        y = daily_data['Quantity']
        X = daily_data[['dayofweek', 'month', 'is_weekend', 'is_holiday']]
        
        model = SARIMAX(
            y,
            exog=X,
            order=(1, 1, 1),
            seasonal_order=(1, 1, 1, 7),
            enforce_stationarity=False,
            enforce_invertibility=False
        )
        results = model.fit(disp=False)
        
        # Forecasting
        last_date = daily_data.index[-1]
        future_dates = pd.date_range(
            start=last_date + pd.Timedelta(days=1),
            periods=forecast_days
        )
        
        future_exog = pd.DataFrame(index=future_dates)
        future_exog['dayofweek'] = future_exog.index.dayofweek
        future_exog['month'] = future_exog.index.month
        future_exog['is_weekend'] = (future_exog.index.dayofweek >= 5).astype(int)
        future_exog['is_holiday'] = 0
        
        forecast = results.get_forecast(steps=forecast_days, exog=future_exog)
        
        # Prepare response
        forecast_data = []
        for i, date in enumerate(future_dates):
            forecast_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'forecast': round(float(forecast.predicted_mean.iloc[i]), 2),
                'lower': round(float(forecast.conf_int().iloc[i, 0]), 2),
                'upper': round(float(forecast.conf_int().iloc[i, 1]), 2)
            })
        
        # Get top items if available
        top_items = []
        if 'Items' in df.columns:
            top_items = df.groupby('Items')['Quantity'].sum()\
                        .nlargest(5)\
                        .reset_index()\
                        .rename(columns={'Items': 'item', 'Quantity': 'quantity'})\
                        .to_dict('records')
        
        return {
            'status': 'success',
            'forecast': forecast_data,
            'top_items': top_items,
            'historical': daily_data.reset_index()\
                              .rename(columns={'date': 'ds', 'Quantity': 'y'})\
                              .to_dict('records')
        }
        
    except Exception as e:
        raise ValueError(f"Data processing error: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True, port=5000)