# HireMind

🧠 **HireMind** is an AI-powered full-stack web application that helps users create professional resumes, cover letters, and portfolio webpages using advanced language models.

## Features

- 📝 **Resume Generator**: Create ATS-friendly professional resumes based on your experience and skills
  - **Multiple Templates**: Choose from modern, classic, or minimal designs with visual card-based selection
  - **Job Description Upload**: Upload or paste job descriptions (PDF, DOCX, TXT) for targeted resume creation
  - **Resume Upload**: Upload existing resumes to extract and pre-fill information
  - **AI-Powered Tailoring**: Generate resumes tailored to specific job descriptions with keyword optimization
  - **Smart Suggestions**: Get AI recommendations for missing skills, keywords, and improvements
  - **Resume Comparison**: Compare your resume against job descriptions with match scoring
  - **HTML Export**: Download resumes as formatted HTML files
  - **PDF Export**: Print directly to PDF from browser
  - **Template Customization**: Easy to add new templates
- 💼 **Cover Letter Generator**: Generate tailored cover letters for specific job applications
- 🌐 **Portfolio Generator**: Build a beautiful HTML portfolio webpage showcasing your projects
- 🤖 **AI-Powered**: Leverages OpenAI's GPT models for intelligent content generation
- 🔄 **AI Provider Fallback**: Automatic fallback to alternative AI providers (Gemini) when OpenAI quota is exceeded
- 🎨 **Modern UI**: Clean and intuitive React-based user interface with enhanced template selection
- 📥 **Export Options**: Copy to clipboard or download generated content

## Tech Stack

### Backend
- **Node.js** with Express.js
- **OpenAI API** for AI-powered content generation (Primary)
- **Google Gemini API** for AI fallback support (Optional)
- RESTful API architecture
- CORS enabled for cross-origin requests

### Frontend
- **React** with Vite
- Modern component-based architecture
- Responsive design
- Interactive forms with real-time validation

## Project Structure

```
HireMind/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (AI service)
│   │   ├── templates/      # Resume templates (HTML/CSS)
│   │   ├── middleware/     # Express middleware
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── .env.example
│
├── README.md
└── TEMPLATES.md           # Template documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   
   **Important:** The `.env.example` file is only a template. You must create your own `.env` file for the application to work. The `.env` file is git-ignored for security and should never be committed to version control.

4. Configure your `.env` file with your AI API keys:
   ```env
   PORT=3001
   NODE_ENV=development
   
   # Primary AI Provider (OpenAI)
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   
   # Fallback AI Provider (Gemini) - Optional but recommended
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   
   # AI Provider Priority (optional, default: openai,gemini)
   # AI_PROVIDER_PRIORITY=openai,gemini
   ```
   
   **Note:** 
   - Replace `your_openai_api_key_here` with your actual OpenAI API key from https://platform.openai.com/api-keys
   - Replace `your_gemini_api_key_here` with your actual Gemini API key from https://aistudio.google.com/app/apikey
   - You need at least one AI provider configured for the app to work
   - Configure multiple providers for automatic fallback when one provider is unavailable or exceeds quota

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example (optional - defaults are provided):
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Usage

1. **Start Both Servers**: Ensure both backend (port 3001) and frontend (port 5173) are running
2. **Open the App**: Navigate to `http://localhost:5173` in your browser
3. **Choose a Feature**: Select Resume, Cover Letter, or Portfolio from the navigation tabs
4. **For Resume Creation**:
   - **Select Template**: Choose from Modern Professional, Classic ATS, or Minimal Sidebar using the visual card selector
   - **Upload Existing Resume (Optional)**: Upload your current resume (PDF, DOCX, TXT) to extract information
   - **Add Job Description (Optional)**: Paste or upload a job description for AI-powered tailoring
   - **Analyze Job Description**: Click "Analyze JD" to extract required skills and keywords
   - **Compare Resume**: Click "Compare Resume" to get AI suggestions and match scoring
   - **Fill the Form**: Enter or review your information in the provided fields
   - **Generate**: Click the generate button - if a job description is provided, you'll get a tailored resume
5. **Review AI Suggestions**: Review missing skills, keyword recommendations, and improvement suggestions
6. **Export**: Copy to clipboard, download as HTML, or print to PDF

### Resume Templates

HireMind offers three professional resume templates:

- **Modern Professional**: Contemporary design with gradient header - perfect for tech and creative roles (ATS Score: 9/10) ⭐
- **Classic ATS**: Traditional black and white layout optimized for Applicant Tracking Systems (ATS Score: 10/10) ⭐
- **Minimal Sidebar**: Clean two-column design with dark sidebar (ATS Score: 8/10)

See [TEMPLATES.md](./TEMPLATES.md) for detailed template documentation and instructions for adding new templates.

## API Endpoints

### Health Check
- **GET** `/api/health` - Check API status

### Resume
- **POST** `/api/resume` - Generate a resume
  ```json
  {
    "template": "modern",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "location": "New York, NY",
    "summary": "Experienced software developer...",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [
      {
        "position": "Senior Developer",
        "company": "Tech Corp",
        "duration": "2020-Present",
        "description": "Led development of..."
      }
    ],
    "education": [
      {
        "degree": "BS Computer Science",
        "institution": "University Name",
        "year": "2019"
      }
    ]
  }
  ```

- **GET** `/api/resume/templates` - Get available resume templates
  ```json
  {
    "success": true,
    "data": {
      "templates": [
        {
          "id": "modern",
          "name": "Modern Professional",
          "description": "A modern resume with gradient header...",
          "atsScore": 9,
          "recommended": true
        }
      ]
    }
  }
  ```

- **POST** `/api/resume/tailored` - Generate a tailored resume based on job description
  ```json
  {
    "template": "modern",
    "jobDescription": "We are seeking a senior developer...",
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
  ```

- **POST** `/api/resume/parse` - Parse uploaded resume file
  - Content-Type: `multipart/form-data`
  - Field: `file` (PDF, DOCX, or TXT)
  - Returns extracted text from resume

- **POST** `/api/resume/analyze-jd` - Analyze job description
  - Option 1: JSON body with `jobDescription` field
  - Option 2: multipart/form-data with `file` field
  - Returns: required skills, preferred skills, keywords, experience level

- **POST** `/api/resume/compare` - Compare resume with job description
  ```json
  {
    "resumeData": {
      "name": "John Doe",
      "skills": ["JavaScript", "React"],
      ...
    },
    "jobDescription": "We are seeking..."
  }
  ```
  - Returns: match score, missing skills, suggestions, improvements

### Cover Letter
- **POST** `/api/cover-letter` - Generate a cover letter
  ```json
  {
    "userInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "summary": "Experienced developer...",
      "skills": ["JavaScript", "React"]
    },
    "jobInfo": {
      "position": "Senior Developer",
      "company": "Tech Corp",
      "description": "We are looking for..."
    }
  }
  ```

### Portfolio
- **POST** `/api/portfolio` - Generate a portfolio webpage
  ```json
  {
    "name": "John Doe",
    "title": "Full Stack Developer",
    "bio": "Passionate developer...",
    "skills": ["JavaScript", "React", "Node.js"],
    "projects": [
      {
        "name": "Project Name",
        "description": "Project description...",
        "technologies": "React, Node.js",
        "link": "https://github.com/user/project"
      }
    ]
  }
  ```

## Configuration

### Environment Variables Setup

**Important:** This project uses `.env` files to manage environment variables. The `.env.example` files in both `backend/` and `frontend/` directories are **templates only** and are not loaded by the application. You must create your own `.env` files from these templates.

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3001 | No |
| `NODE_ENV` | Environment (development/production) | development | No |
| `OPENAI_API_KEY` | Your OpenAI API key (Primary Provider) | - | At least one AI provider required |
| `OPENAI_MODEL` | GPT model to use | gpt-3.5-turbo | No |
| `GEMINI_API_KEY` | Your Google Gemini API key (Fallback Provider) | - | Optional (recommended) |
| `GEMINI_MODEL` | Gemini model to use | gemini-1.5-flash | No |
| `AI_PROVIDER_PRIORITY` | Comma-separated list of provider priority | openai,gemini | No |

**Note:** 
- You must configure at least one AI provider (OpenAI or Gemini) for the app to work.
- Configure multiple AI providers for automatic fallback when quota is exceeded or a provider is unavailable.
- The system will try providers in the order specified by `AI_PROVIDER_PRIORITY` (default: openai → gemini).
- Get OpenAI API keys from https://platform.openai.com/api-keys
- Get Gemini API keys from https://aistudio.google.com/app/apikey
- Environment variables are loaded using the `-r dotenv/config` flag when starting the server, ensuring they're available before any application code runs.
- The `.env` file is git-ignored and should never be committed to version control.

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory (optional - defaults are provided):

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:3001/api |

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server with HMR
```

### Building for Production

#### Backend
The backend runs directly with Node.js - no build step required.

#### Frontend
```bash
cd frontend
npm run build  # Creates optimized production build in dist/
npm run preview  # Preview production build locally
```

## AI Provider Fallback System

HireMind includes an intelligent AI provider fallback system that automatically switches to alternative AI providers when the primary provider is unavailable or exceeds quota limits.

### How It Works

1. **Priority-Based Execution**: The system tries AI providers in order of priority (default: OpenAI → Gemini)
2. **Automatic Failover**: If a provider fails with quota (429), rate limit, or availability errors, the system automatically tries the next configured provider
3. **Transparent Logging**: Each request logs which provider was used, making debugging and monitoring easier
4. **User-Friendly Errors**: Users only see an error if all configured providers fail

### Configuration

Configure provider priority using the `AI_PROVIDER_PRIORITY` environment variable:

```env
# Try OpenAI first, then fall back to Gemini
AI_PROVIDER_PRIORITY=openai,gemini

# Or reverse the order
AI_PROVIDER_PRIORITY=gemini,openai
```

### Supported Providers

| Provider | API Key Variable | Model Variable | Get API Key |
|----------|-----------------|----------------|-------------|
| OpenAI | `OPENAI_API_KEY` | `OPENAI_MODEL` | https://platform.openai.com/api-keys |
| Google Gemini | `GEMINI_API_KEY` | `GEMINI_MODEL` | https://aistudio.google.com/app/apikey |

### Error Handling

The system automatically retries with the next provider for:
- **429 errors**: Quota exceeded or rate limit errors
- **503/502 errors**: Service temporarily unavailable
- **Quota errors**: Provider-specific quota messages
- **Network errors**: Connection timeouts or refused connections

**Non-retryable errors** (throws immediately):
- **401 errors**: Invalid API key - Fix your configuration

### Best Practices

1. **Configure Multiple Providers**: Set up at least 2 providers for maximum reliability
2. **Monitor Logs**: Check console output to see which provider handles each request
3. **Balance Usage**: Consider alternating priority to distribute usage across providers
4. **Free Tier Friendly**: Use Gemini as fallback to avoid OpenAI quota limits during development

### Example Console Output

```
✅ AI providers configured: OpenAI, Gemini
📋 Provider priority: openai → gemini
🚀 HireMind API server running on port 3001
🤖 Attempting generation with OpenAI...
❌ OpenAI failed: Request failed with status code 429
⚠️  Retryable error (429), trying next provider...
🤖 Attempting generation with Gemini...
✅ Successfully generated text with Gemini
```

**📖 For complete documentation on the AI fallback system**, including troubleshooting, testing, and adding new providers, see **[AI_FALLBACK.md](./AI_FALLBACK.md)**.

## Troubleshooting

### "No AI provider API keys configured"
This warning appears when neither `OPENAI_API_KEY` nor `GEMINI_API_KEY` is set in your environment variables.

**Solution:**
1. Ensure you've created a `.env` file (not `.env.example`) in the `backend/` directory
2. Add at least one AI provider API key to the `.env` file:
   ```env
   # Option 1: OpenAI only
   OPENAI_API_KEY=sk-your-actual-key-here
   OPENAI_MODEL=gpt-3.5-turbo
   
   # Option 2: Gemini only
   GEMINI_API_KEY=your-gemini-key-here
   GEMINI_MODEL=gemini-1.5-flash
   
   # Option 3: Both (Recommended)
   OPENAI_API_KEY=sk-your-actual-key-here
   GEMINI_API_KEY=your-gemini-key-here
   ```
3. **Important:** Restart the backend server completely after creating/modifying the `.env` file
4. Verify the `.env` file is in the correct location (`backend/.env`, not root directory)

**Note:** The `.env.example` file is only a template and is NOT loaded by the application. You must create your own `.env` file.

### "All AI providers failed"
This error occurs when all configured AI providers fail to generate content.

**Common Causes:**
1. **Invalid API Keys**: Check that your API keys are correct and active
2. **Quota Exceeded on All Providers**: All providers have reached their quota limits
3. **Network Issues**: Cannot connect to AI provider APIs

**Solution:**
1. Verify your API keys are valid and not expired
2. Check your quota/usage limits on provider dashboards:
   - OpenAI: https://platform.openai.com/usage
   - Gemini: https://aistudio.google.com/
3. If one provider is out of quota, the system should automatically use the other - ensure both are configured
4. Check backend console logs for specific error messages from each provider

### "Failed to fetch" errors

This error indicates that the frontend cannot connect to the backend API server. Follow these steps to diagnose and fix:

#### Quick Checklist
- [ ] Is the backend server running? (Check terminal for "🚀 HireMind API server running")
- [ ] Is the backend accessible at http://localhost:3001? (Open in browser - should see "HireMind API Running")
- [ ] Is the frontend configured with the correct API URL?
- [ ] Are both frontend and backend running on expected ports?

#### Detailed Debugging Steps

1. **Verify Backend is Running**
   ```bash
   # In one terminal window
   cd backend
   npm run dev
   ```
   You should see:
   ```
   🚀 HireMind API server running on port 3001
   📍 Health check: http://localhost:3001/api/health
   ```

2. **Test Backend Connection**
   - Open http://localhost:3001 in your browser
   - You should see: "HireMind API Running"
   - Try the health check: http://localhost:3001/api/health
   - Should return: `{"status":"OK","message":"HireMind API is running"}`

3. **Check Browser Network Tab**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try using the application
   - Look for failed requests (shown in red)
   - Click on failed request to see:
     - Request URL (should be http://localhost:3001/api/...)
     - Error message (CORS, timeout, connection refused, etc.)

4. **Verify Frontend API Configuration**
   - Check `frontend/.env` file (if it exists)
   - Ensure `VITE_API_URL=http://localhost:3001/api` (or leave unset to use default)
   - If you changed the backend port, update this value
   - **Important:** Restart the frontend dev server after changing `.env`

5. **Common Causes and Solutions**
   
   | Error Message | Cause | Solution |
   |---------------|-------|----------|
   | `Failed to fetch` | Backend not running | Start backend with `npm run dev` |
   | `net::ERR_CONNECTION_REFUSED` | Wrong port or backend crashed | Check backend terminal for errors |
   | `CORS policy` | CORS misconfigured | CORS is pre-configured; restart backend |
   | Wrong URL in requests | Frontend env mismatch | Verify `VITE_API_URL` in `.env` |

#### Still Having Issues?
- Ensure no firewall is blocking ports 3001 or 5173
- Try a different port by setting `PORT=3002` in `backend/.env`
- Clear browser cache and restart dev servers
- Check for conflicting processes: `lsof -i :3001` (Mac/Linux) or `netstat -ano | findstr :3001` (Windows)

### Port conflicts
- If port 3001 or 5173 is in use, change the port in `.env` files
- Update the frontend `VITE_API_URL` if you change the backend port

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Adding New Templates

See [TEMPLATES.md](./TEMPLATES.md) for detailed instructions on creating and adding new resume templates.

## License

MIT

## Template Attribution

All resume templates included in HireMind are custom-designed for this project and released under the MIT License. They follow best practices and design principles inspired by:

- **JSON Resume** (MIT License): https://jsonresume.org/ - Open-source JSON-based resume standard
- **Awesome-CV** (LaTeX CC BY-SA 4.0): https://github.com/posquit0/Awesome-CV - Professional LaTeX resume templates
- **Start Bootstrap Resume** (MIT License): https://startbootstrap.com/theme/resume - Bootstrap-based resume theme

### Template Licenses

Our custom templates (Modern Professional, Classic ATS, Minimal Sidebar):
- **License**: MIT License
- **Usage**: Free for personal and commercial use
- **Attribution**: Appreciated but not required
- **Modification**: Fully customizable

You are free to:
- ✅ Use the templates for personal resumes
- ✅ Use the templates commercially
- ✅ Modify and customize the templates
- ✅ Create derivative works
- ✅ Distribute the templates

See [TEMPLATES.md](./TEMPLATES.md) for full documentation on template usage and customization.

## Additional Documentation

- **[AI_FALLBACK.md](./AI_FALLBACK.md)** - Comprehensive guide to the AI provider fallback system, including configuration, troubleshooting, and best practices
- **[TEMPLATES.md](./TEMPLATES.md)** - Complete documentation on resume templates, customization, and adding new templates

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [OpenAI](https://openai.com/) and [Google Gemini](https://deepmind.google/technologies/gemini/)
- Backend framework: [Express](https://expressjs.com/)
- Frontend tooling: [Vite](https://vitejs.dev/)
- Resume design inspiration from [JSON Resume](https://jsonresume.org/), [Awesome-CV](https://github.com/posquit0/Awesome-CV), and [Start Bootstrap](https://startbootstrap.com/)
