# Nova - AI Support Agent Dashboard

AI-powered customer support platform with conversational chat interface, session management, and analytics dashboard.

## Live Demo

**Dashboard:** https://nova.mavrikon.net/demo

**Demo Credentials:**
- Email: demo@mavrikon.net
- Password: Demo123hndwe

⚠️ **Note:** Backend is hosted on free tier. First visit may take 30-60 seconds to wake up. This is normal for demo projects. Please wait for initial load.

## Features

### Chat Widget
- Embeddable chat widget for websites
- Real-time conversational interface
- Session persistence and history
- Mobile-responsive design

### Dashboard
- Manage customer conversations
- View chat history and session data
- Analytics and metrics overview
- Agent performance tracking

### Backend
- FastAPI backend with MongoDB
- LangGraph for conversation routing and memory
- Intent classification and context handling
- Multi-session support

## Tech Stack

**Frontend:**
- React
- CSS
- Context API for state management

**Backend:**
- FastAPI (Python)
- MongoDB
- LangGraph
- OpenAI/Mistral API

**Deployment:**
- Frontend: Vercel
- Backend: Render (free tier)
- Database: MongoDB Atlas

# Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
```

**Backend (.env):**
```
MONGODB_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_key
MISTRAL_API_KEY=your_mistralai_key

** Future Improvements **

- [ ] RAG integration for custom knowledge bases
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Voice conversation support
- [ ] Automated testing suite

## Contact

Tomi Joshua
- Email: joshua.tomi1@gmail.com
- LinkedIn: [linkedin.com/in/tomibuildsdifferent](https://linkedin.com/in/tomibuildsdifferent)
- Portfolio: [tomijosh.netlify.app](https://tomijosh.netlify.app)
