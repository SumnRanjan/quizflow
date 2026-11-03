# QuizFlow

A real-time interactive quiz platform where hosts can create quizzes,
share a room code, and run live question sessions with participants.

## Features

-   Create a quiz with multiple-choice questions.
-   Add four answer options and mark the correct answer.
-   Generate a unique room code for each quiz.
-   Allow participants to join using their name and room code.
-   Deliver questions and leaderboard updates in real time using
    Socket.IO.
-   Submit answers and calculate participant scores.
-   Let the host start the quiz and move between questions.

## Tech Stack

### Frontend

-   React
-   TypeScript
-   Vite
-   React Router
-   Tailwind CSS
-   Socket.IO Client
-   Lucide React

### Backend

-   Node.js
-   TypeScript
-   Socket.IO

## Project Structure

``` text
QuizFlow/
├── backend/
│   ├── src/
│   │   ├── managers/
│   │   │   ├── IoManager.ts
│   │   │   ├── UserManager.ts
│   │   │   └── QuizManager.ts
│   │   ├── quiz.ts
│   │   └── index.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── ...
│   └── package.json
│
└── README.md
```

*The exact structure may differ as the project develops.*

## Getting Started

### Prerequisites

-   Node.js (LTS recommended)
-   npm
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/YOUR_GITHUB_USERNAME/quizflow.git
cd quizflow
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username.

### 2. Install backend dependencies

``` bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory if your backend
configuration uses environment variables:

``` env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 3. Start the backend

Run the development command configured in your backend `package.json`.
For example, if the project has a `dev` script:

``` bash
npm run dev
```

The backend should be available at:

``` text
http://localhost:3000
```

### 4. Install frontend dependencies

Open a second terminal:

``` bash
cd frontend
npm install
```

Create `frontend/.env.local`:

``` env
VITE_SERVER_URL=http://localhost:3000
```

The frontend Socket.IO client should read this variable, for example:

``` ts
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
});
```

### 5. Start the frontend

``` bash
npm run dev
```

Open the local URL printed by Vite, usually:

``` text
http://localhost:5173
```

## How It Works

1.  The host connects to the backend and authenticates as an admin.
2.  The host creates a quiz.
3.  The backend creates a room and returns its room code.
4.  The host adds questions to that room.
5.  Participants join the room using the room code and their names.
6.  The host starts the quiz.
7.  The backend broadcasts each question to participants through
    Socket.IO.
8.  Participants submit their selected answers.
9.  The backend sends leaderboard updates.
10. The host advances the quiz to the next question.

## Environment Variables

### Frontend

  Variable            Description             Local example
  ------------------- ----------------------- -------------------------
  `VITE_SERVER_URL`   Socket.IO backend URL   `http://localhost:3000`

### Backend

  -------------------------------------------------------------------------
  Variable                Description             Local example
  ----------------------- ----------------------- -------------------------
  `PORT`                  Port used by the        `3000`
                          backend HTTP/Socket.IO  
                          server                  

  `FRONTEND_URL`          Frontend origin allowed `http://localhost:5173`
                          by Socket.IO CORS       
  -------------------------------------------------------------------------

Do not commit `.env`, `.env.local`, credentials, or production secrets
to Git.

## Deployment

A typical deployment setup for this project is:

-   **Frontend:** Vercel
-   **Backend:** A Node.js hosting provider that supports persistent
    WebSocket connections, such as Render

### Frontend deployment

1.  Import the GitHub repository into Vercel.
2.  Set the frontend root directory to `frontend`.
3.  Configure the build command and output directory according to the
    frontend package:
    -   Build command: `npm run build`
    -   Output directory: `dist`
4.  Add `VITE_SERVER_URL` with the deployed backend URL.
5.  Deploy the project.

### Backend deployment

1.  Create a Node.js web service connected to the same GitHub
    repository.
2.  Set the root directory to `backend`.
3.  Configure the install, build, and start commands to match the
    backend `package.json`.
4.  Configure `FRONTEND_URL` with the deployed Vercel URL.
5.  Read the hosting provider's assigned port from `process.env.PORT`.
6.  Ensure the hosting provider supports WebSocket connections.

After deployment, make sure the backend Socket.IO CORS configuration
allows the deployed frontend origin.

## Development Notes

-   The backend currently keeps quiz and participant data in memory.
    Data is lost when the backend process restarts.
-   Use environment variables for deployment URLs and secrets.
-   Replace development authentication credentials with a secure
    authentication mechanism before using the application publicly.
-   Never send the correct answer to participant clients before they
    submit.

## Future Improvements

-   Persistent quiz storage with a database.
-   Secure admin and participant authentication.
-   Quiz creation and management dashboard.
-   Host controls for ending questions and finishing a quiz.
-   More detailed quiz analytics and participant reports.
-   Improved validation and error handling.

## Contributing

Contributions, ideas, and bug reports are welcome.

1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes.
4.  Push the branch.
5.  Open a pull request.

## Author

**YOUR NAME**

-   GitHub: https://github.com/YOUR_GITHUB_USERNAME

------------------------------------------------------------------------

If you find this project useful, consider giving the repository a star.
