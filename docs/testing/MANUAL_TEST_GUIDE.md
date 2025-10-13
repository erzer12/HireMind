# Resume Upload and Parsing - Manual Test Guide

## Overview
This document provides step-by-step instructions for manually testing the resume upload, parsing, and comparison features.

## Prerequisites
1. Backend server running on port 3001
2. Frontend server running on port 5173
3. At least one AI provider configured (OPENAI_API_KEY or GEMINI_API_KEY in backend/.env)

## Test Files
Sample files are provided in the project:
- `docs/samples/sample_resume.txt` - A complete resume for John Doe
- `docs/samples/sample_job_description.txt` - A job description for Senior Full Stack Developer

## Test Scenarios

### Test 1: Upload and Parse Resume (Happy Path)

**Steps:**
1. Open the application in browser: `http://localhost:5173`
2. Navigate to the "Resume" tab
3. Look for the "Upload Existing Resume (Optional)" section
4. Click "📄 Upload Resume" button
5. Select `docs/samples/sample_resume.txt` (or any PDF/DOCX resume)
6. Wait for the upload and parsing to complete

**Expected Results:**
- Upload completes successfully
- A confirmation dialog appears asking if you want to populate form fields
- If you click "OK", form fields are populated with extracted data:
  - Name: John Doe
  - Email: john.doe@email.com
  - Phone: (555) 123-4567
  - Location: San Francisco, CA
  - Skills: JavaScript, TypeScript, Python, Java, React, Node.js, etc.
  - Experience entries with positions, companies, and descriptions
  - Education entry with degree and institution
- A green status box appears showing:
  - ✅ Resume uploaded: sample_resume.txt
  - Upload date and time
  - Parsed information (name, email, skills preview)
  - "🗑️ Clear Uploaded Resume" button

### Test 2: Compare Uploaded Resume with Job Description

**Steps:**
1. After successfully uploading a resume (Test 1)
2. Scroll to "Job Description (Optional for Tailored Resume)" section
3. Paste the content from `docs/samples/sample_job_description.txt` into the textarea
4. Click "🔍 Analyze JD" button
5. Wait for analysis to complete
6. Review the analysis results
7. Click "📊 Compare Resume" button
8. Wait for comparison to complete

**Expected Results:**
- JD analysis shows:
  - Required Skills: JavaScript, TypeScript, React, Node.js, PostgreSQL, AWS, Docker, Kubernetes, Git
  - Preferred Skills: GraphQL, microservices, Redis, Jest, DevOps
  - Keywords and other relevant information
- Resume comparison shows:
  - Match Score (should be high, 80%+ for sample resume)
  - Missing Skills (if any, e.g., Angular if not in resume)
  - Strengths: Lists matching skills and experience
  - Summary Improvements: Suggestions for better alignment
  - Overall Feedback: Positive assessment of resume fit
- Console log shows: "✅ Used uploaded resume for comparison"

### Test 3: Compare Without Uploaded Resume (Form Data)

**Steps:**
1. Click "🗑️ Clear Uploaded Resume" button
2. Manually fill in some form fields:
   - Name: Jane Smith
   - Email: jane@example.com
   - Skills: Python, Django, SQL
3. Ensure job description is still in the textarea
4. Click "📊 Compare Resume" button

**Expected Results:**
- Comparison uses form data instead of uploaded resume
- Match score is lower (since form data is minimal)
- Missing Skills lists many required skills
- Suggestions indicate need to add more skills and experience

### Test 4: Replace Uploaded Resume

**Steps:**
1. Upload a resume (Test 1)
2. Note the uploaded resume status
3. Click "🔄 Replace Resume" button (same upload button)
4. Select a different resume file
5. Confirm upload

**Expected Results:**
- Old resume data is replaced with new resume data
- Status box updates with new filename and timestamp
- Form fields can be populated with new data

### Test 5: Session Persistence

**Steps:**
1. Upload a resume (Test 1)
2. Note the uploaded resume status
3. Refresh the browser page (F5)
4. Check if resume status is still shown

**Expected Results:**
- After page refresh, the uploaded resume status should still be visible
- Session data persists across page refreshes
- Can still use the uploaded resume for comparisons

### Test 6: Clear Session Resume

**Steps:**
1. Upload a resume (Test 1)
2. Click "🗑️ Clear Uploaded Resume" button
3. Confirm the action

**Expected Results:**
- Alert shows: "Uploaded resume cleared successfully"
- Green status box disappears
- Upload button changes from "🔄 Replace Resume" to "📄 Upload Resume"
- Next comparison will use form data only

### Test 7: Error Handling - Empty File

**Steps:**
1. Create an empty text file in a temporary location
2. Try to upload the empty file

**Expected Results:**
- Error message: "Failed to extract text from resume. The file may be empty or corrupted."
- Upload fails gracefully
- No data is stored in session

### Test 8: Error Handling - Invalid File Type

**Steps:**
1. Try to upload a file with unsupported extension (e.g., .zip, .exe)

**Expected Results:**
- Error message: "Invalid file type. Only PDF, DOCX, and TXT files are allowed."
- Upload is rejected before processing

### Test 9: API Endpoint Testing (Backend Only)

**Using curl or Postman:**

```bash
# 1. Upload and parse resume
curl -X POST http://localhost:3001/api/resume/parse \
  -H "Cookie: connect.sid=YOUR_SESSION_ID" \
  -F "file=@docs/samples/sample_resume.txt"

# Expected: Returns structured resume data with name, email, skills, etc.

# 2. Check session resume
curl -X GET http://localhost:3001/api/resume/session \
  -H "Cookie: connect.sid=YOUR_SESSION_ID"

# Expected: Returns hasResume: true with resume data

# 3. Compare with JD (using session data)
curl -X POST http://localhost:3001/api/resume/compare \
  -H "Cookie: connect.sid=YOUR_SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Senior Full Stack Developer with 5+ years experience..."
  }'

# Expected: Returns suggestions based on uploaded resume, usedUploadedResume: true

# 4. Clear session resume
curl -X DELETE http://localhost:3001/api/resume/session \
  -H "Cookie: connect.sid=YOUR_SESSION_ID"

# Expected: Returns success message
```

## Validation Checklist

- [ ] Resume upload accepts PDF, DOCX, and TXT files
- [ ] PDF parsing extracts text correctly (test with a real PDF)
- [ ] AI parsing converts text to structured data
- [ ] Structured data includes: name, email, phone, location, summary, skills, experience, education
- [ ] Parsed data is stored in session
- [ ] Session persists across requests
- [ ] Session expires after 24 hours
- [ ] Form fields can be auto-populated from parsed data
- [ ] Resume comparison uses uploaded resume when available
- [ ] Resume comparison uses form data when no upload available
- [ ] Match score accurately reflects resume-JD alignment
- [ ] Missing skills are correctly identified
- [ ] Strengths are highlighted based on actual resume content
- [ ] Clear resume button removes session data
- [ ] Replace resume button updates session data
- [ ] Error handling works for empty files
- [ ] Error handling works for unsupported file types
- [ ] Console logs show appropriate messages
- [ ] UI shows upload status clearly
- [ ] UI updates when resume is cleared or replaced

## Known Limitations

1. **AI Provider Required**: Resume parsing requires at least one AI provider (OpenAI or Gemini) to be configured
2. **Session Duration**: Session data expires after 24 hours of inactivity
3. **File Size Limit**: Maximum file size is 5MB
4. **Parsing Accuracy**: AI parsing accuracy depends on resume format and clarity
5. **No Persistent Storage**: Resume data is only stored in session, not in database

## Troubleshooting

### Issue: "No AI provider is configured"
**Solution**: Set OPENAI_API_KEY or GEMINI_API_KEY in backend/.env file

### Issue: Session data not persisting
**Solution**: Check that cookies are enabled in browser and backend session middleware is configured correctly

### Issue: PDF parsing fails
**Solution**: Ensure pdf-parse package is installed: `npm install pdf-parse`

### Issue: "Could not extract meaningful information"
**Solution**: Resume may be too short or poorly formatted. Try a different resume or check AI provider status.

## Success Criteria

The feature is working correctly if:
1. Real resume files can be uploaded and parsed
2. Structured data is extracted accurately
3. Session storage persists data
4. Resume comparison uses the uploaded data
5. Feedback is specific to actual resume content (not generic/template)
6. All error cases are handled gracefully
7. UI clearly shows upload status and data
