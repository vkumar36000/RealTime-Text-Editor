import { useEffect, useState } from 'react';
import './App.css'
import Editor from './components/Editor'
import LoginModal from './components/LoginModal';



function App() {
const [userName, setuserName] = useState<string | null>(null);

useEffect(() => {
  let storedName = localStorage.getItem('username');
  if(storedName){
    setuserName(storedName);
  }
}, []);

 const handleLogin  = (name:string)=>{
  localStorage.setItem('username', name);
  setuserName(name);
 }

  if(!userName){
    return (
      <LoginModal onSubmit={handleLogin}/>
    )
  };

  return (
      <div className='min-h-screen bg-gray-100 p-8'>
        <h1 className='text-2xl font-bold text-center mb-4'>Real-Time Text Editor</h1>
        <p className='text-center text-gray-600 mb-4'>Logged in as:<span className='font-semibold'>{userName}</span></p>
        <Editor username={userName}/>
      </div>
  )
}

export default App;
