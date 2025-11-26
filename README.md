# Real Estate Analysis Chatbot

This project implements a full-stack web application for analyzing real estate data. It features a React frontend with a chat-like interface that interacts with a Django backend. Users can query real estate localities, upload custom Excel datasets, and receive natural-language summaries, interactive trend charts, and detailed data tables.

## Features

-   **Chat-style Interface:** User-friendly input for real estate queries.
-   **Excel Data Processing:** Backend (Django + Pandas) parses and filters real estate data from Excel files.
-   **Dynamic Data Source:** Supports analysis using a pre-loaded `Sample_data.xlsx` or a custom uploaded Excel file.
-   **Natural Language Summary:** Generates a mock summary of the analysis (extensible to LLM integration).
-   **Interactive Charts:** Displays price and demand trends using Recharts.
-   **Detailed Data Table:** Presents filtered data in a scrollable, styled table with a fixed header and numerical alignment.
-   **CSV Download:** Allows users to download the filtered table data as a CSV file.
-   **Responsive Design:** Styled with Bootstrap for a professional and consistent look across devices.

## Technologies Used

**Backend (Django)**
*   Python 3.x
*   Django
*   Django CORS Headers
*   Pandas (for data manipulation)
*   Openpyxl (for reading Excel files)

**Frontend (React)**
*   React.js
*   Vite (for fast development server and build)
*   Axios (for API requests)
*   React-Bootstrap (for UI components)
*   Recharts (for charting)
*   Bootstrap Icons (for icons)

## Setup and Installation

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Creasophere_Technologies_assesment # Or your project root directory
```

### 2. Backend Setup

Navigate to the `realestate_backend` directory:

```bash
cd realestate_backend
```

**Create and Activate Virtual Environment:**

```bash
python3 -m venv backend_venv
source backend_venv/bin/activate
```

**Install Python Dependencies:**

```bash
pip install django djangorestframework django-cors-headers pandas openpyxl
```
*(Note: `djangorestframework` was not explicitly installed during the conversation, but is typically used with Django APIs. It's added here for completeness, though the current API implementation doesn't strictly require it for simple `JsonResponse`.)*

**Apply Migrations (Optional, but Recommended):**

```bash
python manage.py migrate
```

**Run the Backend Server:**

```bash
python manage.py runserver 8000
```
The backend API will be accessible at `http://localhost:8000/`.

### 3. Frontend Setup

Open a new terminal and navigate to the `realestate_frontend` directory:

```bash
cd ../realestate_frontend
```

**Install Node.js Dependencies:**

```bash
npm install
```

**Run the Frontend Development Server:**

```bash
npm run dev
```
The React application will be accessible at `http://localhost:5173/` (or similar, as reported by Vite).

## Usage

1.  **Open the Frontend:** Navigate to `http://localhost:5173/` (or the address provided by `npm run dev`) in your web browser.
2.  **Enter a Query:** In the "Location Name" input field, type the name of a real estate locality (e.g., "Wakad", "Akurdi", "Ambegaon Budruk").
3.  **Upload Custom Data (Optional):** You can optionally click "Upload Custom Data (Optional)" to select an Excel file (`.xlsx` or `.xls`) from your local machine. If uploaded, the analysis will use this file instead of the default `Sample_data.xlsx`.
4.  **Analyze:** Click the "Analyze" button.
5.  **View Results:** The application will display:
    *   A natural-language summary of the analysis.
    *   An interactive line chart showing price and demand trends over the years.
    *   A detailed table of the filtered data.
6.  **Download CSV:** If a table is displayed, a "Download CSV" button will appear, allowing you to export the detailed data.
