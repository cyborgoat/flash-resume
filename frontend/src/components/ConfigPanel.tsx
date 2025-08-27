import { useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Settings, Save, RefreshCw } from 'lucide-react'

interface ConfigPanelProps {
  onConfigUpdate?: () => void
}

export function ConfigPanel({ onConfigUpdate }: ConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const loadConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data.content)
      }
    } catch (error) {
      console.error('Error loading config:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfig = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('content', config)
      
      const response = await fetch('http://localhost:8000/update-config', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        onConfigUpdate?.()
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Error saving config:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    if (!config) {
      loadConfig()
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={handleOpen} variant="outline" size="sm">
        <Settings className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
          <p className="text-sm text-gray-600">Edit template settings and theme configuration</p>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <Textarea
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              placeholder="Loading configuration..."
              className="w-full h-96 font-mono text-sm"
            />
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <Button 
            onClick={() => setIsOpen(false)} 
            variant="outline"
          >
            Cancel
          </Button>
          <Button 
            onClick={saveConfig} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Config'}
          </Button>
        </div>
      </div>
    </div>
  )
}
