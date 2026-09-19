# Legal Metrology (Packaged Commodities) Compliance Checking System

**Problem Statement ID**: 26034 (Smart India Hackathon / SIH)  
**Organization**: Ministry of Consumer Affairs, Food & Public Distribution  
**Department**: Department of Consumer Affairs (DoCA)  
**Category**: Software / Miscellaneous  

---

## 📌 Executive Summary

Under the **Legal Metrology Act, 2009** and the **Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011)**, all packaged commodities sold across Indian retail and e-commerce platforms must display mandatory statutory declarations (Manufacturer details, Net Quantity in metric units, Maximum Retail Price inclusive of all taxes, Unit Sale Price, packaging dates, and 4-point consumer grievance contacts).

This software system provides an **AI-powered automated inspection platform** that scans packaged commodity labels, extracts declarations using **Gemini Multimodal Vision AI**, evaluates them against a **deterministic Legal Metrology Rule Engine**, identifies statutory violations, calculates Unit Sale Price math accuracy, and generates **official digital PDF compliance inspection notices**.

---

## 🚀 Key Features

1. **Multimodal AI & OCR Extraction**:
   - Uses `gemini-2.5-flash` with strict structured JSON schema to parse labels with high fidelity (handles curved surfaces, glossy plastic foils, mixed English/Hindi scripts).
   - Built-in fallback parser for instant offline testing and demonstration.
2. **Deterministic Legal Metrology (PCR 2011) Rule Engine**:
   - **Rule 6(1)(a)**: Name & complete factory/registered address of manufacturer, packer, or importer.
   - **Rule 6(1)(b)**: Generic or common name of the commodity.
   - **Rule 6(1)(c)**: Net quantity validation enforcing standard metric units (`g`, `kg`, `ml`, `l`, `N`).
   - **Rule 6(1)(d)**: Month and year of manufacture / pre-packing.
   - **Rule 6(1)(e)**: MRP verification enforcing mandatory statutory phrasing `"MRP Rs. XX.XX (incl. of all taxes)"`.
   - **Rule 6(11)**: Unit Sale Price (USP) requirement and **automated arithmetic cross-check** (`MRP / Net Qty = Declared USP`).
   - **Rule 6(1)(n)**: 4-point consumer care grievance check (Contact person, telephone, mandatory email ID, and postal address).
   - **Rule 6(1)(10)**: Country of origin declaration.
   - **Rule 7 & Schedule II**: Font size & Principal Display Panel (PDP) minimum legibility check.
   - **Rule 9**: Recognized language enforcement (Hindi / English).
   - **Allied FSSAI Regulations**: 14-digit FSSAI License Number and Green/Brown Veg/Non-Veg indicator.
3. **Automated Inspection Notice Generator (PDF Export)**:
   - 1-click generation of official Government of India / Department of Consumer Affairs compliance inspection certificate with annotated evidence and remediation instructions.
4. **Officer Inspection Web Dashboard**:
   - Drag & drop image upload or live webcam label scanner.
   - 1-click pre-configured test samples (Kurkure compliant, Lay's missing tax clause, Parle-G USP math error, Maggi missing address).
   - Radial compliance score gauge (0-100%).
   - Historical audit log with search, brand filtering, and trend analytics.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.13, FastAPI, Pydantic v2, Uvicorn, ReportLab (PDF generation), SQLite.
- **AI Extraction**: Google Gemini Vision API (`google-genai` SDK / `gemini-2.5-flash`).
- **Frontend**: Pure JavaScript, React 18, Vite, Tailwind-compatible modern CSS, Lucide React Icons.

---

## 🏁 Quick Start & Running Locally

### Prerequisites
- Python 3.10+
- Node.js v18+ and npm

### 1. Backend Setup
```bash
# Activate virtual environment
.\venv\Scripts\activate

# Run FastAPI backend
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API will be live at: `http://127.0.0.1:8000`  
API Swagger Docs: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend UI will be live at: `http://localhost:5173`

### 3. One-Click Launcher (Windows)
Double-click `run_app.bat` to launch both backend and frontend simultaneously.

---

## 🧪 Testing with Real Food Packets

1. **Option A (Instant Test Samples)**:
   - Click any of the 4 quick test cards in the UI:
     * **Sample 1 (Kurkure)**: 100% Compliant label.
     * **Sample 2 (Lay's)**: Flags **Rule 6(1)(e)** violation (MRP omits `"incl. of all taxes"`).
     * **Sample 3 (Parle-G)**: Flags **Rule 6(11)** math discrepancy (Declared USP differs from computed rate) and missing email.
     * **Sample 4 (Maggi)**: Flags **Rule 6(1)(a)** & **Rule 6(1)(n)** critical missing factory address and consumer cell.
2. **Option B (Your Own Food Packet Photo)**:
   - Snap a photo of any food packet from your kitchen or phone camera.
   - Upload the image or click **"Use Camera"** in the web dashboard.
   - If you have a Gemini API key, click **"Configure API Key"** in the top navigation bar to activate live Gemini multimodal extraction on any real-world image.

---

## 📂 Project Structure

```
Check-Packaging/
├── backend/
│   ├── config.py             # System paths and environment config
│   ├── models.py             # Pydantic schemas for labels, rules, and reports
│   ├── rules_engine.py       # Deterministic Legal Metrology PCR 2011 engine
│   ├── extractor.py          # Gemini Vision AI extractor + fallback parser
│   ├── pdf_generator.py      # ReportLab official PDF inspection notice generator
│   ├── db.py                 # SQLite database for audit history and analytics
│   ├── main.py               # FastAPI REST routes
│   └── sample_data/          # Bundled sample label images
├── frontend/
│   ├── src/
│   │   ├── components/       # Header, UploadZone, Scorecard, Checklist, MathEngine, Modals
│   │   ├── App.jsx           # Main React state & orchestration
│   │   ├── main.jsx          # React DOM mounting
│   │   └── index.css         # GovTech dark/light design system
│   ├── package.json          # Pure JavaScript React dependencies
│   └── vite.config.js        # Vite config with backend proxy
├── run_app.bat               # 1-click Windows runner
└── README.md                 # System documentation
```

---

## ⚖️ Statutory References

- **The Legal Metrology Act, 2009** (Act No. 1 of 2010), Sections 18, 36, 38.
- **The Legal Metrology (Packaged Commodities) Rules, 2011** (G.S.R. 202(E)), Rules 6, 7, 8, 9, 11, 12, Schedule II.
- **Legal Metrology (Packaged Commodities) Amendment Rules, 2021 & 2022** (Unit Sale Price & Mandatory E-Commerce Declarations).
- **Food Safety and Standards (Packaging and Labelling) Regulations**.
