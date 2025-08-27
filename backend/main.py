from fastapi import FastAPI, HTTPException, Form
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import shutil
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Flash Resume - Typst Compiler API", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Template directory path
TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

@app.get("/")
async def root():
    return {"message": "Flash Resume Typst Compiler API", "status": "running"}

@app.post("/compile")
async def compile_typst(content: str = Form(...)):
    """
    Compile custom Typst content to PDF.
    Uses the same approach as the working direct method but with user content.
    """
    try:
        # Save user content to a temporary file in the templates directory
        temp_main = TEMPLATES_DIR / "temp_main.typ"
        original_main = TEMPLATES_DIR / "main.typ"
        backup_main = TEMPLATES_DIR / "main.typ.backup"
        output_file = TEMPLATES_DIR / "temp_output.pdf"
        
        try:
            # Backup original main.typ
            if original_main.exists():
                shutil.copy2(original_main, backup_main)
            
            # Write user content to temp_main.typ
            temp_main.write_text(content)
            logger.info("Created temporary main file with user content")
            
            # Run Typst compilation directly from templates directory
            cmd = [
                "typst",
                "compile",
                "temp_main.typ",  # Use the temporary file
                "temp_output.pdf"
            ]
            
            logger.info(f"Running custom compilation: {' '.join(cmd)}")
            logger.info(f"Working directory: {TEMPLATES_DIR}")
            
            result = subprocess.run(
                cmd,
                cwd=TEMPLATES_DIR,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode != 0:
                logger.error(f"Custom compilation failed: {result.stderr}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Typst compilation failed: {result.stderr}"
                )
            
            # Check if output file was created
            if not output_file.exists():
                raise HTTPException(
                    status_code=500,
                    detail="PDF output file was not created"
                )
            
            # Read the PDF content
            pdf_content = output_file.read_bytes()
            logger.info(f"Successfully compiled custom PDF, size: {len(pdf_content)} bytes")
            
            # Return PDF as binary response
            return Response(
                content=pdf_content,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": "inline; filename=resume.pdf"
                }
            )
            
        finally:
            # Cleanup: remove temporary files
            try:
                if temp_main.exists():
                    temp_main.unlink()
                if output_file.exists():
                    output_file.unlink()
                if backup_main.exists():
                    backup_main.unlink()
            except Exception as cleanup_error:
                logger.warning(f"Cleanup error: {cleanup_error}")
            
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Compilation timeout")
    except Exception as e:
        logger.error(f"Unexpected error in custom compilation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



@app.get("/template-content")
async def get_template_content():
    """Get the current template content for editing."""
    try:
        main_template = TEMPLATES_DIR / "main.typ"
        if not main_template.exists():
            raise HTTPException(status_code=404, detail="Template main.typ not found")
        
        content = main_template.read_text()
        return {"content": content}
        
    except Exception as e:
        logger.error(f"Error reading template: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error reading template: {str(e)}")

@app.get("/config")
async def get_config():
    """Get the current configuration."""
    try:
        config_file = TEMPLATES_DIR / "config.toml"
        if not config_file.exists():
            raise HTTPException(status_code=404, detail="Configuration file not found")
        
        content = config_file.read_text()
        return {"content": content}
        
    except Exception as e:
        logger.error(f"Error reading config: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error reading config: {str(e)}")

@app.post("/update-config")
async def update_config(content: str = Form(...)):
    """Update the configuration file."""
    try:
        config_file = TEMPLATES_DIR / "config.toml"
        config_file.write_text(content)
        logger.info("Configuration updated successfully")
        return {"message": "Configuration updated successfully"}
        
    except Exception as e:
        logger.error(f"Error updating config: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating config: {str(e)}")

@app.post("/compile-template-direct")
async def compile_template_direct():
    """
    Compile the default template directly from the templates directory.
    """
    try:
        main_template = TEMPLATES_DIR / "main.typ"
        if not main_template.exists():
            raise HTTPException(status_code=404, detail="Template main.typ not found")
        
        logger.info("Compiling template directly from templates directory")
        
        # Run Typst compilation directly from templates directory
        output_file = TEMPLATES_DIR / "api_output.pdf"
        
        cmd = [
            "typst",
            "compile", 
            "main.typ",
            "api_output.pdf"
        ]
        
        logger.info(f"Running direct compilation: {' '.join(cmd)}")
        logger.info(f"Working directory: {TEMPLATES_DIR}")
        
        result = subprocess.run(
            cmd,
            cwd=TEMPLATES_DIR,  # Work directly from templates directory
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            logger.error(f"Direct compilation failed: {result.stderr}")
            logger.error(f"Compilation stdout: {result.stdout}")
            raise HTTPException(
                status_code=400,
                detail=f"Typst compilation failed: {result.stderr}"
            )
        
        # Check if output file was created
        if not output_file.exists():
            logger.error(f"Output file not found at: {output_file}")
            raise HTTPException(
                status_code=500,
                detail="PDF output file was not created"
            )
        
        # Read the PDF content
        pdf_content = output_file.read_bytes()
        logger.info(f"Successfully compiled direct PDF, size: {len(pdf_content)} bytes")
        
        # Clean up the output file
        try:
            output_file.unlink()
        except Exception:
            pass  # Ignore cleanup errors
        
        # Return PDF as binary response
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "inline; filename=resume.pdf"
            }
        )
        
    except Exception as e:
        logger.error(f"Error in direct compilation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Direct compilation error: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test if typst is available
        result = subprocess.run(["typst", "--version"], capture_output=True, text=True)
        typst_version = result.stdout.strip() if result.returncode == 0 else "unknown"
        
        return {
            "status": "healthy",
            "typst_available": result.returncode == 0,
            "typst_version": typst_version,
            "templates_dir": str(TEMPLATES_DIR),
            "templates_exist": TEMPLATES_DIR.exists()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
