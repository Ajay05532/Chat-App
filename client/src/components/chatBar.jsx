import React, { useState, useEffect, useRef } from 'react'
import assets from '../assets/assets'

const initialMessages = [
  {
    id: 1,
    type: "text",
    sender: "receiver",
    time: "12:10 AM",
    message: "Hello, how are you doing?",
    avatar: assets.profile_img
  },
  {
    id: 2,
    type: "text",
    sender: "sent",
    time: "12:10 AM",
    message: "I am fine, thank you!",
    avatar: assets.profile_alison
  },
  {
    id: 3,
    type: "text",
    sender: "receiver",
    time: "12:10 AM",
    message: "What are you doing?",
    avatar: assets.profile_img
  },
]

const ChatBar = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const messagesEndRef = useRef(null);

  // MOVED INSIDE: Hooks must be called inside the component
  const [imagePreview, setImagePreview] = useState(null);

  // MOVED INSIDE: This function needs to be inside to use setImagePreview
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    const isTextMessage = message.trim() !== "";
    const isImageMessage = imagePreview !== null;

    if (!isTextMessage && !isImageMessage) {
      return;
    }

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const newMessage = {
      id: messages.length + 1,
      sender: "sent",
      time: currentTime,
      avatar: assets.profile_alison,
      type: isImageMessage ? "image" : "text",
      message: isTextMessage ? message : null,
      image: isImageMessage ? imagePreview : null,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    setImagePreview(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };


  return (
    <div className='bg-orange-50 flex flex-col overflow-scroll'>
      {/* Header */}
      <div className='flex items-center justify-between px-7 border-b border-gray-300 py-4 bg-white'>
        <div className='flex items-center'>
          <img className='h-12 w-12 rounded-full object-cover' src={assets.profile_img} alt="" />
          <div className='ml-4'>
            <p className='flex items-center text-xl font-semibold'>
              Rohan
              <img className='h-3 ml-2' src={assets.green_dot} alt="green dot" />
            </p>
          </div>
        </div>
        <img className='h-8 w-8 cursor-pointer' src={assets.help_icon} alt="menu" />
      </div>

      {/* Messages Container with Hidden Scrollbar */}
      <div className='flex-1 overflow-hidden relative h-[80vh]'>
        <div 
          className='h-full overflow-y-auto p-4 space-y-4'
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* Internet Explorer 10+ */
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; /* Safari and Chrome */
            }
          `}</style>
          
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === "sent" ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender === 'sent' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <img
                  className='h-8 w-8 rounded-full object-cover flex-shrink-0'
                  src={msg.avatar}
                  alt="avatar"
                />
                <div className={`flex flex-col ${msg.sender === 'sent' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl ${
                    msg.sender === 'sent' 
                      ? 'bg-blue-500 text-white rounded-br-md' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-md'
                  }`}>
                    {msg.type === "image"? (
                      <img 
                        src={msg.image}
                        alt='sent-media'
                        className='max-w-[200px] rounded-lg'
                        />
                    ): (
                      <p className='text-sm break-words'>{msg.message}</p>
                    )}
                  </div>
                  <span className='text-xs text-gray-500 mt-1'>{msg.time}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box */}
      <div className='p-4 bg-white border-t border-gray-200'>
        {/* Image preview in input box  */}
        {imagePreview && (
          <div className='relative w-24 h-24 mb-2 p-2 border rounded-lg'>
            <img src={imagePreview} alt="media-sent" 
            className='w-full h-full object-cover rounded'
            />
            <button className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-x'
            onClick={() => setImagePreview(null)}
            >
              &times;
            </button>

          </div>
        )}
        <div className='flex items-center bg-gray-100 rounded-full px-4 py-2'>
          <input
            className='flex-1 bg-transparent outline-none text-sm'
            type="text"
            placeholder='Send a message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className='flex gap-3 items-center ml-2'>
            <input type="file" id="image" accept='image/png, image/jpeg' hidden onChange={handleImageChange} />
            <label htmlFor="image" className='cursor-pointer'>
              <img className='h-5 w-5' src={assets.gallery_icon} alt="gallery" />
            </label>
            <img
              onClick={handleSendMessage}
              className='h-5 w-5 cursor-pointer'
              src={assets.send_button}
              alt="send"
            
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBar