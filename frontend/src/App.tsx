import { useState } from 'react'
import { Button } from './components/ui/button'
import { FileText, Play, Download, Settings, Save, FolderOpen } from 'lucide-react'
import { TypstEditor } from './components/TypstEditor'
import { TypstPreview } from './components/TypstPreview'
import './App.css'

function App() {
  const [typstContent, setTypstContent] = useState(`#set page(
  paper: "a4",
  margin: (x: 1.8cm, y: 1.5cm),
)
#set text(
  font: "Linux Libertine",
  size: 11pt,
)

= Resume

== Personal Information
*Name:* John Doe \\
*Email:* john.doe@example.com \\
*Phone:* +1 (555) 123-4567 \\
*LinkedIn:* linkedin.com/in/johndoe

== Experience
*Software Engineer* | Tech Company | 2022 - Present
- Developed web applications using React and TypeScript
- Collaborated with cross-functional teams to deliver features
- Improved application performance by 30% through optimization
- Mentored junior developers and led code reviews

*Junior Developer* | Startup Inc | 2021 - 2022
- Built responsive user interfaces with modern web technologies
- Participated in agile development processes
- Contributed to open-source projects

== Education
*Bachelor of Computer Science* | University Name | 2018-2022
- Relevant coursework: Data Structures, Algorithms, Web Development
- GPA: 3.8/4.0
- Dean's List: Fall 2020, Spring 2021

== Skills
- *Programming Languages:* JavaScript, TypeScript, Python, Rust, Go
- *Frontend:* React, Vue.js, HTML5, CSS3, TailwindCSS
- *Backend:* Node.js, Express, FastAPI, PostgreSQL
- *Tools:* Git, Docker, VS Code, Linux`)

  const [isCompiling, setIsCompiling] = useState(false)
  const [compiledOutput, setCompiledOutput] = useState(typstContent)

  const handleCompile = async () => {
    setIsCompiling(true)
    // Simulate compilation delay
    setTimeout(() => {
      setCompiledOutput(typstContent)
      setIsCompiling(false)
    }, 1000)
  }

  const handleRefresh = () => {
    handleCompile()
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
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Editor Panel */}
        <div className="w-1/2 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Typst Editor</h2>
            <p className="text-sm text-gray-600">Write your resume in Typst markup language</p>
          </div>
          <div className="flex-1 p-4 min-h-0">
            <TypstEditor
              value={typstContent}
              onChange={setTypstContent}
              placeholder="Enter your Typst content here..."
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col min-h-0">
          <TypstPreview
            content={compiledOutput}
            isCompiling={isCompiling}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  )
}

export default App
