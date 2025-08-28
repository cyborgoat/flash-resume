# Typst compilation service

import subprocess
import shutil
import logging
from pathlib import Path
from typing import Dict, Any
from fastapi import HTTPException
from fastapi.responses import Response

from models import ResumeData, TemplateConfig

logger = logging.getLogger(__name__)

class TypstCompiler:
    def __init__(self, templates_dir: Path):
        self.templates_dir = templates_dir
    
    def compile_template(self, template_name: str, content: str, config: TemplateConfig) -> Response:
        """Compile a template with custom content."""
        template_dir = self.templates_dir / template_name
        
        # File paths
        temp_main = template_dir / f"temp_{config.mainFile}"
        original_main = template_dir / config.mainFile
        backup_main = template_dir / f"{config.mainFile}.backup"
        output_file = template_dir / "output.pdf"
        
        try:
            # Backup original if it exists
            if original_main.exists():
                shutil.copy2(original_main, backup_main)
            
            # Write user content
            temp_main.write_text(content)
            
            # Compile
            cmd = ["typst", "compile", f"temp_{config.mainFile}", "output.pdf"]
            logger.info(f"Compiling template {template_name}: {' '.join(cmd)}")
            
            result = subprocess.run(
                cmd,
                cwd=template_dir,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode != 0:
                logger.error(f"Template compilation failed: {result.stderr}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Template compilation failed: {result.stderr}"
                )
            
            if not output_file.exists():
                raise HTTPException(
                    status_code=500,
                    detail="PDF output file was not created"
                )
            
            # Read PDF content
            pdf_content = output_file.read_bytes()
            logger.info(f"Successfully compiled template {template_name}, size: {len(pdf_content)} bytes")
            
            return Response(
                content=pdf_content,
                media_type="application/pdf",
                headers={"Content-Disposition": f"inline; filename={template_name}-resume.pdf"}
            )
            
        finally:
            # Cleanup
            for cleanup_file in [temp_main, output_file]:
                try:
                    if cleanup_file.exists():
                        cleanup_file.unlink()
                except Exception:
                    pass
            
            # Restore backup if it exists
            if backup_main.exists():
                if original_main.exists():
                    original_main.unlink()
                shutil.move(backup_main, original_main)
    
    def compile_json_resume(self, template_name: str, resume_data: ResumeData, config: TemplateConfig) -> Response:
        """Compile a resume from JSON data."""
        # Convert JSON to Typst content with template styling
        typst_content = self.convert_to_typst(resume_data, config)
        return self.compile_template(template_name, typst_content, config)
    
    def convert_to_typst(self, resume_data: ResumeData, config: TemplateConfig) -> str:
        """Convert JSON resume data to Typst template format with styling."""
        typst_content = f"""// ==============================================================================
// RESUME GENERATOR - AUTO-GENERATED FROM JSON
// Template: {config.displayName}
// Configuration loaded from: conf.json
// ==============================================================================

#import "src/resume.typ": *

// ==============================================================================
// PERSONAL INFORMATION
// ==============================================================================
#let author-info = (
  firstname: "{resume_data.personalInfo.firstname}",
  lastname: "{resume_data.personalInfo.lastname}",
  email: "{resume_data.personalInfo.email}","""

        # Add optional personal info fields
        for field, value in resume_data.personalInfo.dict().items():
            if field not in ['firstname', 'lastname', 'email'] and value is not None:
                if isinstance(value, list):
                    value_str = ", ".join(f'"{v}"' for v in value)
                    typst_content += f'\n  {field}: ({value_str}),'
                else:
                    typst_content += f'\n  {field}: "{value}",'

        typst_content += """
)

// ==============================================================================
// APPLY THEME WITH DATA
// Configuration is automatically loaded from conf.json by the template
// ==============================================================================
#show: resume.with(author-info)

// ==============================================================================
// RESUME CONTENT
// ==============================================================================

"""

        # Generate sections
        for section in resume_data.sections:
            typst_content += f"= {section.title}\\n\\n"
            
            for item in section.items:
                typst_content += self.generate_typst_function(item.type, item.data)
            
            typst_content += '\\n'

        return typst_content
    
    def generate_typst_function(self, func_type: str, data: Dict[str, Any]) -> str:
        """Generate a Typst function call from type and data."""
        function_call = f"#{func_type}(\\n"
        
        for key, value in data.items():
            if isinstance(value, list):
                if value and isinstance(value[0], str):
                    # String array - format as Typst list for descriptions
                    function_call += f"  {key}: [\\n"
                    for item in value:
                        function_call += f"    - {item}\\n"
                    function_call += "  ],\\n"
                else:
                    # Other arrays
                    value_str = ", ".join(f'"{v}"' for v in value)
                    function_call += f'  {key}: ({value_str}),\\n'
            else:
                function_call += f'  {key}: "{value}",\\n'
        
        function_call += ')\\n\\n'
        return function_call
