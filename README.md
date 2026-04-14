🚀 FirstGlance – Smart Navigation & Path Optimization System

A full-stack MERN application that provides intelligent route navigation using graph algorithms like **Dijkstra’s Algorithm** to compute the shortest path between locations.

---

## 📌 Overview

**FirstGlance** is a smart navigation system designed to visualize maps and compute optimal routes efficiently.

It allows users to select source and destination points and get the best possible path along with distance and time metrics.

This project demonstrates strong concepts in:

- Data Structures & Algorithms (Graph, Dijkstra)  
- Full Stack Development (MERN)  
- Real-world problem solving (navigation systems)

---

## ✨ Features

- 🗺️ Interactive Map Interface  
- 📍 Select Source & Destination Nodes  
- ⚡ Shortest Path Calculation using Dijkstra’s Algorithm  
- ⏱️ Distance & Time Estimation  
- 🎯 Highlighted Routes and Nodes  
- 🔄 Dynamic Graph Data Handling  
- 🌐 REST API Integration (Node.js + Express)  

---

## 🛠️ Tech Stack

### Frontend:
- React.js (Vite)  
- CSS (Custom Styling)  

### Backend:
- Node.js  
- Express.js  

### Database:
- MongoDB  

### Algorithms:
- Dijkstra’s Algorithm (Shortest Path)

---

## 📁 Project Structure


firstglance/
│
├── client/ # Frontend (React)
├── server/ # Backend (Node + Express)
├── package.json
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/AkshitBisht02/FirstGlance.git
cd FirstGlance


2️⃣ Install dependencies
Backend:

cd server

npm install

Frontend:

cd ../client

npm install

3️⃣ Setup environment variables

Create a .env file inside server/:

MONGO_URI=your_mongodb_connection_string

PORT=5000

4️⃣ Run the application


Start backend:

cd server

npm start

Start frontend:

cd client

npm run dev

📊 How It Works

Graph data (nodes & edges) is stored in the backend

User selects source and destination

Backend processes graph using Dijkstra’s Algorithm

Shortest path is returned

Frontend visualizes the route on the map

🚧 Future Improvements

🚦 Real-time traffic integration

📱 Mobile responsiveness improvement

🧠 AI-based route prediction

🌍 GPS-based live navigation

📊 Better visualization & animations

🧠 Learning Outcomes

Practical implementation of graph algorithms

Full-stack integration (frontend ↔ backend ↔ database)

API design and data handling

UI/UX design for interactive systems

🤝 Contributing

Contributions are welcome!

Feel free to fork this repo and submit a pull request.

📬 Contact

👤 Akshit Bisht

GitHub: https://github.com/AkshitBisht02
⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!
