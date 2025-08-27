import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { FileText, Play, Download, Save, FolderOpen } from 'lucide-react'
import { TypstEditor } from './components/TypstEditor'
import { TypstPreview } from './components/TypstPreview'
import { ConfigPanel } from './components/ConfigPanel'
import './App.css'

function App() {
  const [typstContent, setTypstContent] = useState('')
  const [isCompiling, setIsCompiling] = useState(false)
  const [compiledOutput, setCompiledOutput] = useState('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [compilationError, setCompilationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load template content on component mount
  useEffect(() => {
    const loadTemplateContent = async () => {
      try {
        const response = await fetch('http://localhost:8000/template-content')
        if (response.ok) {
          const data = await response.json()
          setTypstContent(data.content)
          setCompiledOutput('Template loaded. Click "Compile" to generate PDF.')
        } else {
          console.error('Failed to load template content')
          setTypstContent(`#set page(
  paper: "a4",
  margin: (x: 1.8cm, y: 1.5cm),
)
#set text(
  font: "Linux Libertine",
  size: 11pt,
)

= Resume

== Personal Information
*Name:* Your Name \\
*Email:* your.email@example.com \\
*Phone:* +1 (555) 123-4567

== Experience
*Software Engineer* | Company Name | 2022 - Present
- Developed applications using modern technologies
- Collaborated with cross-functional teams
- Improved system performance

== Education
*Degree* | University Name | Year
- Relevant coursework and achievements

== Skills
- Programming Languages: Python, JavaScript, TypeScript
- Frameworks: React, Node.js
- Tools: Git, Docker, VS Code`)
        }
      } catch (error) {
        console.error('Error loading template:', error)
        setTypstContent('// Error loading template. Please check your connection.')
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplateContent()
  }, [])

  const handleCompile = async () => {
    setIsCompiling(true)
    setCompilationError(null)
    
    try {
      const formData = new FormData()
      formData.append('content', typstContent)
      
      const response = await fetch('http://localhost:8000/compile', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Compilation failed')
      }
      
      // Get the PDF blob
      const pdfBlob = await response.blob()
      
      // Create object URL for the PDF
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)
      setCompiledOutput('PDF compiled successfully!')
      
    } catch (error) {
      console.error('Compilation error:', error)
      setCompilationError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsCompiling(false)
    }
  }

  const handleRefresh = () => {
    handleCompile()
  }

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = 'resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleCompileTemplate = async () => {
    setIsCompiling(true)
    setCompilationError(null)
    
    try {
      const response = await fetch('http://localhost:8000/compile-template-direct', {
        method: 'POST',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Template compilation failed')
      }
      
      // Get the PDF blob
      const pdfBlob = await response.blob()
      
      // Create object URL for the PDF
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)
      setCompiledOutput('Template compiled successfully!')
      
    } catch (error) {
      console.error('Template compilation error:', error)
      setCompilationError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsCompiling(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <FileText className="w-7 h-7 text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Flash Resume</h1>
            <p className="text-xs text-gray-600">Typst Resume Compiler</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Open
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button 
            onClick={handleCompileTemplate}
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Load Template
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button 
            onClick={handleCompile} 
            disabled={isCompiling}
            className="flex items-center gap-2"
            size="sm"
          >
            <Play className="w-4 h-4" />
            {isCompiling ? 'Compiling...' : 'Compile'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleDownloadPdf}
            disabled={!pdfUrl}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <ConfigPanel onConfigUpdate={handleRefresh} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Editor Panel */}
        <div className="w-1/2 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Typst Editor</h2>
            <p className="text-sm text-gray-600">Edit your resume content using Typst markup</p>
          </div>
          <div className="flex-1 p-4 min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Loading template...</div>
              </div>
            ) : (
              <TypstEditor
                value={typstContent}
                onChange={setTypstContent}
                placeholder="Loading template content..."
              />
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col min-h-0">
          <TypstPreview
            content={compiledOutput}
            isCompiling={isCompiling}
            onRefresh={handleRefresh}
            pdfUrl={pdfUrl}
            error={compilationError}
          />
        </div>
      </div>
    </div>
  )
}

export default App
