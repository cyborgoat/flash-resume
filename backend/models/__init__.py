# Pydantic models for the Flash Resume API

from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class PersonalInfo(BaseModel):
    firstname: str
    lastname: str
    email: str
    homepage: Optional[str] = None
    phone: Optional[str] = None
    github: Optional[str] = None
    twitter: Optional[str] = None
    scholar: Optional[str] = None
    orcid: Optional[str] = None
    birth: Optional[str] = None
    linkedin: Optional[str] = None
    address: Optional[str] = None
    positions: Optional[List[str]] = None

class ResumeSectionItem(BaseModel):
    type: str
    data: Dict[str, Any]

class ResumeSection(BaseModel):
    type: str
    title: str
    items: List[ResumeSectionItem]

class ResumeData(BaseModel):
    personalInfo: PersonalInfo
    sections: List[ResumeSection]
    theme: str

class TemplateStyle(BaseModel):
    primary_font: str = "New Computer Modern"
    header_font: str = "New Computer Modern"
    font_size: str = "10pt"
    header_font_size: str = "20pt"
    accent_color: str = "#000000"
    text_color: str = "#000000"
    link_color: str = "#000000"
    header_color: str = "#000000"
    paper_size: str = "us-letter"
    margins: str = "0.5in"
    line_spacing: str = "0.5em"

class TemplateFormatting(BaseModel):
    show_section_lines: bool = True
    section_spacing: str = "0.4em"
    entry_spacing: str = "0.25em"
    author_position: str = "left"
    contact_position: str = "left"
    contact_separator: str = "  |  "

class TemplateFeatures(BaseModel):
    colored_headers: bool = False
    show_footer: bool = False
    show_icons: bool = True
    profile_picture: bool = False
    show_date: bool = False
    date_format: str = "[month repr:long] [day], [year]"

class TemplateAdvanced(BaseModel):
    disable_ligatures: bool = True
    justify_text: bool = False
    hyphenation: bool = False

class TemplateConfig(BaseModel):
    name: str
    displayName: str
    description: str
    mainFile: str = "main.typ"
    coreFunctions: Optional[List[str]] = None
    functions: List[str]
    style: TemplateStyle
    formatting: TemplateFormatting
    features: TemplateFeatures
    advanced: TemplateAdvanced
