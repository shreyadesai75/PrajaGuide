<h1 align="center">
  <img src="https://img.shields.io/badge/PrajaGuide-AI--Powered%20Scheme%20Navigator-6C63FF?style=for-the-badge&logo=gov.uk&logoColor=white" alt="PrajaGuide"/>
</h1>

<p align="center">
  <strong>Bridging the gap between citizens and government welfare schemes using AI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask&logoColor=white"/>
  <img src="https://img.shields.io/badge/TensorFlow-2.16-FF6F00?style=flat-square&logo=tensorflow&logoColor=white"/>
  <img src="https://img.shields.io/badge/Gemini%20API-Powered-4285F4?style=flat-square&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square"/>
</p>

---

## 🧭 What is PrajaGuide?

> **"Praja"** means *citizen* in Sanskrit. **PrajaGuide** is an AI-powered web platform that helps Indian citizens discover government welfare schemes they are eligible for — in seconds.

Millions of Indians are unaware of welfare schemes they qualify for — due to language barriers, complex eligibility criteria, and inaccessible government portals. **PrajaGuide solves this** by collecting a citizen's profile through a simple 7-step wizard and using a **hybrid AI pipeline** (ML + Rule Engine + Generative AI) to recommend the most relevant schemes with personalized explanations.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🧠 **Dual AI Engine** | LSTM-based ML model for category prediction + rule-based engine for precise filtering |
| 🎯 **Smart Eligibility Scoring** | Weighted scoring system with 30+ data points (income, caste, disability, widow status, housing, etc.) |
| 💬 **AI Chatbot** | Gemini-powered conversational assistant that answers questions about any scheme |
| 📋 **Document Checklist** | Auto-generates required document list per scheme category |
| 💰 **Financial Benefit Estimation** | Regex-based extraction of monetary benefits from scheme text |
| 🗣️ **"Why Am I Eligible?"** | Personalized plain-English explanations for every recommendation |
| 📍 **State-Aware Filtering** | Filters Central + state-specific schemes based on user's location |
| 🔒 **Privacy First** | No personal data stored — all processing is stateless |

---

## 🏗️ System Architecture

```
User (7-Step Wizard)
        │
        ▼
┌───────────────────┐
│   Flask Web App   │  ← routes.py
└────────┬──────────┘
         │
    ┌────┴─────────────────────────┐
    │                              │
    ▼                              ▼
┌──────────────┐         ┌─────────────────┐
│  ML Engine   │         │   Rule Engine   │
│  (LSTM +     │         │  (30+ filters:  │
│  TensorFlow) │         │  age, income,   │
│              │         │  gender, caste, │
│  Predicts    │         │  occupation...) │
│  Categories  │         └────────┬────────┘
└──────┬───────┘                  │
       │                          │
       └──────────┬───────────────┘
                  ▼
        ┌──────────────────┐
        │  Scoring Engine  │  ← Weighted confidence score (60–99)
        │  + AI Explainer  │  ← "Why am I eligible?"
        └────────┬─────────┘
                 ▼
        ┌──────────────────┐
        │  Results Page    │  ← Top 15 schemes, sorted by score
        └──────────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Gemini Chatbot  │  ← RAG-style scheme Q&A
        └──────────────────┘
```

---

## 🤖 How the AI Pipeline Works

### 1. LSTM Classification Model
The user's profile is converted into a natural language string:
```
"I am a 30 year old Female from Maharashtra, Pune. I am Widowed with 2 dependents.
 Occupation: Agriculture, Income: Below 1 Lakh. Caste: SC. I am a widow needing pension."
```
This string is tokenized and fed into a trained **LSTM neural network** that predicts one or more relevant scheme categories (e.g., `["Pension", "Agriculture", "Women Welfare"]`).

### 2. Rule Engine (Hard Filters)
Before scoring, schemes are **hard-filtered** using logical rules:
- ❌ Reject farmer schemes if user is not in agriculture
- ❌ Reject women-only schemes for male users
- ❌ Reject SC/ST-only schemes for General category
- ❌ Reject schemes where user exceeds income/age limits (extracted via Regex)
- ❌ Reject disability schemes if user has no disability

### 3. Weighted Eligibility Scoring
Each passing scheme receives a score using 30+ weighted signals:

| Signal | Weight |
|---|---|
| Primary need matches scheme category | +100 |
| User's state matches scheme state | +50 |
| Occupation-specific keyword match | +40 |
| Widow / disability / kutcha house match | +20–35 |
| SC/ST caste match | +20 |
| ML model category confidence | +25 |

### 4. Gemini-Powered Chatbot (RAG)
The chatbot uses **Retrieval-Augmented Generation**:
1. Retrieves top-k relevant schemes from DB using keyword matching
2. Builds a context string from scheme details
3. Sends context + user question to **Google Gemini API**
4. Returns a grounded, factual response

---

## 📁 Project Structure

```
PrajaGuide/
│
├── app/
│   ├── __init__.py          # Flask app factory, DB init
│   ├── routes.py            # Main wizard logic, AI pipeline orchestration
│   ├── ml_engine.py         # LSTM model loading & prediction
│   ├── rule_engine.py       # Hard filters, scoring, document assignment
│   ├── models.py            # SQLAlchemy Scheme model
│   ├── helpers.py           # Shared utility functions
│   ├── static/              # CSS, JavaScript
│   └── templates/           # Jinja2 HTML templates
│
├── chatbot/
│   ├── app.py               # Gemini chatbot Flask Blueprint
│   ├── scheme_loader.py     # DB loader + keyword retrieval for RAG
│   └── test_models.py       # Chatbot unit tests
│
├── models/                  # (gitignored) Trained LSTM model artifacts
│   ├── praja_guide_model.h5
│   ├── tokenizer.pickle
│   └── label_encoder.pickle
│
├── data/                    # (gitignored) Raw scheme datasets
├── training/                # (gitignored) Model training scripts
├── ingest_data.py           # Loads scheme CSV into PostgreSQL DB
├── evaluate.py              # Model evaluation metrics
├── run.py                   # App entry point
├── requirements.txt
└── .env.example             # Environment variable template
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- PostgreSQL (or SQLite for dev)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shreyadesai75/PrajaGuide.git
cd PrajaGuide

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY and DATABASE_URL

# 5. Ingest scheme data into the database
python ingest_data.py

# 6. Run the application
python run.py
```

The app will be available at `http://localhost:5000`

---

## ⚙️ Environment Variables

Create a `.env` file from the provided template:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `DATABASE_URL` | PostgreSQL connection string (falls back to SQLite) |

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, Flask 3.0 |
| **AI/ML** | TensorFlow 2.16 (LSTM), scikit-learn |
| **Generative AI** | Google Gemini API (`google-generativeai`) |
| **Database** | PostgreSQL (prod), SQLite (dev) via SQLAlchemy |
| **Data Processing** | Pandas, NumPy |
| **Frontend** | Jinja2, HTML5, CSS3, Vanilla JS |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ to empower every Indian citizen with the welfare they deserve.
</p>
