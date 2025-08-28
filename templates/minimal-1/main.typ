// ==============================================================================
// MINIMAL-1 RESUME GENERATOR
// ==============================================================================

#import "src/resume.typ": *

// ==============================================================================
// PERSONAL INFORMATION
// ==============================================================================
// Put your personal information here, replacing the example data
#let author-info = (
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
  positions: (
    "Senior ML Engineer",
    "Research Scientist", 
    "AI Solutions Architect",
  ),
)

// ==============================================================================
// APPLY THEME WITH DATA
// ==============================================================================
#show: resume.with(author-info)

// ==============================================================================
// AVAILABLE FUNCTIONS
// ==============================================================================
/*
* Lines that start with = are formatted into section headings
* Available formatting functions:
* #education(school: "", degree: "", date: "", location: "", gpa: "", honors: "", courses: "")
* #experience(company: "", position: "", date: "", location: "", description: [])
* #project(name: "", date: "", description: [], link: "")
* #extracurriculars(organization: "", role: "", date: "", description: [])
* #skill(category: "", skills: "")
* #entry(title: "", location: "", date: "", description: "", title-link: "")
* #item[content] - for bullet points or descriptions
* #gpa(numerator, denominator) - for showing GPA
* #certification(certification: "", date: "")
* #skill-item(category: "", items: ())
*/

// ==============================================================================
// RESUME CONTENT
// ==============================================================================

= Education

#education(
  school: "Stanford University",
  degree: "M.S. in Computer Science (Machine Learning)",
  date: "August 2015 - May 2017",
  location: "Stanford, CA",
  gpa: "3.9/4.0",
  honors: "Graduated Summa Cum Laude",
  courses: "Deep Learning, Reinforcement Learning, Computer Vision, Natural Language Processing",
)

#item[
  - Thesis: "Scalable Federated Learning for Edge Computing" (Advisor: Prof. Andrew Ng)
  - Teaching Assistant for CS229 (Machine Learning) and CS231n (Convolutional Neural Networks)
]

= Experience

#experience(
  company: "TechCorp Industries",
  position: "Senior Machine Learning Engineer",
  date: "2021 - Present",
  location: "San Francisco, CA",
  description: [
    - Architected and deployed scalable ML pipelines processing 10M+ daily transactions with 99.9% uptime
    - Led cross-functional team of 8 engineers to develop real-time recommendation system, increasing user engagement by 35%
    - Implemented MLOps practices reducing model deployment time from weeks to hours using Kubernetes and Docker
  ],
)

= Skills

#skill(
  category: "Programming Languages",
  skills: "Python, C++, JavaScript, Go, Rust, Java, R, CUDA",
)

#skill(
  category: "Machine Learning", 
  skills: "PyTorch, TensorFlow, Scikit-learn, XGBoost, Hugging Face, MLflow, Ray, Optuna"
)
