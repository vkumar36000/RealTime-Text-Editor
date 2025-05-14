import { useState } from 'react'

interface Props {
  onClose: () => void
  onAddUser: (email: string) => void
  onRemoveUser: (email: string) => void // ✅ NEW
  collaborators: { email: string; online: boolean }[]
  currentUserEmail: string
}

export default function CollabModal({
  onClose,
  onAddUser,
  onRemoveUser, // ✅ NEW
  collaborators,
  currentUserEmail,
}: Props) {
  const [email, setEmail] = useState('')

  const handleAdd = () => {
    if (
      email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      email.trim().toLowerCase() !== currentUserEmail.toLowerCase() &&
      email.trim().toLowerCase() !== 'anonymous'
    ) {
      onAddUser(email.trim())
      setEmail('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Collaborators</h2>

        <input
          type="email"
          value={email}
          placeholder="Enter collaborator email"
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-1 w-full mb-3"
        />

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 mb-4"
        >
          Add
        </button>

        <ul className="space-y-1 mb-4">
          {collaborators
            .filter(
              (c) =>
                c.email.toLowerCase() !== currentUserEmail.toLowerCase() &&
                c.email.toLowerCase() !== 'anonymous'
            )
            .map((c) => (
              <li key={c.email} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {/* ❌ Remove Button */}
                  <button
                    onClick={() => onRemoveUser(c.email)}
                    className="text-red-600 hover:text-red-800 font-bold"
                    title="Remove collaborator"
                  >
                    ×
                  </button>
                  <span>{c.email}</span>
                </div> 
                <span
                  className={`text-sm font-medium ${
                    c.online ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {c.online ? 'Online' : 'Offline'}
                </span>
              </li>
            ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-600 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  )
}
