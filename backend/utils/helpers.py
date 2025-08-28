# Utility functions for the Flash Resume backend

import subprocess
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def check_typst_availability() -> tuple[bool, str]:
    """Check if Typst is available and return version info."""
    try:
        result = subprocess.run(["typst", "--version"], capture_output=True, text=True)
        typst_version = result.stdout.strip() if result.returncode == 0 else "unknown"
        return result.returncode == 0, typst_version
    except Exception as e:
        logger.error(f"Error checking Typst availability: {e}")
        return False, str(e)

def setup_logging():
    """Setup logging configuration."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

def validate_template_structure(template_dir: Path) -> bool:
    """Validate that a template directory has the required structure."""
    required_files = ["conf.json"]
    
    for file_name in required_files:
        if not (template_dir / file_name).exists():
            logger.warning(f"Template {template_dir.name} missing required file: {file_name}")
            return False
    
    return True
