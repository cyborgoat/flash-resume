// Resume template wrapper for minimal-2
// This file loads configuration from JSON and applies it

#import "lib.typ"

// Load template configuration from JSON
#let config = json("../conf.json")

// Theme-specific wrapper function that loads configuration from JSON
#let minimal2-resume(author-info, body) = {
  lib.resume(
    // Pass the full author-info object as minimal-2 expects it
    author: author-info,
    // Apply configuration from conf.json
    profile-picture: if config.features.profile_picture { image } else { none },
    date: if config.features.show_date { datetime.today().display(config.features.date_format) } else { none },
    language: "en",
    colored-headers: config.features.colored_headers,
    show-footer: config.features.show_footer,
    paper-size: config.style.paper_size,
    accent-color: rgb(config.style.accent_color),
    font: (config.style.primary_font,),
    header-font: (config.style.header_font,),
    body
  )
}

// ==============================================================================
// PUBLIC INTERFACE - Export all functions from lib and the configured resume
// ==============================================================================
#let resume = minimal2-resume

// Re-export all other functions from lib.typ
#let education = lib.education
#let experience = lib.experience
#let project = lib.project
#let extracurriculars = lib.extracurriculars
#let skill = lib.skill
#let entry = lib.entry
#let item = lib.item
#let gpa = lib.gpa
#let certification = lib.certification
#let skill-item = lib.skill-item
