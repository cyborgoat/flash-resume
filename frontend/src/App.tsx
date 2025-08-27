import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { FileText, Play, Download } from 'lucide-react'
import { TypstEditor } from './components/TypstEditor'
import { TypstPreview } from './components/TypstPreview'
import { ConfigPanel } from './components/ConfigPanel'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './components/ui/navigation-menu'
import './App.css'

function App() {
  const [typstContent, setTypstContent] = useState('')
  const [isCompiling, setIsCompiling] = useState(false)
  const [compiledOutput, setCompiledOutput] = useState('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [compilationError, setCompilationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTheme, setCurrentTheme] = useState('minimal-1')

  // Load current theme from config
  const loadCurrentTheme = async () => {
    try {
      const response = await fetch('http://localhost:8000/config')
      if (response.ok) {
        const data = await response.json()
        // Parse TOML content to extract theme
        const configContent = data.content
        const themeMatch = configContent.match(/active\s*=\s*"([^"]+)"/)
        if (themeMatch) {
          setCurrentTheme(themeMatch[1])
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }

  // Switch theme by updating config
  const handleThemeSwitch = async (newTheme: string) => {
    try {
      // Get current config
      const configResponse = await fetch('http://localhost:8000/config')
      if (!configResponse.ok) return
      
      const configData = await configResponse.json()
      const currentConfig = configData.content
      
      // Update theme in config
      const updatedConfig = currentConfig.replace(
        /active\s*=\s*"[^"]+"/,
        `active = "${newTheme}"`
      )
      
      // Save updated config
      const formData = new FormData()
      formData.append('content', updatedConfig)
      
      const updateResponse = await fetch('http://localhost:8000/update-config', {
        method: 'POST',
        body: formData,
      })
      
      if (updateResponse.ok) {
        setCurrentTheme(newTheme)
        setCompiledOutput(`Theme switched to ${newTheme}. Click "Compile" to see changes.`)
        // Clear current PDF to force recompilation
        setPdfUrl(null)
      }
    } catch (error) {
      console.error('Error switching theme:', error)
    }
  }

  // Load template content on component mount
  useEffect(() => {
    const loadTemplateContent = async () => {
      try {
        const response = await fetch('http://localhost:8000/editable-content')
        if (response.ok) {
          const data = await response.json()
          setTypstContent(data.content)
          setCompiledOutput('Template loaded. Click "Compile" to generate PDF.')
        } else {
          console.error('Failed to load template content')
          setTypstContent(`// ==============================================================================
// PERSONAL INFORMATION
// ==============================================================================
// Put your personal information here, replacing the example data
#let author-info = (
  firstname: "Your First",
  lastname: "Name",
  email: "your.email@example.com",
  homepage: "https://yourwebsite.com",
  phone: "(+1) 555-123-4567",
  github: "your-github",
  twitter: "your-twitter",
  scholar: "your-scholar-id",
  orcid: "0000-0000-0000-0000",
  birth: "Your Birth Date",
  linkedin: "your-linkedin",
  address: "Your Address",
  positions: (
    "Your Job Title",
    "Another Position",
  ),
)

// ==============================================================================
// RESUME CONTENT
// ==============================================================================

= Education

#education(
  school: "Your University",
  degree: "Your Degree",
  date: "Start Date - End Date",
  location: "City, State",
  gpa: "X.X/4.0",
  honors: "Any honors or distinctions",
  courses: "Relevant coursework",
)

= Experience

#experience(
  company: "Company Name",
  position: "Your Position",
  date: "Start Date - End Date",
  location: "City, State",
  description: [
    - Your key accomplishment or responsibility
    - Another achievement with specific metrics
    - Third bullet point describing your impact
  ],
)

= Skills

#skill(
  category: "Programming Languages",
  skills: "Python, JavaScript, etc.",
)`)
        }
        
        // Load current theme from config
        await loadCurrentTheme()
        
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
      // Get the full template to extract the header
      const templateResponse = await fetch('http://localhost:8000/template-content')
      if (!templateResponse.ok) {
        throw new Error('Failed to load template header')
      }
      
      const templateData = await templateResponse.json()
      const fullTemplate = templateData.content
      const editableStartMarker = '// ==============================================================================\n// PERSONAL INFORMATION\n// =============================================================================='
      const editableStart = fullTemplate.indexOf(editableStartMarker)
      
      let templateHeader = ''
      if (editableStart !== -1) {
        templateHeader = fullTemplate.substring(0, editableStart)
      }
      
      // Combine template header with user content
      const fullContent = templateHeader + typstContent
      
      const formData = new FormData()
      formData.append('content', fullContent)
      
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
            {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Flash Resume</h1>
              <p className="text-xs text-gray-600">Typst Resume Compiler</p>
            </div>
          </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCompileTemplate}
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Load Template
          </Button>
          
          {/* Theme Selection Dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 text-sm font-medium">
                  Theme: {currentTheme === 'minimal-1' ? 'Minimal 1' : 'Minimal 2'}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-1 p-2 w-64">
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleThemeSwitch('minimal-1')}
                        className={`flex flex-col items-start gap-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors outline-none ${
                          currentTheme === 'minimal-1' ? 'bg-accent text-accent-foreground' : ''
                        }`}
                      >
                        <div className="text-sm font-medium">Minimal 1</div>
                        <div className="text-xs text-muted-foreground">Clean and simple professional layout</div>
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleThemeSwitch('minimal-2')}
                        className={`flex flex-col items-start gap-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors outline-none ${
                          currentTheme === 'minimal-2' ? 'bg-accent text-accent-foreground' : ''
                        }`}
                      >
                        <div className="text-sm font-medium">Minimal 2</div>
                        <div className="text-xs text-muted-foreground">Enhanced design with icons and multi-language support</div>
                      </button>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
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
