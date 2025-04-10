import pandas as pd
from datetime import datetime

def process_datetime_and_save(input_csv_path, output_csv_path):
    # Load the original data
    df = pd.read_csv(input_csv_path)
    
    # Convert DateTime column to datetime type
    if 'DateTime' in df.columns:
        df['DateTime'] = pd.to_datetime(df['DateTime'])
    else:
        raise ValueError("Column 'DateTime' not found in the CSV file")
    
    # Extract date and time into separate columns
    df['date'] = df['DateTime'].dt.date
    df['time'] = df['DateTime'].dt.time
    
    # Define Indian holidays for the relevant year(s)
    indian_holidays = {
        # 2023 holidays
        '2023-01-26': 'Republic Day',
        '2023-08-15': 'Independence Day',
        '2023-10-02': 'Gandhi Jayanti',
        '2023-01-14': 'Makar Sankranti',
        '2023-03-08': 'Holi',
        '2023-04-22': 'Eid al-Fitr',
        '2023-08-29': 'Raksha Bandhan',
        '2023-08-30': 'Janmashtami',
        '2023-09-19': 'Ganesh Chaturthi',
        '2023-10-24': 'Diwali',
        '2023-11-12': 'Guru Nanak Jayanti',
        '2023-12-25': 'Christmas',
        
        # 2024 holidays
        '2024-01-26': 'Republic Day',
        '2024-08-15': 'Independence Day',
        '2024-10-02': 'Gandhi Jayanti',
        '2024-01-15': 'Makar Sankranti',
        '2024-03-25': 'Holi',
        '2024-04-11': 'Eid al-Fitr',
        '2024-08-19': 'Raksha Bandhan',
        '2024-08-26': 'Janmashtami',
        '2024-09-07': 'Ganesh Chaturthi',
        '2024-11-01': 'Diwali',
        '2024-11-15': 'Guru Nanak Jayanti',
        '2024-12-25': 'Christmas',
        
        # 2025 holidays
        '2025-01-26': 'Republic Day',
        '2025-03-31': 'Holi', # Added Holi for your example date
        '2025-08-15': 'Independence Day',
        '2025-10-02': 'Gandhi Jayanti',
        '2025-01-03': 'Makar Sankranti',
        '2025-03-14': 'Maha Shivaratri',
        '2025-04-01': 'Eid al-Fitr',
        '2025-08-08': 'Raksha Bandhan',
        '2025-08-16': 'Janmashtami',
        '2025-08-28': 'Ganesh Chaturthi',
        '2025-10-22': 'Diwali',
        '2025-11-05': 'Guru Nanak Jayanti',
        '2025-12-25': 'Christmas',
    }
    
    # Ensure Holiday column exists
    if 'Holiday' not in df.columns:
        df['Holiday'] = None
    
    # Assign holidays based on date
    for index, row in df.iterrows():
        date_str = row['date'].strftime('%Y-%m-%d')
        if date_str in indian_holidays:
            df.at[index, 'Holiday'] = indian_holidays[date_str]
        else:
            df.at[index, 'Holiday'] = 'None'
    
    # Save to new CSV file
    df.to_csv(output_csv_path, index=False)
    
    print(f"Processed data saved to {output_csv_path}")
    return df

# Example usage
process_datetime_and_save('input_data.csv', 'processed_data.csv')