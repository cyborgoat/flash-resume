// Configuration Management System
// Loads and processes configuration from config.toml

// Load configuration from TOML file
#let load-config() = {
  let config = toml("config.toml")
  
  // Process colors to ensure they're in the right format
  let process-color(color-str) = {
    if type(color-str) == str {
      rgb(color-str)
    } else {
      color-str
    }
  }
  
  // Process font sizes to ensure they're lengths
  let process-font-size(size-str) = {
    if type(size-str) == str {
      // Convert string like "10pt" to length
      if size-str.ends-with("pt") {
        let num = float(size-str.slice(0, -2))
        num * 1pt
      } else if size-str.ends-with("em") {
        let num = float(size-str.slice(0, -2))
        num * 1em
      } else {
        // Try to parse as number and assume pt
        let num = float(size-str)
        num * 1pt
      }
    } else {
      size-str
    }
  }
  
  // Processed configuration with defaults
  (
    theme: config.at("theme", default: (:)).at("active", default: "minimal-1"),
    
    // Style settings
    primary-font: config.at("style", default: (:)).at("primary_font", default: "New Computer Modern"),
    header-font: config.at("style", default: (:)).at("header_font", default: "New Computer Modern"),
    font-size: process-font-size(config.at("style", default: (:)).at("font_size", default: "10pt")),
    header-font-size: process-font-size(config.at("style", default: (:)).at("header_font_size", default: "20pt")),
    
    accent-color: process-color(config.at("style", default: (:)).at("accent_color", default: "#26428b")),
    text-color: process-color(config.at("style", default: (:)).at("text_color", default: "#000000")),
    link-color: process-color(config.at("style", default: (:)).at("link_color", default: "#26428b")),
    header-color: process-color(config.at("style", default: (:)).at("header_color", default: "#26428b")),
    
    paper-size: config.at("style", default: (:)).at("paper_size", default: "us-letter"),
    margins: config.at("style", default: (:)).at("margins", default: "0.5in"),
    line-spacing: config.at("style", default: (:)).at("line_spacing", default: "0.5em"),
    
    // Formatting settings
    show-section-lines: config.at("formatting", default: (:)).at("show_section_lines", default: true),
    section-spacing: config.at("formatting", default: (:)).at("section_spacing", default: "0.4em"),
    entry-spacing: config.at("formatting", default: (:)).at("entry_spacing", default: "0.25em"),
    
    author-position: config.at("formatting", default: (:)).at("author_position", default: "left"),
    contact-position: config.at("formatting", default: (:)).at("contact_position", default: "left"),
    contact-separator: config.at("formatting", default: (:)).at("contact_separator", default: "  |  "),
    
    // Feature settings
    colored-headers: config.at("features", default: (:)).at("colored_headers", default: true),
    show-footer: config.at("features", default: (:)).at("show_footer", default: false),
    show-icons: config.at("features", default: (:)).at("show_icons", default: true),
    profile-picture: config.at("features", default: (:)).at("profile_picture", default: false),
    show-date: config.at("features", default: (:)).at("show_date", default: true),
    date-format: config.at("features", default: (:)).at("date_format", default: "[month repr:long] [day], [year]"),
    
    // Advanced settings
    disable-ligatures: config.at("advanced", default: (:)).at("disable_ligatures", default: true),
    justify-text: config.at("advanced", default: (:)).at("justify_text", default: true),
    hyphenation: config.at("advanced", default: (:)).at("hyphenation", default: false),
  )
}

// Helper function to convert position strings to Typst alignment
#let get-alignment(position) = {
  if position == "left" { left }
  else if position == "center" { center }
  else if position == "right" { right }
  else { left } // default
}
