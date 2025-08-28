import { useState } from 'react'
import { Button } from './ui/button'
import { Eye, FileText, Download, RefreshCw } from 'lucide-react'

interface TypstPreviewProps {
  content: string
  isCompiling?: boolean
  onRefresh?: () => void
  pdfUrl?: string | null
  error?: string | null
}

export function TypstPreview({ content, isCompiling = false, onRefresh, pdfUrl, error }: TypstPreviewProps) {
  const [viewMode, setViewMode] = useState<'source' | 'preview'>('source')

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gray-700 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
          {isCompiling && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-300 rounded-full">
              <RefreshCw className="w-4 h-4 text-gray-600 animate-spin" />
              <span className="text-sm text-gray-700 font-medium">Compiling...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-lg border border-gray-200 shadow-sm">
            <Button
              size="sm"
              variant={viewMode === 'source' ? 'default' : 'ghost'}
              onClick={() => setViewMode('source')}
              className={`h-9 px-4 text-sm ${
                viewMode === 'source' 
                  ? 'bg-gray-800 text-white hover:bg-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Source
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'preview' ? 'default' : 'ghost'}
              onClick={() => setViewMode('preview')}
              className={`h-9 px-4 text-sm ${
                viewMode === 'preview' 
                  ? 'bg-gray-800 text-white hover:bg-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
          
          {onRefresh && (
            <Button
              onClick={onRefresh}
              size="sm"
              variant="outline"
              className="flex items-center gap-2 h-9 px-4 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-3 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
              Compilation Error
            </h3>
            <pre className="text-red-700 text-sm whitespace-pre-wrap bg-white p-4 rounded border">{error}</pre>
          </div>
        ) : viewMode === 'source' ? (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 h-full">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed bg-white p-4 rounded border h-full overflow-auto">
              {content || 'No content to preview...'}
            </pre>
          </div>
        ) : (
          <div className="h-full">
            {pdfUrl ? (
              <div className="bg-white rounded-lg border border-gray-200 h-full shadow-inner">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full rounded-lg"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 h-full flex flex-col items-center justify-center text-gray-500">
                <div className="w-20 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-6 shadow-sm">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Preview</h3>
                <p className="text-sm text-center text-gray-600 mb-6 max-w-sm">
                  Click the "Compile" button in the header to generate and preview your resume PDF.
                </p>
                <Button size="sm" variant="outline" disabled className="flex items-center gap-2 border-gray-300">
                  <Download className="w-4 h-4" />
                  No PDF Available
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
        {isCompiling ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-gray-600" />
            <span className="text-gray-700 font-medium">Compiling your resume...</span>
          </div>
        ) : pdfUrl ? (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              ✅ <span className="text-gray-700 font-medium">Resume compiled successfully</span>
            </span>
            <span className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        ) : error ? (
          <span className="text-red-600 font-medium">⚠️ Compilation failed - please check the error above</span>
        ) : (
          <span>Ready to compile - make your changes and click "Compile"</span>
        )}
      </div>
    </div>
  )
}
