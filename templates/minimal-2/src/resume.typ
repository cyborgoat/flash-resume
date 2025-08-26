// Resume template wrapper for minimal-2
// This file provides a consistent interface by applying configuration

#import "lib.typ"
#import "../../config-loader.typ": load-config, get-alignment

// Load configuration
#let config = load-config()

// Theme-specific wrapper function that applies configuration
#let minimal2-resume(author-info, body) = {
  lib.resume(
    // Pass the full author-info object as minimal-2 expects it
    author: author-info,
    // Apply configuration-driven settings
    profile-picture: if config.profile-picture { image } else { none },
    date: if config.show-date { datetime.today().display(config.date-format) } else { none },
    language: "en",
    colored-headers: config.colored-headers,
    show-footer: config.show-footer,
    paper-size: config.paper-size,
    accent-color: config.accent-color,
    font: (config.primary-font,),
    header-font: (config.header-font,),
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
