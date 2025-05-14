import { Mark, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
    }
  }
}

export const FontSize = Mark.create({
  name: 'fontSize',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      size: {
        default: '16px',
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.size) {
            return {}
          }
          return {
            style: `font-size: ${attributes.size}`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        style: 'font-size',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands(): Partial<import('@tiptap/core').RawCommands> {
    return {
      setFontSize:
        (size: string) =>
        ({ commands }) => {
          return commands.setMark(this.name, { size })
        },
    }
  },
})
