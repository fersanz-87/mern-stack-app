# MERN Stack Application

A full-stack web application built with MongoDB, Express.js, React, and Node.js.

## Project Structure

```
MERN STACK/
├── client/          # React frontend application
│   ├── src/         # React source code
│   ├── public/      # Static files
│   └── package.json # Frontend dependencies
└── server/          # Node.js backend application
    ├── controller/  # Route controllers
    ├── model/       # Database models
    ├── routes/      # API routes
    └── package.json # Backend dependencies
```

## Technologies Used

### Frontend (Client)
- **React** ^19.1.0 - JavaScript library for building user interfaces
- **React Router** ^7.6.2 - Client-side routing
- **Axios** ^1.10.0 - HTTP client for API requests
- **Bootstrap** ^5.3.7 - CSS framework for styling
- **React Hot Toast** ^2.5.2 - Notifications
- **Font Awesome** ^4.7.0 - Icons

### Backend (Server)
- **Node.js** - JavaScript runtime environment
- **Express.js** ^5.1.0 - Web application framework
- **MongoDB** with **Mongoose** ^8.16.0 - Database and ODM
- **CORS** ^2.8.5 - Cross-Origin Resource Sharing
- **dotenv** ^16.5.0 - Environment variable management
- **Body-parser** ^2.2.0 - Request body parsing middleware
- **Nodemon** ^3.1.10 (dev) - Development server auto-restart

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MERN\ STACK
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev  # For development with nodemon
# or
npm start    # For production
```

2. Start the frontend client (in a new terminal):
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Author

**Fer Sanz** - Full Stack Developer

## License

This project is licensed under the ISC License.
