// ==============================================================================
// RESUME GENERATOR - CONFIGURATION-DRIVEN
// ==============================================================================
// Theme is now controlled by config.toml file

#import "config-loader.typ": load-config

// Load configuration to determine active theme
#let config = load-config()

// Dynamic theme import based on configuration
#import "minimal-1/src/resume.typ" as minimal1
#import "minimal-2/src/resume.typ" as minimal2

// Select the resume function based on config
#let resume = if config.theme == "minimal-2" {
  minimal2.resume
} else {
  minimal1.resume
}

// Import all other functions from the selected theme
#let education = if config.theme == "minimal-2" { minimal2.education } else { minimal1.education }
#let experience = if config.theme == "minimal-2" { minimal2.experience } else { minimal1.experience }
#let project = if config.theme == "minimal-2" { minimal2.project } else { minimal1.project }
#let extracurriculars = if config.theme == "minimal-2" { minimal2.extracurriculars } else { minimal1.extracurriculars }
#let skill = if config.theme == "minimal-2" { minimal2.skill } else { minimal1.skill }
#let entry = if config.theme == "minimal-2" { minimal2.entry } else { minimal1.entry }
#let item = if config.theme == "minimal-2" { minimal2.item } else { minimal1.item }
#let gpa = if config.theme == "minimal-2" { minimal2.gpa } else { minimal1.gpa }
#let certification = if config.theme == "minimal-2" { minimal2.certification } else { minimal1.certification }
#let skill-item = if config.theme == "minimal-2" { minimal2.skill-item } else { minimal1.skill-item }

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
* Available formatting functions (work with both themes):
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

#education(
  school: "Massachusetts Institute of Technology",
  degree: "B.S. in Electrical Engineering and Computer Science", 
  date: "August 2011 - May 2015",
  location: "Cambridge, MA",
  gpa: "3.8/4.0",
  honors: "Dean's List (2012-2015), Phi Beta Kappa Honor Society",
  courses: "Algorithms, Artificial Intelligence, Signal Processing, Linear Algebra",
)

#item[
  - Senior Thesis: "Real-time Object Detection for Autonomous Vehicles"
  - President of MIT AI/ML Club • Organized annual hackathon with 500+ participants
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
    - Mentored 12 junior engineers and established ML engineering best practices across the organization
  ],
)

#experience(
  company: "AI Innovations Lab",
  position: "Research Scientist",
  date: "2019 - 2021",
  location: "Mountain View, CA",
  description: [
    - Pioneered novel deep learning architectures for computer vision achieving state-of-the-art results on ImageNet
    - Published 8 peer-reviewed papers in top-tier conferences (NeurIPS, ICML, ICLR) with 200+ total citations
    - Secured \$2.5M in research funding through successful grant proposals to NSF and industry partnerships
    - Collaborated with Stanford and MIT researchers on breakthrough federated learning algorithms
  ],
)

#experience(
  company: "StartupTech, Inc.",
  position: "Machine Learning Engineer",
  date: "2017 - 2019",
  location: "Palo Alto, CA",
  description: [
    - Developed end-to-end ML solutions for fraud detection reducing false positives by 60% and saving \$5M annually
    - Built distributed training infrastructure supporting models with 100B+ parameters using PyTorch and Ray
    - Optimized inference pipeline achieving 10x latency improvement through model quantization and hardware acceleration
  ],
)

= Projects

#project(
  name: "AutoML Platform",
  date: "Jan 2023 - Present",
  link: "alexjohnson-ml/automl-platform",
  description: [
    - Designed comprehensive AutoML platform enabling non-technical users to build ML models with 90% accuracy
    - Implemented distributed hyperparameter optimization reducing training time by 75% using Optuna and Ray
    - Platform adopted by 500+ internal users across 15 business units, accelerating time-to-insight by 80%
    - Built web interface using React and FastAPI with real-time model monitoring and A/B testing capabilities
  ],
)

#project(
  name: "Federated Learning Framework",
  date: "Mar 2022 - Dec 2022",
  link: "alexjohnson-ml/federated-ml",
  description: [
    - Developed privacy-preserving federated learning framework supporting 1000+ edge devices
    - Implemented differential privacy mechanisms ensuring ε-differential privacy with minimal accuracy loss
    - Framework enables collaborative ML training across organizations without data sharing
    - Open-sourced project with 2.5K GitHub stars and active contributor community
  ],
)

#project(
  name: "Real-time Anomaly Detection System",
  date: "Aug 2021 - Feb 2022",
  link: "alexjohnson-ml/anomaly-detection",
  description: [
    - Built production-grade anomaly detection system processing 50M events/day with \<100ms latency
    - Utilized ensemble of LSTM and Transformer models achieving 95% precision and 92% recall
    - Integrated with Kafka, ClickHouse, and Grafana for real-time monitoring and alerting
    - System detected critical infrastructure issues 30 minutes faster than previous solutions
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

#skill(
  category: "Cloud & Infrastructure",
  skills: "AWS, Kubernetes, Docker, GCP, Apache Kafka, Redis, PostgreSQL, ClickHouse",
)

#skill(
  category: "Specialized Skills",
  skills: "Deep Learning, Computer Vision, NLP, Federated Learning, MLOps, A/B Testing"
)

= Publications & Research

#entry(
  title: "Federated Learning with Differential Privacy: A Comprehensive Survey",
  location: "Nature Machine Intelligence",
  date: "2024",
  description: "First Author • Impact Factor: 25.9 • Cited by 156",
)

#entry(
  title: "Efficient AutoML for Large-Scale Industrial Applications",
  location: "International Conference on Machine Learning (ICML)",
  date: "2023",
  description: "Lead Author • Acceptance Rate: 27.9 • Cited by 89",
)

#entry(
  title: "Privacy-Preserving Deep Learning at Scale",
  location: "Neural Information Processing Systems (NeurIPS)",
  date: "2022", 
  description: "Co-Author • Top 1% of submissions • Cited by 234",
)

= Certifications & Awards

#certification(certification: "AWS Certified Machine Learning - Specialty", date: "2023")
#certification(certification: "Google Cloud Professional ML Engineer", date: "2022")
#certification(certification: "Certified Kubernetes Administrator (CKA)", date: "2023")

#item[
  - *Best Paper Award* - International Conference on Machine Learning Applications (2023)
  - *Rising Star in AI Award* - AI Innovation Summit (2022)
  - *Outstanding Graduate Award* - Stanford University (2017)
  - *NSF Graduate Research Fellowship* (2015-2017)
]
