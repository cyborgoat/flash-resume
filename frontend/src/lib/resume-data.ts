// JSON-based Resume Configuration System
// This converts the Typst template syntax into a JSON structure that can be easily
// managed by the frontend and converted back to Typst for compilation

export interface ResumeData {
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  theme: string;
}

export interface PersonalInfo {
  firstname: string;
  lastname: string;
  email: string;
  homepage?: string;
  phone?: string;
  github?: string;
  twitter?: string;
  scholar?: string;
  orcid?: string;
  birth?: string;
  linkedin?: string;
  address?: string;
  positions?: string[];
}

export interface ResumeSection {
  type: 'education' | 'experience' | 'project' | 'skills' | 'publications' | 'certifications' | 'custom';
  title: string;
  items: ResumeSectionItem[];
}

export interface ResumeSectionItem {
  type: string; // The function name (education, experience, etc.)
  data: Record<string, any>; // The parameters for that function
}

// Template configuration interfaces (matching backend models)
export interface TemplateStyle {
  primary_font: string;
  header_font: string;
  font_size: string;
  header_font_size: string;
  accent_color: string;
  text_color: string;
  link_color: string;
  header_color: string;
  paper_size: string;
  margins: string;
  line_spacing: string;
}

export interface TemplateFormatting {
  show_section_lines: boolean;
  section_spacing: string;
  entry_spacing: string;
  author_position: string;
  contact_position: string;
  contact_separator: string;
}

export interface TemplateFeatures {
  colored_headers: boolean;
  show_footer: boolean;
  show_icons: boolean;
  profile_picture: boolean;
  show_date: boolean;
  date_format: string;
}

export interface TemplateAdvanced {
  disable_ligatures: boolean;
  justify_text: boolean;
  hyphenation: boolean;
}

export interface TemplateConfig {
  name: string;
  displayName: string;
  description: string;
  mainFile: string;
  coreFunctions?: string[];
  functions: string[];
  style: TemplateStyle;
  formatting: TemplateFormatting;
  features: TemplateFeatures;
  advanced: TemplateAdvanced;
}

export interface TemplateInfo {
  name: string;
  config: TemplateConfig;
}

// API service functions
export class ResumeApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async getTemplates(): Promise<TemplateInfo[]> {
    const response = await fetch(`${this.baseUrl}/templates/`);
    const data = await response.json();
    return data.templates;
  }

  async getTemplate(templateName: string): Promise<TemplateConfig> {
    const response = await fetch(`${this.baseUrl}/templates/${templateName}`);
    const data = await response.json();
    return data.template;
  }

  async getTemplateFunctions(templateName: string): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/templates/${templateName}/functions`);
    const data = await response.json();
    return data.functions;
  }

  async compileResumeFromJson(templateName: string, resumeData: ResumeData): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/templates/${templateName}/compile-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });

    if (!response.ok) {
      throw new Error(`Compilation failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async compileResumeFromTypst(templateName: string, typstContent: string): Promise<Blob> {
    const formData = new FormData();
    formData.append('content', typstContent);

    const response = await fetch(`${this.baseUrl}/templates/${templateName}/compile`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Compilation failed: ${response.statusText}`);
    }

    return response.blob();
  }
}

// Example ResumeData structure:
export const sampleResumeData: ResumeData = {
  personalInfo: {
    firstname: "Dr. Alex",
    lastname: "Johnson",
    email: "alex.johnson@techcorp.com",
    homepage: "https://alexjohnson.tech",
    phone: "(+1) 555-123-4567",
    github: "alexjohnson-ml",
    twitter: "alexjohnsontech",
    scholar: "alex-johnson",
    orcid: "0000-0002-1234-5678",
    birth: "March 15, 1988",
    linkedin: "alexjohnsontech",
    address: "456 Innovation Drive, San Francisco, CA 94105",
    positions: [
      "Senior ML Engineer",
      "Research Scientist", 
      "AI Solutions Architect"
    ]
  },
  theme: "minimal-1",
  sections: [
    {
      type: 'education',
      title: 'Education',
      items: [
        {
          type: 'education',
          data: {
            school: "Stanford University",
            degree: "M.S. in Computer Science (Machine Learning)",
            date: "August 2015 - May 2017",
            location: "Stanford, CA",
            gpa: "3.9/4.0",
            honors: "Graduated Summa Cum Laude",
            courses: "Deep Learning, Reinforcement Learning, Computer Vision, Natural Language Processing"
          }
        }
      ]
    },
    {
      type: 'experience',
      title: 'Experience',
      items: [
        {
          type: 'experience',
          data: {
            company: "TechCorp Industries",
            position: "Senior Machine Learning Engineer",
            date: "2021 - Present",
            location: "San Francisco, CA",
            description: [
              "Architected and deployed scalable ML pipelines processing 10M+ daily transactions with 99.9% uptime",
              "Led cross-functional team of 8 engineers to develop real-time recommendation system, increasing user engagement by 35%",
              "Implemented MLOps practices reducing model deployment time from weeks to hours using Kubernetes and Docker"
            ]
          }
        }
      ]
    },
    {
      type: 'skills',
      title: 'Skills',
      items: [
        {
          type: 'skill',
          data: {
            category: "Programming Languages",
            skills: "Python, C++, JavaScript, Go, Rust, Java, R, CUDA"
          }
        },
        {
          type: 'skill',
          data: {
            category: "Machine Learning",
            skills: "PyTorch, TensorFlow, Scikit-learn, XGBoost, Hugging Face, MLflow, Ray, Optuna"
          }
        }
      ]
    }
  ]
};
