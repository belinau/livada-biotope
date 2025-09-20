/**
 * Instructions for creating a new Google Form for the leaderboard
 * 
 * 1. Go to https://forms.google.com
 * 2. Create a new form with these fields:
 *    - Field 1: "Player Name" (Short Answer)
 *    - Field 2: "Score" (Short Answer)
 * 3. Click the three dots menu (⋮) and select "Get pre-filled link"
 * 4. The URL will contain the field IDs in this format:
 *    https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.ID1=Player+Name&entry.ID2=Score
 * 5. Extract the FORM_ID and the entry IDs from the URL
 * 6. Update your environment variables in Netlify with:
 *    GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/FORM_ID/formResponse
 *    GOOGLE_FORM_NAME_FIELD=entry.ID1
 *    GOOGLE_FORM_SCORE_FIELD=entry.ID2
 */