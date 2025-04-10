from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX
import tempfile
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

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
            # Clean up the uploaded file
            if os.path.exists(filepath):
                os.remove(filepath)
    
    return jsonify({'error': 'Invalid file type'}), 400

def generate_forecast(filepath, forecast_days=30):
    # Load data
    df = pd.read_csv(filepath)
    
    # Ensure date column is in datetime format
    df['date'] = pd.to_datetime(df['date'])
    
    # Aggregate data by date (summing quantities)
    daily_data = df.groupby('date')['Quantity'].sum().reset_index()
    daily_data = daily_data.set_index('date')
    
    # Create features
    daily_data['dayofweek'] = daily_data.index.dayofweek
    daily_data['month'] = daily_data.index.month
    daily_data['is_weekend'] = (daily_data.index.dayofweek >= 5).astype(int)
    
    # Add holiday indicator if available
    if 'Holiday' in df.columns:
        holidays = df[df['Holiday'] != 'None'].drop_duplicates(['date', 'Holiday'])
        if not holidays.empty:
            holiday_dates = pd.to_datetime(holidays['date'].unique())
            daily_data['is_holiday'] = daily_data.index.isin(holiday_dates).astype(int)
        else:
            daily_data['is_holiday'] = 0
    else:
        daily_data['is_holiday'] = 0
    
    # Prepare data for modeling
    y = daily_data['Quantity']
    X = daily_data[['dayofweek', 'month', 'is_weekend', 'is_holiday']]
    
    # Fit SARIMAX model (using simplified parameters for demo)
    model = SARIMAX(
        y,
        exog=X,
        order=(1, 1, 1),
        seasonal_order=(1, 1, 1, 7),
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    results = model.fit(disp=False)
    
    # Create future dates for forecasting
    last_date = daily_data.index[-1]
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=forecast_days)
    
    # Create future exogenous variables
    future_exog = pd.DataFrame(index=future_dates)
    future_exog['dayofweek'] = future_exog.index.dayofweek
    future_exog['month'] = future_exog.index.month
    future_exog['is_weekend'] = (future_exog.index.dayofweek >= 5).astype(int)
    future_exog['is_holiday'] = 0
    
    # Make predictions
    forecast = results.get_forecast(steps=forecast_days, exog=future_exog)
    forecast_mean = forecast.predicted_mean
    forecast_ci = forecast.conf_int()
    
    # Prepare response
    forecast_data = []
    for i, date in enumerate(future_dates):
        forecast_data.append({
            'date': date.strftime('%Y-%m-%d'),
            'forecast': round(forecast_mean.iloc[i]),
            'lower': round(forecast_ci.iloc[i, 0]),
            'upper': round(forecast_ci.iloc[i, 1])
        })
    
    # Get top items
    top_items = df.groupby('Items')['Quantity'].sum().nlargest(5).reset_index()
    top_items = top_items.rename(columns={'Items': 'item', 'Quantity': 'quantity'})
    top_items = top_items.to_dict('records')
    
    return {
        'forecast': forecast_data,
        'top_items': top_items,
        'historical': y.reset_index().rename(columns={'date': 'ds', 'Quantity': 'y'}).to_dict('records')
    }

if __name__ == '__main__':
    app.run(debug=True, port=5000)