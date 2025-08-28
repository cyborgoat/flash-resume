#import "@preview/scienceicons:0.1.0": orcid-icon

// Load template configuration from JSON
#let config = json("../conf.json")

// Core resume function (internal to theme)
#let base-resume(
  author: "",
  author-position: left,
  personal-info-position: left,
  pronouns: "",
  location: "",
  email: "",
  github: "",
  linkedin: "",
  phone: "",
  personal-site: "",
  orcid: "",
  accent-color: "#000000",
  font: "New Computer Modern",
  paper: "us-letter",
  author-font-size: 20pt,
  font-size: 10pt,
  body,
) = {

  // Sets document metadata
  set document(author: author, title: author)

  // Document-wide formatting, including font and margins
  set text(
    // LaTeX style font
    font: font,
    size: font-size,
    lang: "en",
    // Disable ligatures so ATS systems do not get confused when parsing fonts.
    ligatures: false
  )

  // Reccomended to have 0.5in margin on all sides
  set page(
    margin: (0.5in),
    paper: paper,
  )

  // Link styles
  show link: underline


  // Small caps for section titles with improved spacing
  show heading.where(level: 1): it => [
    #v(0.4em)
    #pad(top: 0pt, bottom: 0.2em, [#smallcaps(it.body)])
    #line(length: 100%, stroke: 1pt)
    #v(0.2em)
  ]

  // Accent Color Styling
  show heading: set text(
    fill: rgb(accent-color),
  )

  show link: set text(
    fill: rgb(accent-color),
  )

  // Name will be aligned left, bold and big
  show heading.where(level: 1): it => [
    #set align(author-position)
    #set text(
      weight: 700,
      size: author-font-size,
    )
    #pad(it.body)
  ]

  // Level 1 Heading
  [= #(author)]

  // Personal Info Helper
  let contact-item(value, prefix: "", link-type: "") = {
    if value != "" {
      if link-type != "" {
        link(link-type + value)[#(prefix + value)]
      } else {
        value
      }
    }
  }

  // Personal Info
  pad(
    top: 0.25em,
    align(personal-info-position)[
      #{
        let items = (
          contact-item(pronouns),
          contact-item(phone),
          contact-item(location),
          contact-item(email, link-type: "mailto:"),
          contact-item(github, link-type: "https://"),
          contact-item(linkedin, link-type: "https://"),
          contact-item(personal-site, link-type: "https://"),
          contact-item(orcid, prefix: [#orcid-icon(color: rgb("#AECD54"))orcid.org/], link-type: "https://orcid.org/"),
        )
        items.filter(x => x != none).join("  |  ")
      }
    ],
  )

  // Main body with tighter spacing
  set par(justify: true, leading: 0.5em, spacing: 0.5em)

  body
}

// Generic two by two component for resume
#let generic-two-by-two(
  top-left: "",
  top-right: "",
  bottom-left: "",
  bottom-right: "",
) = {
  [
    #top-left #h(1fr) #top-right \
    #bottom-left #h(1fr) #bottom-right
  ]
}

// Generic one by two component for resume
#let generic-one-by-two(
  left: "",
  right: "",
) = {
  [
    #left #h(1fr) #right
  ]
}

// Cannot just use normal --- ligature becuase ligatures are disabled for good reasons
#let dates-helper(
  start-date: "",
  end-date: "",
) = {
  start-date + " " + $dash.em$ + " " + end-date
}

// Section components below
#let education(
  school: "",
  degree: "",
  date: "",
  location: "",
  gpa: "",
  honors: "",
  courses: "",
) = {
  // School name and date on top line
  generic-one-by-two(left: strong[#school], right: [#date])
  v(0.05em)
  
  // Degree and location on second line
  if degree != "" or location != "" {
    generic-one-by-two(left: [#degree], right: [#location])
    v(0.05em)
  }
  
  // GPA and honors on same line if provided
  let gpa_honors = ()
  if gpa != "" {
    gpa_honors.push("GPA: " + gpa)
  }
  if honors != "" {
    gpa_honors.push("Honors: " + honors)
  }
  if gpa_honors.len() > 0 {
    [#gpa_honors.join(" • ")]
    v(0.05em)
  }
  
  if courses != "" {
    [Relevant Coursework: #courses]
  }
  
  v(0.25em)
}

#let experience(
  company: "",
  position: "",
  date: "",
  location: "",
  description: [],
) = {
  // Company name and date on top line
  generic-one-by-two(left: strong[#company], right: [#date])
  v(0.05em)
  
  // Position and location on second line
  if position != "" or location != "" {
    generic-one-by-two(left: [#position], right: [#location])
    v(0.05em)
  }
  
  // Description with proper spacing
  if description != [] {
    description
  }
  
  v(0.25em)
}

#let project(
  name: "",
  date: "",
  description: [],
  link: "",
) = {
  // Project name and date on top line
  generic-one-by-two(left: strong[#name], right: [#date])
  v(0.05em)
  
  // Link on second line if provided
  if link != "" {
    [#link]
    v(0.05em)
  }
  
  // Description with proper spacing
  if description != [] {
    description
  }
  
  v(0.25em)
}

#let extracurriculars(
  organization: "",
  role: "",
  date: "",
  description: [],
) = {
  // Organization name and date on top line
  generic-one-by-two(left: strong[#organization], right: [#date])
  v(0.05em)
  
  // Role on second line if provided
  if role != "" {
    [#role]
    v(0.05em)
  }
  
  // Description with proper spacing
  if description != [] {
    description
  }
  
  v(0.25em)
}

#let skill(
  category: "",
  skills: "",
) = {
  // Category and skills with better spacing
  generic-one-by-two(left: strong[#category], right: [])
  v(0.03em)
  [#skills]
  v(0.2em)
}

#let coursework(
  courses: "",
) = {
  entry(
    left: strong[Relevant Coursework],
    right: [],
    [#courses],
  )
}

// Additional functions needed for full compatibility

#let entry(
  title: "",
  location: "",
  date: "",
  description: "",
  title-link: "",
) = {
  // Title with link if provided
  let title-content = if title-link != "" {
    link(title-link)[#title]
  } else {
    strong[#title]
  }
  
  generic-one-by-two(left: title-content, right: [#date])
  v(0.05em)
  
  if location != "" {
    [#location]
    v(0.05em)
  }
  
  if description != "" {
    [#description]
  }
  
  v(0.25em)
}

#let item(body) = {
  body
  v(0.1em)
}

#let gpa(numerator, denominator) = {
  [#numerator/#denominator]
}

#let certification(
  certification: "",
  date: "",
) = {
  generic-one-by-two(left: [#certification], right: [#date])
  v(0.1em)
}

#let skill-item(
  category: "",
  items: (),
) = {
  generic-one-by-two(left: strong[#category], right: [])
  v(0.03em)
  [#items.join(", ")]
  v(0.2em)
}

// Theme-specific wrapper function that loads configuration from JSON
#let minimal1-resume(author-info, body) = {
  base-resume(
    // Extract author name from author-info
    author: author-info.firstname + " " + author-info.lastname,
    // Apply configuration from conf.json
    pronouns: "",
    location: author-info.address,
    email: author-info.email,
    github: author-info.github,
    linkedin: author-info.linkedin,
    phone: author-info.phone,
    personal-site: author-info.homepage,
    orcid: author-info.orcid,
    accent-color: rgb(config.style.accent_color),
    font: config.style.primary_font,
    paper: config.style.paper_size,
    author-font-size: eval(config.style.header_font_size),
    font-size: eval(config.style.font_size),
    author-position: if config.formatting.author_position == "left" { left } else if config.formatting.author_position == "center" { center } else { right },
    personal-info-position: if config.formatting.contact_position == "left" { left } else if config.formatting.contact_position == "center" { center } else { right },
    body
  )
}

// ==============================================================================
// PUBLIC INTERFACE - Export the resume function
// ==============================================================================
// This is what gets imported when using this theme
#let resume = minimal1-resume
