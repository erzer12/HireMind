# HireMind

🧠 **HireMind** is an AI-powered full-stack web application that helps users create professional resumes, cover letters, and portfolio webpages using advanced language models (OpenAI GPT & Google Gemini).

## Quick Start (Local Development)

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- At least one AI provider API key:
  - [OpenAI API key](https://platform.openai.com/api-keys)
  - [Google Gemini API key](https://aistudio.google.com/app/apikey) (optional, for fallback)

### Setup and Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/erzer12/HireMind.git
   cd HireMind
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and add your API keys (OPENAI_API_KEY and/or GEMINI_API_KEY)
   npm run dev
   ```
   Backend runs at `http://localhost:3001`

3. **Frontend Setup** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`

4. **Open the app**: Navigate to `http://localhost:5173` in your browser

### Essential Environment Variables

Create a `.env` file in the `backend/` directory:
```env
# At least one AI provider is required
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Optional: Fallback provider (recommended for reliability)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Optional: Session secret for production
SESSION_SECRET=your-secure-random-string
```

## Production Deployment

### Docker Deployment (Recommended)

#### Using Docker Compose

1. **Clone and configure**:
   ```bash
   git clone https://github.com/erzer12/HireMind.git
   cd HireMind
   cp .env.docker .env
   # Edit .env and add your API keys
   ```

2. **Build and run**:
   ```bash
   docker-compose up -d
   ```

3. **Access the app**: `http://localhost:3001`

#### Using Docker CLI

```bash
docker build -t hiremind .
docker run -d \
  -p 3001:3001 \
  -e OPENAI_API_KEY=your_key \
  -e GEMINI_API_KEY=your_key \
  -e SESSION_SECRET=your_secret \
  -e NODE_ENV=production \
  --name hiremind \
  hiremind
```

### Platform Deployment (Render, Railway, DigitalOcean)

1. **Connect your GitHub repository** to the platform
2. **Configure as Docker deployment** with `Dockerfile`
3. **Set environment variables**:
   - `OPENAI_API_KEY` (required)
   - `GEMINI_API_KEY` (recommended)
   - `SESSION_SECRET` (required for production)
   - `NODE_ENV=production`
4. **Deploy** - The platform builds and serves both frontend and backend on port 3001

**Note**: In production, the backend serves the frontend at the root URL (`/`), and all API endpoints are under `/api/*`.

## Project Structure

```
HireMind/
├── backend/                 # Backend API server (Express.js)
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (AI service)
│   │   ├── templates/      # Resume templates (HTML/CSS)
│   │   ├── middleware/     # Express middleware
│   │   └── server.js       # Entry point
│   └── tests/              # Backend tests
├── frontend/               # React frontend (Vite)
│   └── src/
│       ├── components/     # React components
│       ├── services/       # API client
│       └── App.jsx         # Main app component
├── Dockerfile              # Multi-stage Docker build
└── docker-compose.yml      # Docker Compose configuration
```

## Features

- 📝 **Resume Generator**: 
  - 3 professional templates (Modern, Classic ATS, Minimal)
  - Upload & AI-parse existing resumes (PDF, DOCX, TXT)
  - AI-powered tailoring to job descriptions
  - Resume comparison with match scoring
  - HTML/PDF export
- 💼 **Cover Letter Generator**: Tailored cover letters for specific jobs
- 🌐 **Portfolio Generator**: Beautiful HTML portfolio webpages
- 🤖 **AI-Powered**: OpenAI GPT with automatic Gemini fallback
- 🎨 **Modern React UI**: Clean, responsive interface

## API Endpoints

### Core Endpoints
- `GET /api/health` - API health check
- `POST /api/resume` - Generate resume
- `POST /api/resume/tailored` - Generate job-tailored resume
- `POST /api/resume/parse` - Parse uploaded resume with AI
- `POST /api/resume/compare` - Compare resume vs job description
- `POST /api/cover-letter` - Generate cover letter
- `POST /api/portfolio` - Generate portfolio webpage

**Full API documentation**: See [detailed API section](#detailed-api-documentation) below.

## Troubleshooting

### Common Issues

**Backend not responding**:
- Ensure backend is running: `cd backend && npm run dev`
- Check if port 3001 is available
- Visit http://localhost:3001/api/health to verify

**"No AI provider API keys configured"**:
- Create `.env` file in `backend/` directory (not `.env.example`)
- Add at least one AI provider key (OPENAI_API_KEY or GEMINI_API_KEY)
- Restart the backend server

**"Failed to fetch" errors**:
- Backend must be running before frontend
- Check that VITE_API_URL in frontend/.env points to backend
- Look for CORS errors in browser console

**Port conflicts**:
- Change ports in `.env` files if 3001 or 5173 are in use
- Update `VITE_API_URL` if backend port changes

See [detailed troubleshooting](#detailed-troubleshooting) below for more help.

---

## Advanced Topics

### Detailed API Documentation

#### Health Check
- **GET** `/api/health` - Check API status

#### Resume Endpoints

**POST** `/api/resume` - Generate a resume
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

**GET** `/api/resume/templates` - Get available resume templates

**POST** `/api/resume/tailored` - Generate a tailored resume based on job description

**POST** `/api/resume/parse` - Parse uploaded resume file (multipart/form-data)

**GET** `/api/resume/session` - Get uploaded resume data from session

**DELETE** `/api/resume/session` - Clear uploaded resume data from session

**POST** `/api/resume/analyze-jd` - Analyze job description

**POST** `/api/resume/compare` - Compare resume with job description

#### Cover Letter Endpoint

**POST** `/api/cover-letter` - Generate a cover letter
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

#### Portfolio Endpoint

**POST** `/api/portfolio` - Generate a portfolio webpage
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

### AI Provider Fallback System

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

### Detailed Troubleshooting

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
- [ ] Is the backend accessible at http://localhost:3001/api/health? (Should return JSON with status "OK")
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
   - Try the health check: http://localhost:3001/api/health
   - Should return: `{"status":"OK","message":"HireMind API is running"}`
   - Note: In development mode, http://localhost:3001 shows "HireMind API Running"; in production it serves the frontend

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

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

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [OpenAI](https://openai.com/) and [Google Gemini](https://deepmind.google/technologies/gemini/)
- Backend framework: [Express](https://expressjs.com/)
- Frontend tooling: [Vite](https://vitejs.dev/)
- Resume design inspiration from [JSON Resume](https://jsonresume.org/), [Awesome-CV](https://github.com/posquit0/Awesome-CV), and [Start Bootstrap](https://startbootstrap.com/)
