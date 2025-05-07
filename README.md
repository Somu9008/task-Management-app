# 🗂️ Task Management System

A full-featured Task Management System using **NextJs**, **Redux Toolkit Query**, **Node.js/Express**, and **Socket.IO**. It allows users to manage tasks, get real-time updates, and visualize task stats.

---

## 🚀 Features

### 👥 Authentication (Express + Session)
- Session-based login and logout.
- Auth state managed on the server using `express-session`.

### ✅ Task Management
- Create, edit, delete tasks.
- Filter tasks by:
  - Status: `Pending`, `In Progress`, `Completed`
  - Priority: `Low`, `Medium`, `High`

- View:
  - Created Tasks
  - Overdue Tasks
  - assigned Tasks

### 📈 Dashboard (Charts)
- Task completion graph
- Priority distribution chart


### 🔔 Real-time Notifications
- Integrated **Socket.IO**
- Get instant updates when a task is  assigned

---

## 🛠 Tech Stack

### 🧑‍💻 Frontend
- NextJs
- Redux Toolkit + RTK Query
- Dashbord
- Socket.IO Client

### 🖥 Backend
- Node.js + Express
- MongoDB + Mongoose
- Express Session
- Socket.IO

---

## 📁 frontend
cd client
npm install
npm run dev

## Backend
cd server 
npm install
npm run dev


