import pandas as pd
import os

try:
    # Construct the full path to the Excel file
    # This script is in realestate_backend, Sample_data.xlsx is also in realestate_backend
    excel_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Sample_data.xlsx')
    
    df = pd.read_excel(excel_path)
    print("Columns in Excel file:", df.columns.tolist())
    print("\nFirst 5 rows of Excel file:")
    print(df.head())
except FileNotFoundError:
    print("Error: Sample_data.xlsx not found at the expected path.")
except Exception as e:
    print(f"An error occurred: {e}")

