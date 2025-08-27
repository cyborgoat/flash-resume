import { useState } from 'react'
import { Button } from './ui/button'
import { Eye, FileText, Download, RefreshCw } from 'lucide-react'

interface TypstPreviewProps {
  content: string
  isCompiling?: boolean
  onRefresh?: () => void
}

export function TypstPreview({ content, isCompiling = false, onRefresh }: TypstPreviewProps) {
  const [viewMode, setViewMode] = useState<'source' | 'preview'>('source')

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">Preview</h3>
          {isCompiling && (
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-md p-1">
            <Button
              size="sm"
              variant={viewMode === 'source' ? 'default' : 'ghost'}
              onClick={() => setViewMode('source')}
              className="h-7 px-2 text-xs"
            >
              <FileText className="w-3 h-3 mr-1" />
              Source
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'preview' ? 'default' : 'ghost'}
              onClick={() => setViewMode('preview')}
              className="h-7 px-2 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Button>
          </div>
          
          {onRefresh && (
            <Button size="sm" variant="outline" onClick={onRefresh}>
              <RefreshCw className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'source' ? (
          <div className="p-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
              <pre className="whitespace-pre-wrap font-mono text-xs text-gray-700 leading-relaxed">
                {content || 'No content to preview...'}
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* PDF Preview Placeholder */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 h-full flex flex-col items-center justify-center text-gray-500">
              <div className="w-32 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">PDF Preview</h3>
              <p className="text-xs text-center text-gray-600 mb-4">
                The compiled PDF will appear here once the Typst compilation is implemented.
              </p>
              <Button size="sm" variant="outline" disabled>
                <Download className="w-3 h-3 mr-1" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span>
            Lines: {content.split('\n').length} | 
            Chars: {content.length}
          </span>
          <span className="text-blue-600">
            Ready for compilation
          </span>
        </div>
      </div>
    </div>
  )
}
