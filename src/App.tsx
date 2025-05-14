import { useEffect, useState } from 'react'
import './App.css'
import Editor from './components/Editor'
import LoginModal from './components/LoginModal'

function App() {
  const [userName, setUserName] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    let storedName = localStorage.getItem('username')
    if (storedName) {
      setUserName(storedName)
    } else {
      // Set as anonymous if not logged in
      setUserName('anonymous')
    }
  }, [])

  const handleLogin = (name: string) => {
    localStorage.setItem('username', name)
    setUserName(name)
    setShowLoginModal(false)
  }

  const handleLogoutOrLoginRedirect = () => {
    // Remove anonymous state and open login modal
    localStorage.removeItem('username')
    setShowLoginModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Login Modal */}
      {showLoginModal && <LoginModal onSubmit={handleLogin} />}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center">Real-Time Text Editor</h1>

        {userName === 'anonymous' && (
          <button
            onClick={handleLogoutOrLoginRedirect}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        )}
      </div>

      <p className="text-center text-gray-600 mb-4">
        Logged in as: <span className="font-semibold">{userName}</span>
      </p>

      <Editor username={userName ?? 'anonymous'} />
    </div>
  )
}

export default App
