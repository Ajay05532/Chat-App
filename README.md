# 💬 Chat Application

A real-time chat application built with **React**, **Firebase Authentication**, and **React Router**.  
This project allows users to sign up, log in, update their profiles, and chat seamlessly with authentication-based routing.

---

## 🚀 Features

- 🔐 **Authentication** – Login, signup, and logout using Firebase Auth  
- 👤 **Profile Management** – Update user profile details  
- 💬 **Real-Time Chat** – Interactive chat interface  
- 📍 **Protected Routes** – Redirects users based on login state  
- 🎨 **Modern UI** – Built with React, TailwindCSS, and React Toastify  
- ⚡ **Routing** – Handled with React Router v6  

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Context API  
- **Authentication:** Firebase Authentication  
- **Styling:** TailwindCSS  
- **Notifications:** React Toastify  

---

## 📂 Project Structure

```
client/
 ├── src/
 │   ├── assets/            # Static assets
 │   ├── components/        # Reusable components
 │   ├── config/            # Firebase config
 │   ├── context/           # AppContext for state management
 │   ├── pages/             # Pages (Login, Chat, UpdateProfile, etc.)
 │   ├── App.jsx            # Main app with routes
 │   ├── index.js           # Entry point
 │   └── styles/            # CSS/Tailwind styles
 ├── package.json
 └── README.md
```

---

## ⚙️ Installation & Setup

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/chat-application.git
   cd chat-application/client
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Create a **Firebase project** and get your config keys. Add them in `src/config/firebase.js`  
   ```javascript
   import { initializeApp } from "firebase/app";
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   export const app = initializeApp(firebaseConfig);
   ```

4. Run the development server  
   ```bash
   npm run dev
   ```

---

## 📸 Screenshots

> Add your screenshots here (e.g., Login Page, Chat Page, Profile Update).

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and create a pull request with your changes.

---

## 📜 License

This project is licensed under the **MIT License**.
