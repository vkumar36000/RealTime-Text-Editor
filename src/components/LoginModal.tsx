import React, { useState } from 'react'

interface LoginModalProps {
    onSubmit:(username:string)=> void;
}

export default function LoginModal({onSubmit}:LoginModalProps) {
  const [name, setname] = useState('');

  const handleSubmit = (e: React.FormEvent)=>{
    e.preventDefault();
    if(name.trim()){
        onSubmit(name.trim());
    }
  }

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Enter Your Username</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Your name"
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-sky-500 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >Join</button>
        </form>
      </div>
    </div>
  )
}
