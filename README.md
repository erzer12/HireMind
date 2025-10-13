# HireMind

🧠 **HireMind** is an AI-powered full-stack web application that helps users create professional resumes, cover letters, and portfolio webpages using advanced language models.

## Features

- 📝 **Resume Generator**: Create ATS-friendly professional resumes based on your experience and skills
- 💼 **Cover Letter Generator**: Generate tailored cover letters for specific job applications
- 🌐 **Portfolio Generator**: Build a beautiful HTML portfolio webpage showcasing your projects
- 🤖 **AI-Powered**: Leverages OpenAI's GPT models for intelligent content generation
- 🎨 **Modern UI**: Clean and intuitive React-based user interface
- 📥 **Export Options**: Copy to clipboard or download generated content

## Tech Stack

### Backend
- **Node.js** with Express.js
- **OpenAI API** for AI-powered content generation
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
└── README.md
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

4. Configure your `.env` file with your OpenAI API key:
   ```env
   PORT=3001
   NODE_ENV=development
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   ```

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
4. **Fill the Form**: Enter your information in the provided fields
5. **Generate Content**: Click the generate button and wait for AI to create your content
6. **Export**: Copy to clipboard or download the generated content

## API Endpoints

### Health Check
- **GET** `/api/health` - Check API status

### Resume
- **POST** `/api/resume` - Generate a resume
  ```json
  {
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

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `OPENAI_MODEL` | GPT model to use | gpt-3.5-turbo |

### Frontend Environment Variables

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

## Troubleshooting

### "OpenAI API key is not configured"
- Ensure you've created a `.env` file in the backend directory
- Add your OpenAI API key to the `.env` file
- Restart the backend server

### "Failed to fetch" errors
- Ensure the backend server is running on port 3001
- Check that CORS is properly configured
- Verify the `VITE_API_URL` in frontend matches your backend URL

### Port conflicts
- If port 3001 or 5173 is in use, change the port in `.env` files
- Update the frontend `VITE_API_URL` if you change the backend port

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [OpenAI](https://openai.com/)
- Backend framework: [Express](https://expressjs.com/)
- Frontend tooling: [Vite](https://vitejs.dev/)
