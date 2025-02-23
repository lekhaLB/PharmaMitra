# PharmaMitra

PharmaMitra extracts medicine names and dosages from prescription images using Google Cloud Vision API and Groq's LLaMA-3 model.

## Setup

1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-repo/pharmamitra.git
   cd pharmamitra
   ```

2. **Install Dependencies**
   ```sh
   pip install google-cloud-vision groq
   ```

3. **Set Up API Keys**
   - Google Cloud Vision: Add your service account JSON path to `GOOGLE_APPLICATION_CREDENTIALS`.
   - Groq API: Set `GROQ_API_KEY` in environment variables.

## Usage

```sh
python main.py
```

## How It Works
1. Extracts text from a prescription image using **Google Cloud Vision**.
2. Filters medicine names and dosages using **LLaMA-3 (Groq API)**.

## Example Output
```
Extracted Medicines & Dosages:
Amoxicillin - 250mg
Paracetamol - 500mg
```

## Troubleshooting
- Ensure API keys are correctly set.
- Check if the image has clear text for OCR.
- Verify that `llama-3.3-70b-specdec` model is accessible in your Groq account.

