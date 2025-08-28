# Flash Resume - Modular Typst Compiler API
# Refactored for better maintainability and separation of concerns

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from services.template_service import TemplateService
from services.typst_compiler import TypstCompiler
from routes.template_routes import create_template_router
from routes.legacy_routes import create_legacy_router
from utils.helpers import setup_logging

# Setup logging
setup_logging()

# Initialize FastAPI app
app = FastAPI(
    title="Flash Resume - Typst Compiler API", 
    version="2.0.0",
    description="Modular resume generation API with template support"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
TEMPLATES_DIR = Path(__file__).parent.parent / "templates"
template_service = TemplateService(TEMPLATES_DIR)
typst_compiler = TypstCompiler(TEMPLATES_DIR)

# Include routers
app.include_router(create_template_router(template_service, typst_compiler))
app.include_router(create_legacy_router(template_service, typst_compiler, TEMPLATES_DIR))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
