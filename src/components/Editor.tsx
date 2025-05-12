import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ReconnectingWebSocket from 'reconnecting-websocket';


interface Props {
    username: string;
}


export default function Editor({username}:Props) {

    const editor = useEditor({
        extensions: [StarterKit],
        content: `<p> Hello ${username}, now you can start writing your own text!</p>`,
    })

     useEffect(() => {
    if (!editor) return

    const socket = new ReconnectingWebSocket('ws://localhost:1234')

    // Send changes
    editor.on('update', () => {
      const json = editor.getJSON()
      socket.send(JSON.stringify({ user: username, doc: json }))
    })

    // Receive changes
    socket.onmessage = (event) => {
      const { doc } = JSON.parse(event.data)
      if (doc && editor) {
        editor.commands.setContent(doc)
      }
    }

    return () => socket.close()
  }, [editor])
    
    return (
        <div className='border-2 border-gray-300 rounded-lg max-w-2xl mx-auto mt-8'>
            <EditorContent editor={editor} className='min-h-[200px] outline-none'/>
        </div>
    );
}
