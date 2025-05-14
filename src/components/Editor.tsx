import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import { useEffect, useRef, useState } from 'react'
import { FontSize } from '../Extensions/FontSize'
import ReconnectingWebSocket from 'reconnecting-websocket'
import CollabModal from './CollabModal'

interface Props {
  username: string
}

export default function Editor({ username }: Props) {
  const [showCollabModal, setShowCollabModal] = useState(false)
  const [collaborators, setCollaborators] = useState<{ email: string; online: boolean }[]>([])
  const socketRef = useRef<ReconnectingWebSocket | null>(null)
  const lastUpdateSource = useRef<'self' | 'remote' | null>(null)

  const editor = useEditor({
    extensions: [StarterKit, Bold, FontSize],
    content: `<p>Welcome ${username}!</p>`,
    onUpdate: ({ editor }) => {
      if (lastUpdateSource.current === 'remote') return
      const json = editor.getJSON()
      socketRef.current?.send(JSON.stringify({ type: 'change', doc: json }))
    }
  })

  useEffect(() => {
    const socket = new ReconnectingWebSocket('ws://localhost:1234')
    socketRef.current = socket

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'join', email: username }))
      socket.send(JSON.stringify({ type: 'requestStatus' }))
    }

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)

        if (msg.type === 'onlineUsers') {
          const onlineSet = new Set<string>(msg.users)
          setCollaborators((prev) => {
            const merged: Record<string, boolean> = {}
            prev.forEach((c) => (merged[c.email] = c.online))
            msg.users.forEach((email: string) => (merged[email] = true))
            prev.forEach((c) => {
              if (!onlineSet.has(c.email)) merged[c.email] = false
            })
            return Object.entries(merged).map(([email, online]) => ({ email, online }))
          })
        }

        if (msg.type === 'change' && msg.doc && editor) {
          lastUpdateSource.current = 'remote'
          editor.commands.setContent(msg.doc, false) // false = no history (prevents triggering update)
          lastUpdateSource.current = null
        }
      } catch (err) {
        console.error('Failed to parse message:', err)
      }
    }

    return () => {
      socket.close()
    }
  }, [username, editor])

  const isAnonymous = username === 'anonymous'

  const handleAddUser = (email: string) => {
    if (!collaborators.find((c) => c.email === email)) {
      setCollaborators((prev) => [...prev, { email, online: false }])
      socketRef.current?.send(JSON.stringify({ type: 'requestStatus' }))
    }
  }

  const handleRemoveUser = (email: string) => {
    setCollaborators((prev) => prev.filter((c) => c.email !== email))
  }


  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded-md border ${editor?.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-white'
            } hover:bg-blue-100`}
        >
          Bold
        </button>

        <button
          disabled={isAnonymous}
          onClick={() => editor?.chain().focus().setFontSize('24px').run()}
          className={`px-3 py-1 rounded-md border ${isAnonymous ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'
            }`}
        >
          ↑ A
        </button>

        <button
          disabled={isAnonymous}
          onClick={() => editor?.chain().focus().setFontSize('14px').run()}
          className={`px-3 py-1 rounded-md border ${isAnonymous ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'
            }`}
        >
          ↓ A
        </button>

        <button
          disabled={isAnonymous}
          className={`px-3 py-1 rounded-md border ${isAnonymous ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'
            }`}
        >
          Save File
        </button>

        <button
          disabled={isAnonymous}
          className={`px-3 py-1 rounded-md border ${isAnonymous ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'
            }`}
        >
          Load File
        </button>

        <button
          disabled={isAnonymous}
          className={`px-3 py-1 rounded-md border ${isAnonymous ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'
            }`}
        >
          Search & Replace
        </button>

        <button
          disabled={isAnonymous}
          onClick={() => setShowCollabModal(true)}
          className={`px-3 py-1 rounded-md border ${isAnonymous ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-100'
            }`}
        >
          🤝 Collab
        </button>
      </div>

      {showCollabModal && (
        <CollabModal
          onClose={() => setShowCollabModal(false)}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser} // ✅ Add this
          collaborators={collaborators}
          currentUserEmail={username}
        />

      )}

      <div className="border border-gray-300 p-4 rounded-md bg-white min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
