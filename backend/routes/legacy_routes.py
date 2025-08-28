# Legacy API routes for backward compatibility

from fastapi import APIRouter, Form
from pathlib import Path

from services.template_service import TemplateService
from services.typst_compiler import TypstCompiler
from utils.helpers import check_typst_availability

def create_legacy_router(template_service: TemplateService, typst_compiler: TypstCompiler, templates_dir: Path) -> APIRouter:
    router = APIRouter(tags=["legacy"])
    
    @router.get("/")
    async def root():
        return {"message": "Flash Resume Typst Compiler API", "status": "running"}
    
    @router.post("/compile")
    async def legacy_compile(content: str = Form(...)):
        """Legacy compile endpoint - uses minimal-1 template by default."""
        config = template_service.get_template_config("minimal-1")
        return typst_compiler.compile_template("minimal-1", content, config)
    
    @router.get("/template-content")
    async def legacy_get_template_content():
        """Legacy endpoint - redirects to template-specific content. Defaults to minimal-1."""
        content = template_service.get_template_content("minimal-1")
        return {"content": content}
    
    @router.get("/editable-content")
    async def get_editable_content():
        """Get only the editable content (personal information onwards) for the editor."""
        try:
            content = template_service.get_template_content("minimal-1")
            
            # Find the start of the PERSONAL INFORMATION section
            start_marker = "// PERSONAL INFORMATION"
            start_index = content.find(start_marker)
            
            if start_index != -1:
                editable_content = content[start_index:]
                return {"content": editable_content}
            else:
                # If marker not found, return full content
                return {"content": content}
                
        except Exception as e:
            return {"content": "// Error loading template content", "error": str(e)}
    
    @router.get("/config")
    async def get_legacy_config():
        """Legacy config endpoint - returns minimal-1 template config in TOML-like format."""
        try:
            config = template_service.get_template_config("minimal-1")
            
            # Convert to TOML-like format for backward compatibility
            toml_content = f"""[theme]
active = "{config.name}"

[style]
primary_font = "{config.style.primary_font}"
header_font = "{config.style.header_font}"
font_size = "{config.style.font_size}"
header_font_size = "{config.style.header_font_size}"
accent_color = "{config.style.accent_color}"
text_color = "{config.style.text_color}"
link_color = "{config.style.link_color}"
header_color = "{config.style.header_color}"
paper_size = "{config.style.paper_size}"
margins = "{config.style.margins}"
line_spacing = "{config.style.line_spacing}"

[formatting]
show_section_lines = {str(config.formatting.show_section_lines).lower()}
section_spacing = "{config.formatting.section_spacing}"
entry_spacing = "{config.formatting.entry_spacing}"
author_position = "{config.formatting.author_position}"
contact_position = "{config.formatting.contact_position}"
contact_separator = "{config.formatting.contact_separator}"

[features]
colored_headers = {str(config.features.colored_headers).lower()}
show_footer = {str(config.features.show_footer).lower()}
show_icons = {str(config.features.show_icons).lower()}
profile_picture = {str(config.features.profile_picture).lower()}
show_date = {str(config.features.show_date).lower()}
date_format = "{config.features.date_format}"

[advanced]
disable_ligatures = "{str(config.advanced.disable_ligatures).lower()}"
justify_text = {str(config.advanced.justify_text).lower()}
hyphenation = {str(config.advanced.hyphenation).lower()}
"""
            
            return {"content": toml_content}
            
        except Exception as e:
            return {"content": "# Error loading config", "error": str(e)}
    
    @router.post("/update-config")
    async def update_legacy_config(content: str = Form(...)):
        """Legacy config update endpoint - currently read-only."""
        return {"message": "Config updates are read-only in the new template system"}
    
    @router.post("/compile-template-direct")
    async def legacy_compile_direct():
        """Legacy direct compilation endpoint."""
        config = template_service.get_template_config("minimal-1")
        content = template_service.get_template_content("minimal-1")
        return typst_compiler.compile_template("minimal-1", content, config)
    
    @router.get("/health")
    async def health_check():
        """Health check endpoint."""
        try:
            typst_available, typst_version = check_typst_availability()
            
            return {
                "status": "healthy" if typst_available else "unhealthy",
                "typst_available": typst_available,
                "typst_version": typst_version,
                "templates_dir": str(templates_dir),
                "templates_exist": templates_dir.exists()
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e)
            }
    
    return router
