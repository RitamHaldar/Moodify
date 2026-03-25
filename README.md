# MoodSync - Mood-Powered Music Experience

**Live Demo**: [Link](https://moodsync-ectw.onrender.com)

MoodSync is a premium, AI-driven music recommendation application that uses facial expression detection to curate the perfect playlist based on your current emotional state. Built with the MERN stack, it offers a sophisticated, responsive, and ethereal user experience.

## Key Features

*   **AI Mood Detection**: Real-time facial analysis via camera to identify emotions (Happy, Sad, Angry, Neutral, etc.).
*   **Emotion-Driven Playlists**: Instantly get song recommendations tailored to your current vibe.
*   **Premium Aesthetic**: A modern dark-mode UI with a sophisticated Teal & Aqua palette and glassmorphic effects.
*   **Fully Responsive**: Seamless experience across Desktop, Tablet, and Mobile devices.
*   **Secure Authentication**: Personalized user accounts with JWT-based secure login and registration.
*   **Integrated Player**: Full-featured music player with custom controls, progress tracking, and volume management.

## Tech Stack

*   **Frontend**: React (Vite), SCSS (Vanilla), Axios, Lucide Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose).
*   **Production**: Currently configured for deployment on Render.

## Project Structure

### Backend
```text
Backend/
├── Public/             # Static production build of Frontend (for deployment)
├── src/
│   ├── config/         # Database and environment configurations
│   ├── controlers/     # Business logic for Users and Songs
│   ├── middlewares/    # Authentication and security middlewares
│   ├── models/         # Mongoose schemas (User, Song, etc.)
│   ├── routes/         # API endpoint definitions
│   └── services/       # External API and helper services
├── server.js           # Server initialization and entry point
└── .env                # Environment configuration
```

### Frontend
```text
Frontend/
├── src/
│   ├── features/
│   │   ├── Auth/       # Logic and components for Login/Register
│   │   └── Songs/      # Dashboard, Music Player, and Mood Detection
│   ├── services/       # API interaction layer (Axios instances)
│   ├── styles/         # Global themes and component-specific SCSS
│   ├── app.routes.jsx  # Application routing logic
│   └── main.jsx        # React application root
├── public/             # Static assets and images
└── vite.config.js      # Build and dev server configuration
```

## How to Use

### 1. Prerequisites
*   Node.js (v16.x or higher)
*   MongoDB Atlas account or local instance.

### 2. Setup Backend
1.  Navigate to `/Backend`.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file with the following variables:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
4.  Start development server: `npm run dev`.

### 3. Setup Frontend
1.  Navigate to `/Frontend`.
2.  Install dependencies: `npm install`.
3.  Start the app: `npm run dev`.
4.  Visit `http://localhost:5173`.

## API Endpoints

### Authentication
*   `POST /api/auth/register`: Create a new user account.
*   `POST /api/auth/login`: Authenticate and receive a JWT.

### Music & Mood
*   `GET /api/songs`: Fetch all available songs.
*   `POST /api/songs/detect`: Send expression data for mood analysis.
*   `GET /api/songs/mood/:id`: Retrieve songs matching a specific mood ID.

## Mobile Experience
MoodSync has been meticulously optimized for mobile. On smaller screens, the layout automatically adjusts to a vertical stack, providing:
*   **Stacked Dashboard**: Hero and discovery sections tile vertically for easy scrolling.
*   **Compact Player**: Music controls switch to a touch-optimized stacked layout.
*   **Left-Aligned Metadata**: Track info is neatly aligned for maximum readability on small viewports.
*   **Hidden Sidebar**: Navigation transitions to a clean, focused view without screen clutter.

## Design Philosophy
The application follows a **Premium Ethereal** design system:
*   **Primary Palette**: High-contrast Teal (#00cec9) and Arctic Blue (#0984e3).
*   **Glassmorphism**: 25px blur backgrounds with subtle 1px borders (rgba 255/255/255/0.1).
*   **Typography**: Inter and Rajdhani for a futuristic/professional look.
*   **Animations**: Slide-down headers and fade-in cards for smooth user transitions.

## Future Roadmap
- [ ] **Social Sharing**: Share your current mood and playlist directly to social media.
- [ ] **Custom Playlists**: Allow users to create and save their own mood-based collections.
- [ ] **AI Refinement**: Enhanced facial expression sensitivity and lighting adaptation.
- [ ] **Dark/Light Mode**: User-selectable themes beyond the default dark mode.

---
Developed by MoodSync Team for a better music listening experience.
