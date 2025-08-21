# 🎫 Ticketing System - Streamlining Issue Resolution 

This project is a comprehensive ticketing system designed to streamline issue reporting, tracking, and resolution. It provides a centralized platform for users to submit tickets, administrators to manage and assign them, and agents to resolve them efficiently. The system incorporates features like user authentication, role-based access control, AI-powered ticket analysis, and real-time notifications to ensure seamless communication and collaboration.

🚀 **Key Features**

*   **User Authentication:** Secure user registration, login, and session management.
*   **Role-Based Access Control:** Differentiated access levels for users, administrators, and agents.
*   **Ticket Submission:** Easy-to-use interface for users to submit detailed tickets.
*   **Ticket Management:** Tools for administrators to manage, assign, and prioritize tickets.
*   **AI-Powered Analysis:** Automatic ticket analysis using AI to determine priority, suggest skills, and provide helpful notes.
*   **Real-time Notifications:** Notifications for ticket updates, assignments, and resolutions.
*   **Search and Filtering:** Robust search and filtering capabilities to quickly find specific tickets.
*   **User Profile Management:** Users can manage their profiles and view their ticket history.
*   **Admin Dashboard:** Comprehensive dashboard for administrators to manage users, roles, and system settings.
*   **Secure API:** RESTful API for seamless integration with other systems.

🛠️ **Tech Stack**

*   **Frontend:**
    *   React
    *   React Router DOM
    *   Vite
    *   Tailwind CSS
    *   React Hot Toast
*   **Backend:**
    *   Node.js
    *   Express.js
    *   Mongoose
    *   JSON Web Tokens (JWT)
    *   CORS
    *   dotenv
*   **Database:**
    *   MongoDB
*   **Background Jobs:**
    *   Inngest
*   **AI Tools:**
    *   (Implementation details for AI analysis would be here, e.g., OpenAI, etc. - Not specified in summaries)
*   **Build Tools:**
    *   npm

📦 **Getting Started**

### Prerequisites

*   Node.js (v18 or higher)
*   npm (Node Package Manager)
*   MongoDB installed and running
*   An Inngest account and API key
*   Vite

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd frontend
    npm install
    ```

4.  **Configure environment variables:**

    *   Create a `.env` file in both the `backend` and `frontend` directories.
    *   Add the following environment variables, replacing the placeholders with your actual values:

        **Backend (.env):**

        ```
        MONGO_URI=<your_mongodb_connection_string>
        JWT_SECRET=<your_jwt_secret>
        PORT=5000
        FRONTEND_URL=http://localhost:5173 # or your frontend's URL
        INNGEST_EVENT_KEY=<your_inngest_event_key>
        ```

        **Frontend (.env):**

        ```
        VITE_SERVER_URL=http://localhost:5000 # or your backend's URL
        ```

### Running Locally

1.  **Start the backend server:**

    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the frontend development server:**

    ```bash
    cd frontend
    npm run dev
    ```

    The frontend application will be accessible at `http://localhost:5173` (or the port specified by Vite).

💻 **Project Structure**

```
📂 Ticketing System
├── backend/
│   ├── controllers/
│   │   ├── ticket.js
│   │   └── user.js
│   ├── db/
│   │   └── db.js
│   ├── inngest/
│   │   ├── client.js
│   │   └── functions/
│   │       ├── on-signup.js
│   │       └── on-ticket-create.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── ticket.js
│   │   └── user.js
│   ├── routes/
│   │   ├── ticket.js
│   │   └── user.js
│   ├── utils/
│   │   ├── ai.js  (Placeholder - Implementation not detailed)
│   │   └── mailer.js (Placeholder - Implementation not detailed)
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CheckAuth.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Ticket.jsx
│   │   │   └── Tickets.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   │   └── vite.svg
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
├── .gitignore
├── README.md
└── package.json
```

🤝 **Contributing**

We welcome contributions to this project! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Submit a pull request to the main branch.

