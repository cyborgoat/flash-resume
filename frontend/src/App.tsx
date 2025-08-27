import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { FileText, Play, Download, Palette, Settings, Zap } from 'lucide-react'
import { TypstEditor } from './components/TypstEditor'
import { TypstPreview } from './components/TypstPreview'
import { ConfigPanel } from './components/ConfigPanel'
import { BlockEditor } from './components/BlockEditor'
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
      <header className="border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">ResumeForge</span>
          </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleCompileTemplate}
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-xs"
          >
            <FileText className="w-3 h-3" />
            Template
          </Button>
          
          {/* Theme Selection Dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-8 text-xs font-medium flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  {currentTheme === 'minimal-1' ? 'Theme 1' : 'Theme 2'}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-1 p-2 w-48">
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleThemeSwitch('minimal-1')}
                        className={`flex items-start gap-2 rounded-md p-2 hover:bg-accent transition-colors text-left text-xs ${
                          currentTheme === 'minimal-1' ? 'bg-accent' : ''
                        }`}
                      >
                        <div className="w-2 h-2 rounded bg-blue-500 mt-1"></div>
                        <div>
                          <div className="font-medium">Theme 1</div>
                          <div className="text-gray-500">Clean & minimal</div>
                        </div>
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleThemeSwitch('minimal-2')}
                        className={`flex items-start gap-2 rounded-md p-2 hover:bg-accent transition-colors text-left text-xs ${
                          currentTheme === 'minimal-2' ? 'bg-accent' : ''
                        }`}
                      >
                        <div className="w-2 h-2 rounded bg-green-500 mt-1"></div>
                        <div>
                          <div className="font-medium">Theme 2</div>
                          <div className="text-gray-500">Enhanced design</div>
                        </div>
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
            className="flex items-center gap-1 h-8 text-xs"
            size="sm"
          >
            <Play className="w-3 h-3" />
            {isCompiling ? 'Compiling...' : 'Compile'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-xs h-8"
            onClick={handleDownloadPdf}
            disabled={!pdfUrl}
          >
            <Download className="w-3 h-3" />
            Export
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
              <BlockEditor
                content={typstContent}
                onChange={setTypstContent}
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
