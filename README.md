# Flash Resume

A modern, web-based resume builder powered by Typst that allows users to create professional resumes with real-time preview and multiple theme support.

## ✨ Features

- **🎨 Multiple Themes**: Switch between different resume templates with distinct styles
- **📝 Block-Based Editor**: Visual editor with drag-and-drop blocks for different resume sections
- **⚡ Real-time Compilation**: Instant PDF generation with live preview
- **🔧 Template Configuration**: Per-template function availability and styling options
- **⚠️ Smart Warnings**: Visual indicators for unsupported functions in different themes
- **💾 Content Persistence**: Your content is preserved when switching between themes
- **🌐 Modern Web UI**: Clean, responsive interface built with React and TypeScript

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Block Editor**: Visual resume editing with predefined content blocks
- **Theme Selector**: Dynamic theme switching with descriptions from backend
- **Real-time Preview**: PDF preview with compilation status
- **Warning System**: Visual feedback for theme compatibility

### Backend (FastAPI + Python)
- **Template Management**: Per-template configuration and compilation
- **Typst Integration**: Server-side PDF generation using Typst
- **RESTful API**: Clean endpoints for template management and compilation

### Templates (Typst)
- **Modular Design**: Each template has its own configuration and styling
- **JSON Configuration**: Declarative template settings and function availability
- **Function Library**: Reusable Typst functions for different resume sections

## 📁 Project Structure

```
flash-resume/
├── backend/                    # FastAPI backend service
│   ├── main.py                # Application entry point
│   ├── models/                # Pydantic data models
│   ├── routes/                # API route handlers
│   ├── services/              # Business logic (template, compiler)
│   └── utils/                 # Helper functions
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── BlockEditor.tsx    # Visual resume editor
│   │   │   ├── TypstPreview.tsx   # PDF preview component
│   │   │   └── ui/            # Reusable UI components
│   │   └── lib/               # Utilities and API service
│   └── package.json
└── templates/                 # Typst resume templates
    ├── minimal-1/             # Classic professional theme
    │   ├── conf.json          # Template configuration
    │   ├── main.typ           # Template entry point
    │   └── src/               # Template source files
    ├── minimal-2/             # Modern enhanced theme
    └── presets/               # Theme presets and configurations
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.9 or higher)
- **uv** (Python package manager)
- **Typst** (for PDF compilation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cyborgoat/flash-resume.git
   cd flash-resume
   ```

2. **Setup Backend**
   ```bash
   cd backend
   # Create virtual environment and install dependencies
   uv sync
   # Activate virtual environment
   source .venv/bin/activate
   # Start the backend server
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   # Install dependencies
   npm install
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🎯 Usage

### Creating a Resume

1. **Start with Personal Information**
   - Fill in your basic contact details and positions
   - This section is always available across all themes

2. **Add Content Blocks**
   - Use the Block Editor to add sections like Education, Experience, Projects
   - Each template supports different functions - warnings will appear for unsupported ones

3. **Switch Themes**
   - Use the theme selector in the navbar to preview different styles
   - Your content persists when switching themes
   - Unsupported functions are highlighted with warnings

4. **Compile and Download**
   - Click "Compile" to generate PDF
   - Use "Export" to download your resume

### Available Block Types

- **Personal Information**: Contact details and basic info (always available)
- **Education**: Schools, degrees, GPA, honors
- **Experience**: Work history with descriptions
- **Projects**: Personal and professional projects
- **Skills**: Technical and professional skills
- **Certifications**: Professional certifications and awards
- **Extracurriculars**: Activities and organizations (theme-dependent)

## 🎨 Template System

### Template Configuration

Each template includes a `conf.json` file that defines:

```json
{
  "name": "minimal-1",
  "displayName": "Minimal Classic",
  "description": "Clean and professional layout with traditional formatting",
  "coreFunctions": ["personal-info"],
  "functions": ["education", "experience", "project", "skill", ...],
  "style": { "primary_font": "New Computer Modern", ... },
  "formatting": { "show_section_lines": true, ... },
  "features": { "colored_headers": false, ... }
}
```

### Adding New Templates

1. Create a new directory in `templates/`
2. Add `conf.json` with template configuration
3. Create `main.typ` as the template entry point
4. Implement template functions in `src/resume.typ`
5. The template will automatically appear in the theme selector

## 🔧 API Endpoints

### Template Management
- `GET /templates/` - List all available templates
- `GET /templates/{name}` - Get specific template configuration
- `POST /templates/{name}/compile` - Compile resume with template

### Content Management
- `POST /templates/{name}/compile-json` - Compile with JSON data
- `PUT /templates/{name}/config` - Update template configuration
- `GET /templates/{name}/preview` - Generate preview

## 🎨 Theming

### Current Themes

**Minimal Classic (minimal-1)**
- Professional, traditional layout
- New Computer Modern font
- Clean typography with clear sections
- Supports all standard resume functions

**Minimal Modern (minimal-2)**
- Contemporary design with enhanced typography
- Arial font family
- Colored headers and modern spacing
- Enhanced visual hierarchy

### Theme Differences

Templates can have different supported functions:
- All themes support core functions (personal-info)
- Optional functions vary by theme (e.g., extracurriculars)
- The UI provides warnings for unsupported functions

## 🛠️ Development

### Backend Development

```bash
cd backend
source .venv/bin/activate
# Install additional dependencies
uv add package-name
# Run with auto-reload
uvicorn main:app --reload
```

### Frontend Development

```bash
cd frontend
# Install new dependencies
npm install package-name
# Run development server
npm run dev
# Build for production
npm run build
```

### Adding Features

1. **New Block Types**: Update `blockTypeDefinitions` in `BlockEditor.tsx`
2. **Template Functions**: Add function implementations in template `src/resume.typ`
3. **API Endpoints**: Add routes in `backend/routes/`
4. **UI Components**: Create components in `frontend/src/components/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Typst**: Modern typesetting system powering PDF generation
- **FastAPI**: High-performance web framework for the backend
- **React**: Frontend library for building the user interface
- **Vite**: Fast build tool for frontend development

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the API documentation at `/docs`
- Review the template configurations in `templates/*/conf.json`

---

Made with ❤️ using Typst, React, and FastAPI
