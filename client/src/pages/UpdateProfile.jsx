import React, { useState } from "react";
import assets from "../assets/assets";

const UpdateProfile = () => {

  const [image, setImage] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  

  return (
    <div className="bg-[url('/background.png')] min-h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center">
      <div className="flex items-center bg-white p-8 rounded-lg shadow-xl min-w-[700px]">
        
        <form action="" className="flex flex-col gap-4 items-center min-w-[50%]">
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
          />
          <textarea
            name=""
            placeholder="Add your bio here"
            className="border p-2 rounded-md w-full h-24"
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
