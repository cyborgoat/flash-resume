import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from './ui/dialog'
import { Edit, Trash2, GraduationCap, Briefcase, Code, Award, User, FileText, Trophy, Hash, Calculator, Plus, AlertTriangle } from 'lucide-react'
import type { TemplateConfig } from '../lib/resume-data'

// Resume section configuration with professional ordering
  const resumeSections: ResumeSection[] = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      icon: User,
      allowMultiple: false,
      required: true,
      blockTypes: ['personal-info']
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      allowMultiple: true,
      required: false,
      blockTypes: ['education', 'gpa']
    },
    {
      id: 'experience',
      title: 'Work Experience',
      icon: Briefcase,
      allowMultiple: true,
      required: false,
      blockTypes: ['experience']
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: Code,
      allowMultiple: true,
      required: false,
      blockTypes: ['project']
    },
    {
      id: 'skills',
      title: 'Skills & Competencies',
      icon: Award,
      allowMultiple: true,
      required: false,
      blockTypes: ['skill', 'skill-item']
    },
    {
      id: 'certifications',
      title: 'Certifications & Awards',
      icon: Trophy,
      allowMultiple: true,
      required: false,
      blockTypes: ['certification']
    },
    {
      id: 'additional',
      title: 'Additional Sections',
      icon: FileText,
      allowMultiple: true,
      required: false,
      blockTypes: ['section-header', 'entry', 'extracurriculars', 'item']
    }
  ]// Block type definitions matching Typst functions
const blockTypeDefinitions = {
  'personal-info': { 
    label: 'Personal Information (#let author-info)', 
    icon: User, 
    description: 'Your contact details and basic information',
    template: `#let author-info = (
  firstname: "Your First",
  lastname: "Name",
  email: "your.email@example.com",
  phone: "(+1) 555-123-4567",
  homepage: "https://yourwebsite.com",
  github: "yourusername",
  linkedin: "yourprofile",
  address: "Your Address",
  positions: (
    "Your Job Title",
    "Another Role",
  ),
)`
  },
  'education': { 
    label: 'Education (#education)', 
    icon: GraduationCap, 
    description: 'School, degree, dates, and academic details',
    template: `#education(
  school: "University Name",
  degree: "Your Degree",
  date: "Start Date - End Date",
  location: "City, State",
  gpa: "3.8/4.0",
  honors: "Academic Honors",
  courses: "Relevant Coursework",
)`
  },
  'experience': { 
    label: 'Experience (#experience)', 
    icon: Briefcase, 
    description: 'Work experience with company and role details',
    template: `#experience(
  company: "Company Name",
  position: "Your Position",
  date: "Start Date - End Date",
  location: "City, State",
  description: [
    - Your key accomplishment
    - Another achievement
    - Important responsibility
  ],
)`
  },
  'project': { 
    label: 'Project (#project)', 
    icon: Code, 
    description: 'Personal or professional projects',
    template: `#project(
  name: "Project Name",
  date: "Date Range",
  link: "github.com/username/project",
  description: [
    - Project description
    - Key features or achievements
    - Technologies used
  ],
)`
  },
  'extracurriculars': { 
    label: 'Extracurriculars (#extracurriculars)', 
    icon: Trophy, 
    description: 'Activities and organizations',
    template: `#extracurriculars(
  organization: "Organization Name",
  role: "Your Role",
  date: "Date Range",
  description: [
    - Your contributions
    - Achievements or impact
  ],
)`
  },
  'skill': { 
    label: 'Skills (#skill)', 
    icon: Award, 
    description: 'Technical and professional skills',
    template: `#skill(
  category: "Skill Category",
  skills: "Skill 1, Skill 2, Skill 3, Skill 4",
)`
  },
  'entry': { 
    label: 'Entry (#entry)', 
    icon: FileText, 
    description: 'General entry with title, location, date',
    template: `#entry(
  title: "Entry Title",
  location: "Location/Organization",
  date: "Date",
  description: "Brief description of the entry",
  title-link: "https://optional-link.com",
)`
  },
  'item': { 
    label: 'Item (#item)', 
    icon: Hash, 
    description: 'Bullet points or descriptions',
    template: `#item[
  - Bullet point item
  - Another important point
  - Additional details
]`
  },
  'gpa': { 
    label: 'GPA (#gpa)', 
    icon: Calculator, 
    description: 'Display GPA with numerator/denominator',
    template: `#gpa(3.8, 4.0)`
  },
  'certification': { 
    label: 'Certification (#certification)', 
    icon: Award, 
    description: 'Professional certifications',
    template: `#certification(
  certification: "Certification Name",
  date: "Date Obtained",
)`
  },
  'skill-item': { 
    label: 'Skill Categories (#skill-item)', 
    icon: Hash, 
    description: 'Organized skill categories with multiple items',
    template: `#skill-item(
  category: "Skill Category",
  items: ("Item 1", "Item 2", "Item 3"),
)`
  }
}

// Simplified block interface
interface ResumeBlock {
  id: string
  type: string
  title: string
  content: string
  order: number
  sectionId: string
}

interface ResumeSection {
  id: string
  title: string
  icon: any
  allowMultiple: boolean
  required: boolean
  blockTypes: string[]
}

interface BlockEditorProps {
  content: string
  onChange: (content: string) => void
  currentTemplate: TemplateConfig | null
}

export function BlockEditor({ content, onChange, currentTemplate }: BlockEditorProps) {
  const [mode, setMode] = useState<'blocks' | 'text'>('blocks')
  const [blocks, setBlocks] = useState<ResumeBlock[]>([])
  const [editingBlock, setEditingBlock] = useState<ResumeBlock | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Group blocks by section
  const blocksBySection = blocks.reduce((acc, block) => {
    if (!acc[block.sectionId]) {
      acc[block.sectionId] = []
    }
    acc[block.sectionId].push(block)
    return acc
  }, {} as Record<string, ResumeBlock[]>)

  // Parse text content into blocks only when switching to block mode or on initial load
  useEffect(() => {
    if (content && mode === 'blocks' && !isInitialized) {
      parseContentToBlocks(content)
      setIsInitialized(true)
    }
  }, [mode, content, isInitialized])

  // Convert blocks to text content with proper ordering
  const convertBlocksToText = (blockList: ResumeBlock[]): string => {
    let textContent = ''
    
    // Add template import (this should be dynamic based on current template)
    textContent += `#import "src/resume.typ": *

`
    
    // Add personal info first
    const personalBlocks = blockList.filter(block => block.sectionId === 'personal-info')
    personalBlocks.forEach(block => {
      textContent += block.content + '\n\n'
    })
    
    // Add theme application
    textContent += `// ==============================================================================
// APPLY THEME WITH DATA
// ==============================================================================
#show: resume.with(author-info)

// ==============================================================================
// RESUME CONTENT
// ==============================================================================

`

    // Add other sections in order
    resumeSections.slice(1).forEach(section => {
      const sectionBlocks = blockList.filter(block => block.sectionId === section.id)
      if (sectionBlocks.length > 0) {
        textContent += `= ${section.title}\n\n`
        sectionBlocks.sort((a, b) => a.order - b.order).forEach(block => {
          textContent += block.content + '\n\n'
        })
      }
    })

    return textContent
  }

  // Simple parser to extract meaningful blocks
  const parseContentToBlocks = (textContent: string) => {
    const parsedBlocks: ResumeBlock[] = []
    let order = 0

    // Split content into sections and parse each meaningful block
    const lines = textContent.split('\n')
    let i = 0
    
    while (i < lines.length) {
      const line = lines[i].trim()

      // Skip empty lines and comments
      if (!line || line.startsWith('//') || line.startsWith('#import') || line.startsWith('#let config') || line.startsWith('#show:')) {
        i++
        continue
      }

      // Check for personal info block
      if (line.includes('#let author-info')) {
        const startIndex = i
        let braceCount = 0
        let endIndex = i
        
        // Find the complete author-info block
        for (let j = i; j < lines.length; j++) {
          const currentLine = lines[j]
          if (currentLine.includes('(')) braceCount++
          if (currentLine.includes(')')) braceCount--
          if (braceCount === 0 && currentLine.includes(')')) {
            endIndex = j
            break
          }
        }
        
        const blockContent = lines.slice(startIndex, endIndex + 1).join('\n')
        parsedBlocks.push({
          id: 'personal-info',
          type: 'personal-info',
          title: 'Personal Information',
          content: blockContent,
          sectionId: 'personal-info',
          order: order++
        })
        
        i = endIndex + 1
        continue
      }

      // Check for section headers (= Title) - map to sections
      if (line.startsWith('= ') && line.length > 2) {
        // Skip parsing section headers as they're generated automatically
        i++
        continue
      }

      // Check for function calls and map them to appropriate sections
      if (line.startsWith('#') && (
        line.includes('education(') || 
        line.includes('experience(') || 
        line.includes('project(') || 
        line.includes('extracurriculars(') ||
        line.includes('skill(') ||
        line.includes('entry(') ||
        line.includes('certification(') ||
        line.includes('skill-item(') ||
        line.includes('gpa(') ||
        line.includes('item[')
      )) {
        const startIndex = i
        let endIndex = i
        
        if (line.includes('item[')) {
          // Handle #item[] blocks
          let bracketCount = 0
          for (let j = i; j < lines.length; j++) {
            const currentLine = lines[j]
            for (const char of currentLine) {
              if (char === '[') bracketCount++
              if (char === ']') bracketCount--
            }
            if (bracketCount === 0) {
              endIndex = j
              break
            }
          }
        } else if (line.includes('gpa(')) {
          // Handle single-line #gpa() calls
          endIndex = i
        } else {
          // Handle function calls with parentheses
          let parenCount = 0
          for (let j = i; j < lines.length; j++) {
            const currentLine = lines[j]
            for (const char of currentLine) {
              if (char === '(') parenCount++
              if (char === ')') parenCount--
            }
            if (parenCount === 0) {
              endIndex = j
              break
            }
          }
        }
        
        const blockContent = lines.slice(startIndex, endIndex + 1).join('\n')
        
        // Determine block type and section
        let blockType = 'content'
        let sectionId = 'additional'
        let title = 'Content Block'
        
        if (line.includes('education(')) {
          blockType = 'education'
          sectionId = 'education'
          title = 'Education'
        } else if (line.includes('experience(')) {
          blockType = 'experience'
          sectionId = 'experience'
          title = 'Experience'
        } else if (line.includes('project(')) {
          blockType = 'project'
          sectionId = 'projects'
          title = 'Project'
        } else if (line.includes('extracurriculars(')) {
          blockType = 'extracurriculars'
          sectionId = 'additional'
          title = 'Extracurriculars'
        } else if (line.includes('skill(')) {
          blockType = 'skill'
          sectionId = 'skills'
          title = 'Skills'
        } else if (line.includes('entry(')) {
          blockType = 'entry'
          sectionId = 'additional'
          title = 'Entry'
        } else if (line.includes('certification(')) {
          blockType = 'certification'
          sectionId = 'certifications'
          title = 'Certification'
        } else if (line.includes('skill-item(')) {
          blockType = 'skill-item'
          sectionId = 'skills'
          title = 'Skill Item'
        } else if (line.includes('gpa(')) {
          blockType = 'gpa'
          sectionId = 'education'
          title = 'GPA'
        } else if (line.includes('item[')) {
          blockType = 'item'
          sectionId = 'additional'
          title = 'Item'
        }
        
        parsedBlocks.push({
          id: `${blockType}-${order}`,
          type: blockType,
          title: title,
          content: blockContent,
          sectionId: sectionId,
          order: order++
        })
        
        i = endIndex + 1
        continue
      }

      i++
    }

    setBlocks(parsedBlocks)
  }

  const addBlock = (sectionId: string, blockType: string) => {
    // Check if section allows multiple blocks
    const section = resumeSections.find(s => s.id === sectionId)
    if (!section) return
    
    if (!section.allowMultiple) {
      const existingBlocks = blocks.filter(block => block.sectionId === sectionId)
      if (existingBlocks.length > 0) {
        alert(`Only one ${section.title} block is allowed`)
        return
      }
    }
    
    const template = blockTypeDefinitions[blockType as keyof typeof blockTypeDefinitions]?.template || ''
    const newBlock: ResumeBlock = {
      id: `${blockType}-${Date.now()}`,
      type: blockType,
      title: template ? blockTypeDefinitions[blockType as keyof typeof blockTypeDefinitions].label : 'New Block',
      content: template,
      sectionId: sectionId,
      order: blocks.filter(b => b.sectionId === sectionId).length
    }
    
    const newBlocks = [...blocks, newBlock]
    setBlocks(newBlocks)
    const newTextContent = convertBlocksToText(newBlocks)
    onChange(newTextContent)
    
    // Automatically open edit dialog for the new block
    setEditingBlock(newBlock)
    setIsDialogOpen(true)
    
    // Scroll to the new block after a brief delay
    setTimeout(() => {
      const blockElement = document.getElementById(`block-${newBlock.id}`)
      if (blockElement) {
        blockElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const saveBlock = () => {
    if (!editingBlock) return

    const newBlocks = blocks.map(block => 
      block.id === editingBlock.id ? editingBlock : block
    )
    setBlocks(newBlocks)
    const newTextContent = convertBlocksToText(newBlocks)
    onChange(newTextContent)

    setIsDialogOpen(false)
    setEditingBlock(null)
  }

  const deleteBlock = (blockId: string) => {
    const newBlocks = blocks.filter(block => block.id !== blockId)
    setBlocks(newBlocks)
    const newTextContent = convertBlocksToText(newBlocks)
    onChange(newTextContent)
  }

  const editBlock = (block: ResumeBlock) => {
    setEditingBlock({ ...block })
    setIsDialogOpen(true)
  }

  // Handle mode switch
  const handleModeSwitch = (newMode: 'blocks' | 'text') => {
    if (newMode === 'text' && mode === 'blocks') {
      // Convert blocks to text
      const textContent = convertBlocksToText(blocks)
      onChange(textContent)
    } else if (newMode === 'blocks' && mode === 'text') {
      // Parse text to blocks
      parseContentToBlocks(content)
      setIsInitialized(true)
    }
    setMode(newMode)
  }

  // Check if a block type is supported by the current template
  const isBlockSupported = (blockType: string): boolean => {
    if (!currentTemplate) {
      return true // Default to supported if no template config
    }
    
    // Core functions are always supported (like personal-info)
    if (currentTemplate.coreFunctions && currentTemplate.coreFunctions.includes(blockType)) {
      return true
    }
    
    // Check if it's in the regular functions list
    if (currentTemplate.functions && currentTemplate.functions.includes(blockType)) {
      return true
    }
    
    return false
  }

  const renderBlockContent = (block: ResumeBlock) => {
    const blockTypeDef = blockTypeDefinitions[block.type as keyof typeof blockTypeDefinitions]
    const Icon = blockTypeDef?.icon || FileText
    const isSupported = isBlockSupported(block.type)

    return (
      <div 
        id={`block-${block.id}`}
        className={`border rounded-lg p-4 mb-3 transition-colors ${
          isSupported 
            ? 'bg-white hover:bg-gray-50' 
            : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {!isSupported && (
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            )}
            <Icon className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-sm">{block.title}</span>
            {!isSupported && (
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                Not supported in {currentTemplate?.displayName || 'current theme'}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editBlock(block)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteBlock(block.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded">
          {block.content.split('\n').slice(0, 3).map((line: string, i: number) => (
            <div key={i}>{line}</div>
          ))}
          {block.content.split('\n').length > 3 && <div>...</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Tabs value={mode} onValueChange={(value) => handleModeSwitch(value as 'blocks' | 'text')} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
          <TabsTrigger value="blocks">Block Mode</TabsTrigger>
          <TabsTrigger value="text">Text Mode</TabsTrigger>
        </TabsList>
        
        {/* Warning banner for unsupported blocks */}
        {currentTemplate && blocks.some(block => !isBlockSupported(block.type)) && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Theme Compatibility Warning:</strong> Some blocks use functions not supported by "{currentTemplate.displayName}". 
                  These blocks are highlighted in yellow and may not render correctly.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <TabsContent value="blocks" className="flex-1 flex flex-col mt-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2">
            <Accordion type="multiple" defaultValue={["personal-info"]} className="w-full">
              {resumeSections.map((section) => {
                const SectionIcon = section.icon
                const sectionBlocks = blocksBySection[section.id] || []
                
                return (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <SectionIcon className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs text-gray-500">
                            {section.required ? 'Required' : 'Optional'} • 
                            {section.allowMultiple ? 'Multiple items allowed' : 'Single item only'}
                          </div>
                        </div>
                        <div className="ml-auto mr-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {sectionBlocks.length} {sectionBlocks.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        {/* Add Block Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {section.blockTypes.map((blockType) => {
                            const blockDef = blockTypeDefinitions[blockType as keyof typeof blockTypeDefinitions]
                            if (!blockDef) return null
                            
                            const Icon = blockDef.icon
                            const canAdd = section.allowMultiple || sectionBlocks.length === 0
                            const isSupported = isBlockSupported(blockType)
                            
                            // Only show function warnings, not section limit warnings
                            const showFunctionWarning = !isSupported
                            
                            return (
                              <div key={blockType} className="relative">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addBlock(section.id, blockType)}
                                  disabled={!canAdd}
                                  className={`flex items-center gap-2 ${
                                    showFunctionWarning ? 'border-yellow-300 bg-yellow-50 text-yellow-800' : ''
                                  }`}
                                  title={showFunctionWarning ? `This function is not supported in ${currentTemplate?.displayName || 'current theme'}` : 
                                         !canAdd ? `Only one ${section.title.toLowerCase()} block allowed` : ''}
                                >
                                  <Plus className="w-4 h-4" />
                                  {showFunctionWarning && <AlertTriangle className="w-3 h-3" />}
                                  <Icon className="w-4 h-4" />
                                  {blockDef.label.split(' ')[0]}
                                </Button>
                                {showFunctionWarning && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        
                        {/* Section Blocks */}
                        <div className="space-y-2">
                          {sectionBlocks.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                              <SectionIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">No {section.title.toLowerCase()} added yet</p>
                              <p className="text-xs text-gray-400">Click the buttons above to add content</p>
                            </div>
                          ) : (
                            sectionBlocks
                              .sort((a, b) => a.order - b.order)
                              .map((block) => renderBlockContent(block))
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>

          {/* Edit Dialog */}
          <Dialog 
            open={isDialogOpen} 
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) {
                setEditingBlock(null)
              }
            }}
          >
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Block</DialogTitle>
              </DialogHeader>
              
              {editingBlock && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Block Title</label>
                    <input
                      type="text"
                      value={editingBlock.title}
                      onChange={(e) => setEditingBlock({
                        ...editingBlock,
                        title: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      value={editingBlock.content}
                      onChange={(e) => setEditingBlock({
                        ...editingBlock,
                        content: e.target.value
                      })}
                      className="mt-1 font-mono text-sm min-h-[200px]"
                      placeholder="Enter the Typst code for this block..."
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveBlock}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="text" className="flex-1 mt-4 overflow-hidden">
          <Textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="h-full w-full font-mono text-sm resize-none"
            placeholder="Enter your Typst resume content here..."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
