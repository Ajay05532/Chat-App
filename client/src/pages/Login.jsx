import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import assets from '../assets/assets';

const Login = () => {
  // State to manage form inputs
  const [currState, setCurrState] = useState("Sign up");
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currState === "Sign up") {
        if (!agreedToTerms) {
          toast.error("Please agree to the term and conditions");
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: username
        });

        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          username: username.toLowerCase(),
          email: email,
          displayName: username,
          photoURL: null,
          createdAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          isOnline: true,
          bio:"Hey there i'm using chatApp"
        });

        await setDoc(doc(db, "chats", user.uid), {
          chatData: []
        });

        toast.success("Account created successfully!");
        navigate('/chat');
      }else {
        // Login logic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Update user's online status
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          lastSeen: new Date().toISOString(),
          isOnline: true
        }, { merge: true });

        toast.success("Logged in successfully!");
        navigate('/chat');
      }

    } catch (error) {
      console.error("Authentication error:", error);

      let errorMessage = "An error has occured, Please try again."

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Email is already registered. Please login instead.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No account found with this email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password.";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Invalid email or password.";
          break;
        default:
          errorMessage = error.message;
      }
      toast.error(errorMessage);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-around items-center" style={{ backgroundImage: "url('background.png')" }}>
      {/* Left Pane: Branding */}
      <div className=" lg:flex w-1/2  flex-col items-center justify-center p-12 text-white">

        <img src={assets.logo_big} alt="" />
        <p className="mt-2 text-lg text-blue-200">
          Connect with friends and the world around you.
        </p>
      </div>

      {/* Right Pane: Form */}

      <div className="w-[400px] max-h-[500px]  bg-white p-8 rounded-lg shadow-md">
        <h2 className=" mt-3 inline-block text-3xl font-bold  text-gray-800">{currState}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
          {/* Username Input */}
          {currState === "Sign up" ? <input
            type="text"
            placeholder="Username"
            className="p-2 border-2 border-gray-300 rounded-g focus:outline-none focus:border-blue-500 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          /> : null}

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email address"
            className="p-2 border-2 border-gray-300 rounded-l focus:outline-none focus:border-blue-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            className="p-2 border-2 border-gray-300 rounded-l focus:outline-none focus:border-blue-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength="6"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Please wait..." : (currState === "Sign up" ? "Create account" : "Login")}
          </button>

          {/* Terms and Conditions */}
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
            />
            <label htmlFor="terms">
              Agree to the terms of use & privacy policy.
            </label>
          </div>

          {/* Link to Login */}
          <p className="text-center text-sm text-gray-600 mt-4">
            {currState === "Sign up" ? "Already have an account " : "Don't have account "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                setCurrState(currState === "Sign up" ? "Login" : "Sign up");
                // Reset form when switching
                setUsername('');
                setEmail('');
                setPassword('');
                setAgreedToTerms(false);
              }}
            >
              {currState === "Sign up" ? "Login" : "Sign up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
