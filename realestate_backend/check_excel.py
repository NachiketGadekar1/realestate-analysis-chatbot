import pandas as pd
import os

try:
    excel_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Sample_data.xlsx')
    
    df = pd.read_excel(excel_path)
    
    location_col = 'final location'
    
    if location_col in df.columns:
        unique_locations = df[location_col].unique()
        print("Available locations in the Excel file:")
        for location in sorted(unique_locations):
            print(f"- {location}")
    else:
        print(f"Error: The column '{location_col}' was not found in the Excel file.")
        print("Available columns are:", df.columns.tolist())

except FileNotFoundError:
    print("Error: Sample_data.xlsx not found at the expected path.")
except Exception as e:
    print(f"An error occurred: {e}")