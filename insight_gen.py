import os
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import json
import io

# Configure Gemini - Fix the API key configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))  # Make sure this env var is set correctly
model = genai.GenerativeModel("gemini-2.0-flash")

app = FastAPI()

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Add both localhost variations
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add a simple GET endpoint for testing
@app.get("/")
async def root():
    return {"message": "Insight Generator API is running"}

@app.get("/test-insights")
async def get_test_insights():
    """Test endpoint that returns sample insights"""
    return {
        "insights": [
            "Your click-through rates are 15% lower than industry average - consider A/B testing different ad headlines",
            "Competitors are investing 40% more in video content - this could be a key opportunity",
            "Your conversion rates peak on Tuesday and Wednesday - optimize budget allocation accordingly",
            "Mobile traffic shows higher engagement but lower conversion - improve mobile checkout flow",
            "Competitor analysis shows they're targeting 3 demographics you're missing"
        ]
    }

@app.post("/insight_gen")
async def generate_insights(
    competitors: UploadFile = File(...),
    campaigns: UploadFile = File(...)
):
    try:
        # Validate file types
        if not competitors.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Competitors file must be CSV")
        if not campaigns.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Campaigns file must be CSV")

        # Read the uploaded files
        competitors_content = await competitors.read()
        campaigns_content = await campaigns.read()
        
        # Load CSVs from bytes
        comp_df = pd.read_csv(io.StringIO(competitors_content.decode('utf-8')))
        camp_df = pd.read_csv(io.StringIO(campaigns_content.decode('utf-8')))

        # Validate dataframes are not empty
        if comp_df.empty or camp_df.empty:
            raise HTTPException(status_code=400, detail="CSV files cannot be empty")

        # Generate more detailed summaries for better insights
        comp_summary = f"""
        Competitors Data Summary:
        - Total records: {len(comp_df)}
        - Columns: {list(comp_df.columns)}
        - Data types: {comp_df.dtypes.to_dict()}
        - Statistical summary: {comp_df.describe(include="all").to_string()}
        """
        
        camp_summary = f"""
        Campaign Data Summary:
        - Total records: {len(camp_df)}
        - Columns: {list(camp_df.columns)}
        - Data types: {camp_df.dtypes.to_dict()}
        - Statistical summary: {camp_df.describe(include="all").to_string()}
        """

        # Enhanced prompt for better insights
        prompt = f"""
        You are an expert marketing strategist and data analyst. Analyze the provided campaign data and competitor data to generate specific, actionable marketing insights.

        IMPORTANT: Return ONLY valid JSON in this exact format (no markdown, no code fences, no additional text):

        {{
          "insights": [
            "specific actionable insight 1",
            "specific actionable insight 2",
            "specific actionable insight 3",
            "specific actionable insight 4",
            "specific actionable insight 5"
          ]
        }}

        Generate exactly 5 insights that are:
        1. Specific and actionable
        2. Based on data comparisons
        3. Include metrics or percentages when possible
        4. Focus on opportunities for improvement
        5. Address different aspects: targeting, content, timing, budget, channels

        MY CAMPAIGN DATA:
        {camp_summary}

        COMPETITORS DATA:
        {comp_summary}
        """

        # Call Gemini API with error handling
        try:
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean the response (remove any markdown formatting if present)
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            elif response_text.startswith('```'):
                response_text = response_text.replace('```', '').strip()
                
        except Exception as gemini_error:
            print(f"Gemini API error: {str(gemini_error)}")
            # Return fallback insights if Gemini fails
            return {
                "insights": [
                    "Unable to generate AI insights at the moment. Please check your data and try again.",
                    "Consider analyzing your top-performing campaigns and replicating successful elements.",
                    "Review competitor strategies in your industry for new opportunities.",
                    "Optimize your campaigns based on performance metrics and conversion rates.",
                    "Test different targeting parameters to improve campaign effectiveness."
                ]
            }

        # Parse Gemini response
        try:
            insights_json = json.loads(response_text)
            
            # Validate response structure
            if not isinstance(insights_json, dict):
                raise ValueError("Response is not a JSON object")
            if "insights" not in insights_json:
                raise ValueError("Response missing 'insights' key")
            if not isinstance(insights_json["insights"], list):
                raise ValueError("'insights' must be a list")
            if len(insights_json["insights"]) == 0:
                raise ValueError("Insights list is empty")
                
            return insights_json
            
        except json.JSONDecodeError as json_error:
            print(f"JSON parsing error: {str(json_error)}")
            print(f"Raw response: {response_text}")
            return {"error": "Failed to parse AI response", "raw_response": response_text}
        except ValueError as val_error:
            print(f"Validation error: {str(val_error)}")
            return {"error": f"Invalid response format: {str(val_error)}", "raw_response": response_text}

    except HTTPException:
        raise
    except Exception as e:
        print(f"General error: {str(e)}")
        return {"error": f"Failed to process request: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)