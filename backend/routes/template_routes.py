# API routes for template management

from fastapi import APIRouter, HTTPException, Form
from typing import List, Dict, Any

from services.template_service import TemplateService
from services.typst_compiler import TypstCompiler
from models import ResumeData

def create_template_router(template_service: TemplateService, typst_compiler: TypstCompiler) -> APIRouter:
    router = APIRouter(prefix="/templates", tags=["templates"])
    
    @router.get("/")
    async def get_all_templates():
        """Get list of all available templates with their configurations."""
        templates = template_service.get_all_templates()
        return {"templates": templates}
    
    @router.get("/{template_name}")
    async def get_template_info(template_name: str):
        """Get complete information about a specific template."""
        config = template_service.get_template_config(template_name)
        return {"template": config}
    
    @router.get("/{template_name}/functions")
    async def get_template_functions(template_name: str):
        """Get available functions for a specific template."""
        functions = template_service.get_template_functions(template_name)
        return {"template": template_name, "functions": functions}
    
    @router.get("/{template_name}/content")
    async def get_template_content(template_name: str):
        """Get the default content for a specific template."""
        config = template_service.get_template_config(template_name)
        content = template_service.get_template_content(template_name)
        return {
            "content": content,
            "template": template_name,
            "mainFile": config.mainFile,
            "config": config
        }
    
    @router.post("/{template_name}/compile")
    async def compile_template(template_name: str, content: str = Form(...)):
        """Compile a specific template with custom content."""
        config = template_service.get_template_config(template_name)
        return typst_compiler.compile_template(template_name, content, config)
    
    @router.post("/{template_name}/compile-json")
    async def compile_json_resume(template_name: str, resume_data: ResumeData):
        """Compile a resume from JSON data using the specified template."""
        config = template_service.get_template_config(template_name)
        return typst_compiler.compile_json_resume(template_name, resume_data, config)
    
    @router.put("/{template_name}/config")
    async def update_template_config(template_name: str, updated_config: Dict[str, Any]):
        """Update template configuration (for dynamic styling)."""
        return template_service.update_template_config(template_name, updated_config)
    
    @router.get("/{template_name}/preview")
    async def preview_template(template_name: str):
        """Generate a preview PDF using the template's default content and configuration."""
        config = template_service.get_template_config(template_name)
        content = template_service.get_template_content(template_name)
        return typst_compiler.compile_template(template_name, content, config)
    
    return router
