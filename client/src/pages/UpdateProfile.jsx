import React, { useEffect, useState } from "react";
import assets from "../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../lib/uploadFiles";


const UpdateProfile = () => {

  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [uid, setUid] = useState('');
  const [preImg, setPreImg] = useState('');

  const profileUpdate = async (event) =>{
    event.preventDefault();
    try{
      if(!preImg && image) toast.error("upload your profile picture")
      const docRef = doc(db, "users", uid)
      if (image) {
        const imgUrl = await upload(image);
        setPreImg(imgUrl);
        await updateDoc(docRef, {
          avatar:imgUrl,
          bio:bio,
          username:name
        })
      }else{
        await updateDoc(docRef, {
          bio:bio,
          username:name
        })
      }
    }catch(error){
      console.error("Error updating profile:", error);
    }
  }

  useEffect(() =>{
    onAuthStateChanged(auth, async (user) =>{
      if(user){
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.data().username){
          setName(docSnap.data().username);
        }
        if(docSnap.data().bio){
          setBio(docSnap.data().bio);
        }
        if(docSnap.data().avatar){
          setPreImg(docSnap.data().avatar);
        }
      }else{
        navigate('/')
      }
    })
  })

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  

  return (
    <div className="bg-[url('/background.png')] min-h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center">
      <div className="flex items-center bg-white p-8 rounded-lg shadow-xl min-w-[700px]">
        
        <form action="" className="flex flex-col gap-4 items-center min-w-[50%]"
        onSubmit={profileUpdate()}>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex flex-col items-center cursor-pointer"
          >
            <input 
              type="file" 
              id="avatar"
              hidden
              accept=".png, .jpg, .jpeg"
              onChange={handleImageChange}
            />
            <img 
              src={image ? URL.createObjectURL(image) : assets.avatar_icon} 
              alt="Profile Preview" 
              className="w-24 h-24 mb-2 rounded-full object-cover" 
            />
            <span className="text-blue-600 font-semibold">Upload your profile</span>
          </label>
          <input
            type="text"
            placeholder="Your Name"
            className="border p-2 rounded-md w-full"
            value={name}
            onChange={(e) => setName(e.target.value) }
          />
          <textarea
            name=""
            placeholder="Add your bio here"
            className="border p-2 rounded-md w-full h-24"
            value={bio}
            onChange={(e) => setBio(e.target.bio)}
          ></textarea>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300 mt-2"
          >
            Save Changes
          </button>
        </form>

        <div className="flex items-center justify-center ml-[15%]">
            <img 
              src={image?URL.createObjectURL(image):assets.logo_icon}
              alt="logo" 
              className="h-60 w-auto rounded-lg" 
            />
        </div>

      </div>
    </div>
  );
};

export default UpdateProfile;
