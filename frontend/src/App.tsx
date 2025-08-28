import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { FileText, Play, Download, Palette, Zap } from 'lucide-react'
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
import { ResumeApiService, type TemplateInfo, type TemplateConfig } from './lib/resume-data'
import './App.css'

function App() {
  const [typstContent, setTypstContent] = useState('')
  const [isCompiling, setIsCompiling] = useState(false)
  const [compiledOutput, setCompiledOutput] = useState('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [compilationError, setCompilationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTheme, setCurrentTheme] = useState('minimal-1')
  const [availableTemplates, setAvailableTemplates] = useState<TemplateInfo[]>([])
  const [currentTemplateConfig, setCurrentTemplateConfig] = useState<TemplateConfig | null>(null)

  const apiService = new ResumeApiService()

  // Load available templates and current theme
  const loadTemplates = async () => {
    try {
      const templates = await apiService.getTemplates()
      setAvailableTemplates(templates)
      
      // Set the first template as default if none is selected
      if (templates.length > 0 && !currentTheme) {
        setCurrentTheme(templates[0].name)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  // Load template configuration and content
  const loadTemplateContent = async (templateName: string) => {
    try {
      // Load template config
      const config = await apiService.getTemplate(templateName)
      setCurrentTemplateConfig(config)
      
      // Load template content  
      const response = await fetch(`http://localhost:8000/templates/${templateName}/content`)
      if (response.ok) {
        const data = await response.json()
        setTypstContent(data.content)
        setCompiledOutput(`Template "${config.displayName}" loaded. Click "Compile" to generate PDF.`)
      } else {
        console.error('Failed to load template content')
        setTypstContent(`// Error loading template content for ${templateName}`)
      }
    } catch (error) {
      console.error('Error loading template:', error)
      setTypstContent('// Error loading template. Please check your connection.')
    }
  }

  // Helper function to get template display name
  const getTemplateDisplayName = (templateName: string) => {
    const template = availableTemplates.find(t => t.name === templateName)
    return template?.config?.displayName || templateName
  }

  // Switch theme to a different template
  const handleThemeSwitch = async (newTheme: string) => {
    try {
      setCurrentTheme(newTheme)
      
      // Load new template config but preserve current content
      const config = await apiService.getTemplate(newTheme)
      setCurrentTemplateConfig(config)
      
      // Don't load template content - preserve current editor content
      setCompiledOutput(`Theme switched to ${config.displayName}. Content preserved. Click "Compile" to see changes.`)
      // Clear current PDF to force recompilation
      setPdfUrl(null)
    } catch (error) {
      console.error('Error switching theme:', error)
    }
  }

  // Load template content on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadTemplates()
        await loadTemplateContent(currentTheme)
      } catch (error) {
        console.error('Error initializing app:', error)
        setTypstContent('// Error loading template. Please check your connection.')
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleCompile = async () => {
    setIsCompiling(true)
    setCompilationError(null)
    
    try {
      const formData = new FormData()
      formData.append('content', typstContent)
      
      const response = await fetch(`http://localhost:8000/templates/${currentTheme}/compile`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Compilation failed')
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      // Clean up previous URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
      
      setPdfUrl(url)
      setCompiledOutput('PDF compiled successfully!')
      
    } catch (error: any) {
      console.error('Compilation error:', error)
      setCompilationError(error.message || 'Compilation failed')
      setCompiledOutput('')
      setPdfUrl(null)
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
                  {getTemplateDisplayName(currentTheme)}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-1 p-2 w-48">
                    {availableTemplates
                      .filter(template => template.name !== 'presets') // Exclude presets folder
                      .map((template) => (
                        <NavigationMenuLink asChild key={template.name}>
                          <button
                            onClick={() => handleThemeSwitch(template.name)}
                            className={`flex items-start gap-2 rounded-md p-2 hover:bg-accent transition-colors text-left text-xs ${
                              currentTheme === template.name ? 'bg-accent' : ''
                            }`}
                          >
                            <div className={`w-2 h-2 rounded mt-1 ${
                              template.name === 'minimal-1' ? 'bg-blue-500' : 
                              template.name === 'minimal-2' ? 'bg-green-500' :
                              'bg-purple-500'
                            }`}></div>
                            <div>
                              <div className="font-medium">{template.config?.displayName || template.name}</div>
                              <div className="text-gray-500">{template.config?.description || 'No description'}</div>
                            </div>
                          </button>
                        </NavigationMenuLink>
                      ))}
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
                currentTemplate={currentTemplateConfig}
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
