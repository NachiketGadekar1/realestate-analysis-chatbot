import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os

# Define constants for column names for easier maintenance
AREA_COL = 'final location'
PRICE_COL = 'flat - weighted average rate'
DEMAND_COL = 'total sold - igr'
YEAR_COL = 'year' # Assuming 'year' is the column name for the year

@csrf_exempt
def analyze_data(request):
    if request.method == 'POST':
        try:
            # Check for file upload
            if 'file' in request.FILES:
                uploaded_file = request.FILES['file']
                # Use the uploaded file in memory
                df = pd.read_excel(uploaded_file)
                query_area = request.POST.get('query', '').lower()
            else:
                # Fallback to local file
                project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
                excel_path = os.path.join(project_root, 'Sample_data.xlsx')

                if not os.path.exists(excel_path):
                    return JsonResponse({"error": f"Sample_data.xlsx not found at the expected path: {excel_path}"}, status=500)
                
                df = pd.read_excel(excel_path)
                data = json.loads(request.body)
                query_area = data.get('query', '').lower()

            # Verify that all necessary columns exist in the DataFrame
            required_cols = [AREA_COL, PRICE_COL, DEMAND_COL, YEAR_COL]
            missing_cols = [col for col in required_cols if col not in df.columns]
            if missing_cols:
                return JsonResponse({"error": f"Missing required columns in Excel file: {', '.join(missing_cols)}"}, status=500)

            if not query_area:
                 return JsonResponse({"error": "A query area must be provided."}, status=400)

            # Filter data based on query_area
            filtered_df = df[df[AREA_COL].str.lower().str.contains(query_area, na=False)].copy()

            if filtered_df.empty:
                return JsonResponse({
                    "summary": f"No data found for the area: {query_area.capitalize()}.",
                    "chartData": {"years": [], "price": [], "demand": []},
                    "table": []
                })

            # Ensure data types are correct before processing
            filtered_df[PRICE_COL] = pd.to_numeric(filtered_df[PRICE_COL], errors='coerce')
            filtered_df[DEMAND_COL] = pd.to_numeric(filtered_df[DEMAND_COL], errors='coerce')
            filtered_df.dropna(subset=[PRICE_COL, DEMAND_COL], inplace=True)
            
            # Group by year and calculate mean for price and demand
            trend_data = filtered_df.groupby(YEAR_COL)[[PRICE_COL, DEMAND_COL]].mean().reset_index()
            
            years = trend_data[YEAR_COL].tolist()
            prices = [round(p, 2) for p in trend_data[PRICE_COL].tolist()]
            demands = [round(d) for d in trend_data[DEMAND_COL].tolist()] # Demands are whole numbers

            # Generate a mock summary
            summary = (f"Analysis for {query_area.capitalize()}: "
                       f"The average price ranged from {filtered_df[PRICE_COL].min():.2f} to {filtered_df[PRICE_COL].max():.2f} "
                       f"between {int(filtered_df[YEAR_COL].min())} and {int(filtered_df[YEAR_COL].max())}. "
                       f"The total demand over this period was approximately {int(filtered_df[DEMAND_COL].sum())} units.")

            # Prepare data for the response
            table_data = filtered_df.to_dict(orient='records')
            response_data = {
                "summary": summary,
                "chartData": {"years": years, "price": prices, "demand": demands},
                "table": table_data
            }
            return JsonResponse(response_data)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format in request body."}, status=400)
        except FileNotFoundError:
            return JsonResponse({"error": "The data file 'Sample_data.xlsx' was not found."}, status=500)
        except KeyError as e:
             return JsonResponse({"error": f"A required data column is missing: {e}"}, status=500)
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)
            
    return JsonResponse({"error": "This endpoint only supports POST requests."}, status=405)
