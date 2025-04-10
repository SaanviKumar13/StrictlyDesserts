import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import statsmodels.api as sm

def build_forecast_model(data_path, forecast_days=30):
    # Load data
    df = pd.read_csv(data_path)
    
    # Ensure date column is in datetime format
    df['date'] = pd.to_datetime(df['date'])
    
    # Aggregate data by date (summing quantities)
    daily_data = df.groupby('date')['Quantity'].sum().reset_index()
    
    # Set date as index for time series analysis
    daily_data = daily_data.set_index('date')
    
    # Create features
    daily_data['dayofweek'] = daily_data.index.dayofweek
    daily_data['month'] = daily_data.index.month
    daily_data['year'] = daily_data.index.year
    daily_data['is_weekend'] = (daily_data.index.dayofweek >= 5).astype(int)
    
    # Add holiday indicator if available
    if 'Holiday' in df.columns:
        # Create holiday dataframe
        holidays = df[df['Holiday'] != 'None'].drop_duplicates(['date', 'Holiday'])
        # Create a binary holiday indicator
        if not holidays.empty:
            holiday_dates = pd.to_datetime(holidays['date'].unique())
            daily_data['is_holiday'] = daily_data.index.isin(holiday_dates).astype(int)
        else:
            daily_data['is_holiday'] = 0
    else:
        daily_data['is_holiday'] = 0
    
    # Add temperature if available
    if 'Temperature (°C)' in df.columns:
        temp_data = df.groupby('date')['Temperature (°C)'].mean()
        daily_data = daily_data.join(temp_data, how='left')
        daily_data['Temperature (°C)'].fillna(method='ffill', inplace=True)
    
    # Plot the time series
    plt.figure(figsize=(12, 6))
    plt.plot(daily_data['Quantity'])
    plt.title('Daily Quantity Sales')
    plt.grid(True)
    plt.savefig('daily_sales.png')
    plt.close()
    
    # Perform seasonal decomposition
    decomposition = seasonal_decompose(daily_data['Quantity'], model='multiplicative', period=7)
    
    # Plot decomposition
    fig, (ax1, ax2, ax3, ax4) = plt.subplots(4, 1, figsize=(12, 10))
    decomposition.observed.plot(ax=ax1)
    ax1.set_title('Observed')
    decomposition.trend.plot(ax=ax2)
    ax2.set_title('Trend')
    decomposition.seasonal.plot(ax=ax3)
    ax3.set_title('Seasonality')
    decomposition.resid.plot(ax=ax4)
    ax4.set_title('Residuals')
    plt.tight_layout()
    plt.savefig('decomposition.png')
    plt.close()
    
    # Prepare data for modeling
    y = daily_data['Quantity']
    
    # Create exogenous variables
    exog_vars = ['dayofweek', 'month', 'is_weekend', 'is_holiday']
    if 'Temperature (°C)' in daily_data.columns:
        exog_vars.append('Temperature (°C)')
    
    X = daily_data[exog_vars]
    
    # Split data for training
    train_size = int(len(y) * 0.8)
    y_train, y_test = y[:train_size], y[train_size:]
    X_train, X_test = X[:train_size], X[train_size:]
    
    # Fit SARIMAX model - Auto ARIMA approach
    print("Finding optimal SARIMA parameters...")
    best_aic = float('inf')
    best_params = None
    
    # Define parameter grid (simplified for speed)
    p_values = [0, 1, 2]
    d_values = [0, 1]
    q_values = [0, 1, 2]
    P_values = [0, 1]
    D_values = [0, 1]
    Q_values = [0, 1]
    s_values = [7]  # Weekly seasonality
    
    # Try a few common models instead of exhaustive search
    param_combinations = [
        (1, 1, 1, 1, 1, 1, 7),  # Full model
        (1, 1, 1, 0, 1, 0, 7),  # Simpler seasonal
        (2, 1, 2, 1, 1, 1, 7),  # More complex
        (0, 1, 1, 0, 1, 1, 7),  # Simpler trend
        (1, 0, 1, 1, 0, 1, 7),  # No differencing
    ]
    
    for param in param_combinations:
        p, d, q, P, D, Q, s = param
        try:
            model = SARIMAX(
                y_train,
                exog=X_train,
                order=(p, d, q),
                seasonal_order=(P, D, Q, s),
                enforce_stationarity=False,
                enforce_invertibility=False
            )
            results = model.fit(disp=False)
            aic = results.aic
            
            if aic < best_aic:
                best_aic = aic
                best_params = param
                print(f"New best AIC: {best_aic}, Params: {best_params}")
        except:
            continue
    
    print(f"Best SARIMA parameters: {best_params} with AIC: {best_aic}")
    
    # Fit the model with best parameters
    p, d, q, P, D, Q, s = best_params
    final_model = SARIMAX(
        y,  # Use all data for final model
        exog=X,
        order=(p, d, q),
        seasonal_order=(P, D, Q, s),
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    final_results = final_model.fit(disp=False)
    
    # Create future dates for forecasting
    last_date = daily_data.index[-1]
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=forecast_days)
    
    # Create future exogenous variables
    future_exog = pd.DataFrame(index=future_dates)
    future_exog['dayofweek'] = future_exog.index.dayofweek
    future_exog['month'] = future_exog.index.month
    future_exog['year'] = future_exog.index.year
    future_exog['is_weekend'] = (future_exog.index.dayofweek >= 5).astype(int)
    
    # Add holiday indicator
    future_exog['is_holiday'] = 0
    if 'Holiday' in df.columns and not holidays.empty:
        # This is a simplification - in a real scenario, you'd want to use a calendar of future holidays
        for future_date in future_dates:
            # Check if the month and day match any holiday in the training data
            for _, holiday_row in holidays.iterrows():
                holiday_date = pd.to_datetime(holiday_row['date'])
                if future_date.month == holiday_date.month and future_date.day == holiday_date.day:
                    future_exog.loc[future_date, 'is_holiday'] = 1
    
    # Add temperature
    if 'Temperature (°C)' in daily_data.columns:
        # Use the average temperature by month from historical data
        monthly_avg_temp = daily_data.groupby(daily_data.index.month)['Temperature (°C)'].mean()
        for date in future_dates:
            future_exog.loc[date, 'Temperature (°C)'] = monthly_avg_temp[date.month]
    
    # Make predictions
    forecast = final_results.get_forecast(steps=forecast_days, exog=future_exog[exog_vars])
    forecast_mean = forecast.predicted_mean
    forecast_ci = forecast.conf_int()
    
    # Convert to DataFrame with dates
    forecast_df = pd.DataFrame({
        'ds': future_dates,
        'yhat': forecast_mean,
        'yhat_lower': forecast_ci.iloc[:, 0],
        'yhat_upper': forecast_ci.iloc[:, 1]
    })
    
    # Plot the forecast
    plt.figure(figsize=(12, 6))
    plt.plot(daily_data.index, daily_data['Quantity'], label='Historical')
    plt.plot(forecast_df['ds'], forecast_df['yhat'], color='red', label='Forecast')
    plt.fill_between(
        forecast_df['ds'],
        forecast_df['yhat_lower'],
        forecast_df['yhat_upper'],
        color='pink', alpha=0.3
    )
    plt.title('Quantity Sales Forecast')
    plt.grid(True)
    plt.legend()
    plt.savefig('forecast.png')
    plt.close()
    
    # Save the forecast to CSV
    forecast_df.to_csv('quantity_forecast.csv', index=False)
    
    # Round values for better readability
    forecast_df['yhat'] = forecast_df['yhat'].round().astype(int)
    forecast_df['yhat_lower'] = forecast_df['yhat_lower'].round().astype(int)
    forecast_df['yhat_upper'] = forecast_df['yhat_upper'].round().astype(int)
    forecast_df.columns = ['Date', 'Recommended Quantity', 'Min Quantity', 'Max Quantity']
    
    return final_results, forecast_df, daily_data

def analyze_top_items(data_path, top_n_items=5):
    # Load data
    df = pd.read_csv(data_path)
    
    # Ensure date column is in datetime format
    df['date'] = pd.to_datetime(df['date'])
    
    # Get the top N items by total quantity
    top_items = df.groupby('Items')['Quantity'].sum().nlargest(top_n_items)
    
    print(f"\nTop {top_n_items} Items by Total Quantity:")
    for item, quantity in top_items.items():
        print(f"{item}: {quantity}")
    
    # Analyze weekly patterns for top items
    results = {}
    for item in top_items.index:
        item_data = df[df['Items'] == item]
        if len(item_data) > 7:  # Enough data for weekly pattern
            item_daily = item_data.groupby('date')['Quantity'].sum()
            item_daily = item_daily.reindex(pd.date_range(item_daily.index.min(), item_daily.index.max(), freq='D'))
            item_daily = item_daily.fillna(0)
            
            # Calculate day of week averages
            dow_avg = item_daily.groupby(item_daily.index.dayofweek).mean()
            
            # Store results
            results[item] = dow_avg
    
    # Plot day of week patterns for top items
    plt.figure(figsize=(12, 8))
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    for item, dow_data in results.items():
        plt.plot(days, dow_data.values, marker='o', label=item)
    
    plt.title('Average Daily Quantity by Day of Week for Top Items')
    plt.xlabel('Day of Week')
    plt.ylabel('Average Quantity')
    plt.grid(True)
    plt.legend()
    plt.savefig('dow_patterns.png')
    plt.close()
    
    return top_items, results

# Example usage
if __name__ == "__main__":
    # Replace with your actual file path
    data_path = "processed_data.csv"
    
    print("Building forecasting model for overall quantities...")
    model, forecast_df, historical_data = build_forecast_model(data_path)
    
    print("\nAnalyzing top items...")
    top_items, item_patterns = analyze_top_items(data_path)
    
    print("\nForecast Summary:")
    print(forecast_df.to_string(index=False))
    
    print("\nNote: The 'Recommended Quantity' column shows the predicted quantity to prepare each day.")
    print("The 'Min Quantity' and 'Max Quantity' provide a 95% confidence interval for planning purposes.")