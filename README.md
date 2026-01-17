# WitHub - Your Professional Digital Workspace

WitHub is a modern MERN stack application designed for creators, developers, and entrepreneurs to showcase their digital identity. Manage your professional profile, highlight your AI tool stack, and share your important links through a beautifully designed, premium interface.

## ✨ Features

- **Premium Dashboard (Workspace)**: A tabbed administrative panel to manage your profile details, appearance, and important links.
- **AI Stack Management**: Select and showcase the AI tools you use.
- **Public Profiles**: Dynamic, SEO-friendly public profile pages (e.g., `/u/username`).
- **Automated Redirects**: Robust username change system with automatic redirects from old handles.
- **Glassmorphism UI**: High-end aesthetic with smooth animations, dark mode support, and premium typography.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), Vanilla CSS, Lucide-react icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT Authentication, Bcrypt password hashing.

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd withub
```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add yours:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```text
withub/
├── backend/            # Express.js server and API
│   ├── config/         # DB connection
│   ├── controllers/    # API logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Global state (Auth, Theme)
│   │   ├── pages/      # Route components
│   │   └── App.jsx     # Main routes
│   └── index.css       # Global styles
└── README.md
```

## 🛡️ Security
- All sensitive information is protected via `.env` files.
- Passwords are salted and hashed using Bcrypt.
- Private routes are protected via JWT middleware.

## 📄 License
This project is licensed under the MIT License.
