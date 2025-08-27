import { useState, useRef, useEffect } from 'react'
import { Textarea } from './ui/textarea'

interface TypstEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TypstEditor({ value, onChange, placeholder }: TypstEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineNumbers, setLineNumbers] = useState<number[]>([])

  useEffect(() => {
    const lines = value.split('\n').length
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Add tab support
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2
      }, 0)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const lineNumbersElement = document.getElementById('line-numbers')
    if (lineNumbersElement) {
      lineNumbersElement.scrollTop = e.currentTarget.scrollTop
    }
  }

  return (
    <div className="flex h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Line Numbers */}
      <div 
        id="line-numbers"
        className="bg-gray-50 px-3 py-2 text-xs text-gray-500 font-mono leading-6 overflow-hidden border-r border-gray-200 select-none"
        style={{ 
          minWidth: '3rem',
          maxHeight: '100%',
          overflowY: 'hidden'
        }}
      >
        {lineNumbers.map((lineNum) => (
          <div key={lineNum} className="h-6 flex items-center justify-end">
            {lineNum}
          </div>
        ))}
      </div>
      
      {/* Editor */}
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          placeholder={placeholder}
          className="w-full h-full resize-none font-mono text-sm leading-6 border-none rounded-none focus:ring-0 focus:ring-offset-0 bg-transparent"
          style={{
            minHeight: '100%',
            paddingTop: '8px',
            paddingBottom: '8px',
            lineHeight: '1.5rem'
          }}
        />
      </div>
    </div>
  )
}
