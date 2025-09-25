# 💬 Real-Time Chat Application

A modern, full-featured real-time chat application built with **React**, **Firebase**, and **TailwindCSS**. Users can authenticate, manage profiles, send messages with images, and chat in real-time with a beautiful, responsive interface.

---

## 🚀 Features

- 🔐 **Authentication** – Secure login/signup with Firebase Auth
- 👤 **Profile Management** – Update profile with avatar, name, and bio
- 💬 **Real-Time Messaging** – Instant message delivery with Firebase Firestore
- 📷 **Image Sharing** – Send and receive images in chats
- 👥 **User Search** – Find and add new contacts by username
- 📱 **Responsive Design** – Works on desktop and mobile devices
- 🎨 **Modern UI** – Clean interface with TailwindCSS
- 📍 **Protected Routes** – Authentication-based navigation
- ⚡ **Real-Time Updates** – Live chat lists and message updates
- 🔔 **Message Status** – Read/unread message indicators

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, Context API
- **Backend:** Firebase Firestore (Real-time Database)
- **Authentication:** Firebase Authentication
- **Storage:** Firebase Cloud Storage (for images)
- **Styling:** TailwindCSS
- **Notifications:** React Toastify
- **Build Tool:** Vite

---

## 📂 Project Structure

```
client/
├── src/
│   ├── assets/              # Static assets like images and icons
│   ├── components/          # Reusable components (leftSideBar, chatBar, etc.)
│   ├── config/              # Firebase configuration file
│   ├── context/             # AppContext for global state
│   ├── pages/               # Page components (Chat, Login, UpdateProfile)
│   ├── App.jsx              # Main app component with routing
│   └── main.jsx             # Application entry point
├── .env.local               # Environment variables for Firebase keys
└── package.json
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Ajay05532/Chat-App.git
cd chat-application/client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Firebase Project

#### Create a Firebase Project:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter your project name (e.g., "my-chat-app")
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**

#### Enable Authentication:
1. In your Firebase project, go to **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** provider
5. Click **"Save"**

#### Set Up Firestore Database:
1. Go to **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select your preferred location
5. Click **"Done"**

#### Enable Cloud Storage:
1. Go to **"Storage"** in the left sidebar
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Select your preferred location
5. Click **"Done"**

#### Get Firebase Configuration:
1. Go to **"Project settings"** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click **"Web"** icon (</>) to add a web app
4. Enter your app name and click **"Register app"**
5. Copy the Firebase configuration object

### 4. Configure Environment Variables

Create a `.env.local` file in your project root `client\`:

```env
VITE_API_KEY=your_api_key_here
VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id
```

**Replace the values with your actual Firebase configuration values.**


### 5. Run the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:port`

---

 ### Preview

<div align="center">
  <img width="500" height="auto" alt="Screenshot 2025-09-25 at 2 31 59 PM" src="https://github.com/user-attachments/assets/f6844692-37b2-4f4f-b15b-12975a781846" />
  <img width="500" height="auto" alt="Screenshot 2025-09-25 at 2 31 02 PM" src="https://github.com/user-attachments/assets/9b78396b-6774-4139-9c66-e537867694a1" />
  <img width="500" height="auto" alt="Screenshot 2025-09-25 at 2 32 17 PM" src="https://github.com/user-attachments/assets/a249d4fe-5273-422b-bbed-519652277408" />
</div>


---
### 🤝 Contributing
Contributions are welcome! If you'd like to improve the app, please fork the repository and create a pull request with your changes.

- Fork the Project
- Create your Feature Branch (git checkout -b feature/AmazingFeature)
- Commit your Changes (git commit -m 'Add some AmazingFeature')
- Push to the Branch (git push origin feature/AmazingFeature)
- Open a Pull Request
- 
## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Ajay05532/Chat-App.git/issues) page
2. Create a new issue with detailed information
3. Provide error messages and steps to reproduce
4. Include your environment details (OS, Node.js version, etc.)

---

**Happy Chatting! 💬**
