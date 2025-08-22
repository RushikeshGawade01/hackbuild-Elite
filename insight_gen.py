import os
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import json
GEMINI_API_KEY = os.getenv("AIzaSyCmTPaNbZaOtqsZuRu2JZEDOToix3aHWAk")
# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))  # Ensure API key is set in environment
model = genai.GenerativeModel("gemini-2.0-flash")  # Use a stable model version

app = FastAPI()

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust to match your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/insight_gen")
async def generate_insights(
    competitors: UploadFile = File(...),
    campaigns: UploadFile = File(...)
):
    try:
        # Load CSVs
        comp_df = pd.read_csv(competitors.file)
        camp_df = pd.read_csv(campaigns.file)

        # Generate summaries for Gemini
        comp_summary = comp_df.describe(include="all").to_string()
        camp_summary = camp_df.describe(include="all").to_string()

        # Prompt for Gemini to generate insights
        prompt = f"""
        You are an expert marketing strategist. Analyze and compare the provided campaign data with competitor data to generate actionable insights. Return ONLY valid JSON (no commentary, no markdown code fences) in the following format:

        {{
          "insights": ["string", "string", "string", ...]
        }}

        Each insight in the "insights" array should be a concise, actionable marketing recommendation or observation based on the comparison of the datasets. Focus on key differences, strengths, weaknesses, and opportunities. Ensure insights are clear, specific, and relevant to marketing strategy.

        Competitors summary:
        {comp_summary}

        My campaigns summary:
        {camp_summary}
        """

        # Call Gemini API
        response = model.generate_content(prompt)

        # Parse Gemini response
        try:
            insights_json = json.loads(response.text)
            # Validate that the response contains an "insights" array
            if not isinstance(insights_json.get("insights"), list):
                return {"error": "Invalid response format: 'insights' must be a list"}
        except Exception as e:
            return {"error": "Failed to parse Gemini response", "raw": response.text}

        return insights_json

    except Exception as e:
        return {"error": f"Failed to process request: {str(e)}"}