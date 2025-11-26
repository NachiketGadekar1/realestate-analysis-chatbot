Below is a **clear, structured end-to-end development plan** for the assignment 

---

# ✅ **Full Development Plan — Real Estate Analysis Chatbot (React + Django)**

## **PHASE 1 — Project Setup (Day 1)**

### **1.1 Backend Setup (Django)**

* Create Django project: `realestate_backend`
* Create app: `analysis`
* Install dependencies:

  * `pandas` (excel processing)
  * `openpyxl` (excel engine)
  * `django-cors-headers` (for frontend)
  * (Optional) `openai` for LLM
* Configure:

  * CORS
  * Media folder for file uploads (if implementing upload feature)

### **1.2 Frontend Setup (React)**

* Create React app: `realestate-frontend`
* Install:

  * `axios` (API calls)
  * `recharts` or `chart.js` (charts)
  * `bootstrap` (UI components)
* Setup folder structure:

```
src/
 ├─ components/
 ├─ pages/
 ├─ services/
 └─ styles/
```

---

# **PHASE 2 — Data Layer & Backend Core Logic (Days 2–3)**

## **2.1 Implement Excel Parsing**

Backend endpoint:

```
POST /api/analyze/
```

Input:

* user query (string)
* optional excel file

Tasks:

* Load Excel (preloaded or uploaded)
* Use pandas to filter by:

  * area
  * year range (if required)
* Extract:

  * price trend per year
  * demand trend per year
  * table rows for the selected area

## **2.2 Generate Summary (mock or real)**

* Mock LLM: return a hardcoded or template-based summary
* Real LLM (Optional bonus):

  * Send filtered data to OpenAI API
  * Generate insights

## **2.3 Backend Response Format**

Return JSON:

```json
{
  "summary": "Some insights...",
  "chartData": {
    "years": [2020, 2021, 2022],
    "price": [50, 60, 72],
    "demand": [120, 140, 160]
  },
  "table": [
    { "year": 2020, "price": 50, "demand":120, "area":"Wakad" }
  ]
}
```

---

# **PHASE 3 — Frontend Chat Interface (Days 4–5)**

## **3.1 Build UI Layout**

Components:

* Chat input box or search bar
* Response section
* Chart section
* Table section

### **Flow**

1. User enters query → sends request to backend
2. Receive and render:

   * Summary (text)
   * Chart (trend lines)
   * Table

## **3.2 Implement Chart**

Use **Recharts**:

* LineChart
* Two lines: price & demand
* Tooltip + legend

## **3.3 Table Display**

Using Bootstrap table:

* Paginated or scrollable

---

# **PHASE 4 — Advanced Features (Day 6)**

### Optional bonuses:

* **File upload** button for custom Excel
* **Download table as CSV**
* **Dark mode UI**
* **LLM summarization** (OpenAI API)
* **Deployment**

  * Frontend → Vercel/Netlify
  * Backend → Render/Heroku

---

# **PHASE 5 — Final Delivery (Day 7)**

### Deliverables:

✔ GitHub repo (frontend + backend)
✔ README with:

* setup steps
* API documentation
* screenshots
  ✔ Live demo link (optional but bonus)
  ✔ 1–2 min demo video showing:
* Input query
* Returning summary
* Rendering chart
* Table display

---