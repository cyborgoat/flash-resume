# Template management service

import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import HTTPException

from models import TemplateConfig

logger = logging.getLogger(__name__)

class TemplateService:
    def __init__(self, templates_dir: Path):
        self.templates_dir = templates_dir
    
    def get_all_templates(self) -> List[Dict[str, Any]]:
        """Get list of all available templates with their configurations."""
        templates = []
        
        for template_dir in self.templates_dir.iterdir():
            if template_dir.is_dir() and not template_dir.name.startswith('.'):
                conf_file = template_dir / "conf.json"
                
                if conf_file.exists():
                    try:
                        conf_data = json.loads(conf_file.read_text())
                        templates.append({
                            "name": template_dir.name,
                            "config": conf_data
                        })
                    except json.JSONDecodeError as e:
                        logger.warning(f"Invalid JSON in {conf_file}: {e}")
                        templates.append({
                            "name": template_dir.name,
                            "config": {"functions": [], "error": "Invalid configuration"}
                        })
                else:
                    templates.append({
                        "name": template_dir.name,
                        "config": {"functions": []}
                    })
        
        return templates
    
    def get_template_config(self, template_name: str) -> TemplateConfig:
        """Get configuration for a specific template."""
        template_dir = self.templates_dir / template_name
        
        if not template_dir.exists() or not template_dir.is_dir():
            raise HTTPException(status_code=404, detail=f"Template '{template_name}' not found")
        
        conf_file = template_dir / "conf.json"
        
        if not conf_file.exists():
            raise HTTPException(status_code=404, detail=f"Configuration file not found for template '{template_name}'")
        
        try:
            conf_data = json.loads(conf_file.read_text())
            return TemplateConfig(**conf_data)
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in {conf_file}: {e}")
            raise HTTPException(status_code=500, detail=f"Invalid configuration file for template '{template_name}'")
        except Exception as e:
            logger.error(f"Error loading template config: {e}")
            raise HTTPException(status_code=500, detail=f"Error loading template configuration: {str(e)}")
    
    def get_template_functions(self, template_name: str) -> List[str]:
        """Get available functions for a specific template."""
        config = self.get_template_config(template_name)
        return config.functions
    
    def get_template_content(self, template_name: str) -> str:
        """Get the default content for a specific template."""
        config = self.get_template_config(template_name)
        template_dir = self.templates_dir / template_name
        main_path = template_dir / config.mainFile
        
        if not main_path.exists():
            raise HTTPException(
                status_code=404, 
                detail=f"Main file '{config.mainFile}' not found in template '{template_name}'"
            )
        
        return main_path.read_text()
    
    def template_exists(self, template_name: str) -> bool:
        """Check if a template exists."""
        template_dir = self.templates_dir / template_name
        return template_dir.exists() and template_dir.is_dir()
    
    def get_template_directory(self, template_name: str) -> Path:
        """Get the directory path for a template."""
        if not self.template_exists(template_name):
            raise HTTPException(status_code=404, detail=f"Template '{template_name}' not found")
        return self.templates_dir / template_name
    
    def update_template_config(self, template_name: str, updated_config: Dict[str, Any]) -> Dict[str, Any]:
        """Update template configuration (for dynamic styling)."""
        template_dir = self.templates_dir / template_name
        
        if not template_dir.exists() or not template_dir.is_dir():
            raise HTTPException(status_code=404, detail=f"Template '{template_name}' not found")
        
        conf_file = template_dir / "conf.json"
        
        if not conf_file.exists():
            raise HTTPException(status_code=404, detail=f"Configuration file not found for template '{template_name}'")
        
        try:
            # Read current config
            current_config = json.loads(conf_file.read_text())
            
            # Update with new values (deep merge)
            def deep_update(base_dict, update_dict):
                for key, value in update_dict.items():
                    if key in base_dict and isinstance(base_dict[key], dict) and isinstance(value, dict):
                        deep_update(base_dict[key], value)
                    else:
                        base_dict[key] = value
            
            deep_update(current_config, updated_config)
            
            # Write back to file
            conf_file.write_text(json.dumps(current_config, indent=2))
            
            return {"message": f"Template '{template_name}' configuration updated successfully", "config": current_config}
            
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in {conf_file}: {e}")
            raise HTTPException(status_code=500, detail=f"Invalid configuration file for template '{template_name}'")
        except Exception as e:
            logger.error(f"Error updating template config: {e}")
            raise HTTPException(status_code=500, detail=f"Error updating template configuration: {str(e)}")
