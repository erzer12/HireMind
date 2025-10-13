# Docker Deployment Guide for HireMind

This guide provides comprehensive instructions for deploying HireMind using Docker.

## Quick Start

### Using Docker Compose (Recommended)

```bash
# 1. Clone and navigate to the repository
git clone https://github.com/erzer12/HireMind.git
cd HireMind

# 2. Create your environment file
cp .env.docker .env

# 3. Edit .env and add your API keys
nano .env  # or use your preferred editor

# 4. Build and start the application
docker compose up -d

# 5. Access the application
# Open http://localhost:3001 in your browser
```

### Using Docker CLI

```bash
# Build the image
docker build -t hiremind .

# Run the container
docker run -d \
  -p 3001:3001 \
  -e OPENAI_API_KEY=your_key_here \
  -e GEMINI_API_KEY=your_key_here \
  -e SESSION_SECRET=your_secret_here \
  -e NODE_ENV=production \
  --name hiremind \
  hiremind

# View logs
docker logs -f hiremind

# Stop the container
docker stop hiremind
```

## Environment Variables

### Required Variables

At least one AI provider API key is required:

- `OPENAI_API_KEY` - OpenAI API key for GPT models
- `GEMINI_API_KEY` - Google Gemini API key (fallback)
- `SESSION_SECRET` - Secret for session encryption (use a random string)

### Optional Variables

- `PORT` (default: 3001) - Port the server listens on
- `NODE_ENV` (default: production) - Environment mode
- `OPENAI_MODEL` (default: gpt-3.5-turbo) - OpenAI model to use
- `GEMINI_MODEL` (default: gemini-2.5-flash) - Gemini model to use
- `AI_PROVIDER_PRIORITY` (default: openai,gemini) - Provider priority order
- `FRONTEND_URL` (default: http://localhost:3001) - CORS allowed origin

## Architecture

The Docker deployment uses a multi-stage build:

1. **Frontend Build Stage**: Builds the React application using Vite
2. **Production Stage**: Sets up Node.js backend and serves the built frontend

In production:
- Backend serves frontend static files from `/app/public`
- All API routes are prefixed with `/api`
- Single port (3001) handles both frontend and API
- Frontend uses relative URLs for API calls

## Platform Deployment

### Render

1. Create new Web Service
2. Connect GitHub repository
3. Set Environment to "Docker"
4. Add environment variables in dashboard
5. Deploy

### Railway

1. Create new project
2. Deploy from GitHub
3. Add environment variables in dashboard
4. Railway auto-detects Dockerfile

### DigitalOcean

1. Create new App
2. Connect GitHub repository
3. Set resource type to "Web Service"
4. Configure Dockerfile path and port
5. Add environment variables
6. Deploy

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs hiremind

# Common issues:
# - Missing API keys
# - Invalid environment variables
# - Port already in use
```

### Can't access the application

```bash
# Verify container is running
docker ps

# Check health status
curl http://localhost:3001/api/health

# Verify port mapping
docker port hiremind
```

### Build fails

```bash
# Clear Docker cache and rebuild
docker build --no-cache -t hiremind .

# Check Dockerfile syntax
docker build --help
```

## Security Best Practices

1. Never commit `.env` files
2. Generate secure session secrets:
   ```bash
   openssl rand -base64 32
   ```
3. Use environment variables for all secrets
4. Rotate API keys regularly
5. Use HTTPS in production (most platforms provide this)
6. Keep dependencies updated

## Local Development

For local development without Docker, see the main README.md for instructions on running the frontend and backend separately with hot-reloading.

## Support

For issues or questions:
- GitHub Issues: https://github.com/erzer12/HireMind/issues
- Check container logs: `docker logs hiremind`
- Verify health endpoint: `curl http://localhost:3001/api/health`
