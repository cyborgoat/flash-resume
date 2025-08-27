#import "utils/linguify/0.4.2/src/lib.typ": *

// const color
#let color-darknight = rgb("#131A28")
#let color-darkgray = rgb("#333333")
#let color-gray = rgb("#5d5d5d")
#let default-accent-color = rgb("#262F99")
#let default-location-color = rgb("#333333")

// Define icon symbols as Unicode characters (fallback when FontAwesome fonts not available)
#let linkedin-icon = box(text("🔗", fill: color-darknight))
#let github-icon = box(text("🔗", fill: color-darknight))
#let twitter-icon = box(text("🐦", fill: color-darknight))
#let google-scholar-icon = box(text("🎓", fill: color-darknight))
#let scholar-icon = box(text("🎓", fill: color-darknight))
#let orcid-icon = box(text("🆔", fill: color-darknight))
#let phone-icon = box(text("📞", fill: color-darknight))
#let email-icon = box(text("✉️", fill: color-darknight))
#let birth-icon = box(text("🎂", fill: color-darknight))
#let homepage-icon = box(text("🏠", fill: color-darknight))
#let website-icon = box(text("🌐", fill: color-darknight))

// const icons (using Unicode symbols as FontAwesome fallback)

/// Helpers

// layout utility
#let __justify_align(left_body, right_body) = {
  block[
    #left_body
    #box(width: 1fr)[
      #align(right)[
        #right_body
      ]
    ]
  ]
}

#let __justify_align_3(left_body, mid_body, right_body) = {
  block[
    #box(width: 1fr)[
      #align(left)[
        #left_body
      ]
    ]
    #box(width: 1fr)[
      #align(center)[
        #mid_body
      ]
    ]
    #box(width: 1fr)[
      #align(right)[
        #right_body
      ]
    ]
  ]
}

#let __coverletter_footer(author, language, date, lang-data) = {
  set text(
    fill: gray,
    size: 8pt,
  )
  __justify_align_3[
    #smallcaps[#date]
  ][
    #smallcaps[
      #if language == "zh" or language == "ja" [
        #author.firstname#author.lastname
      ] else [
        #author.firstname#sym.space#author.lastname
      ]
      #sym.dot.c
      #linguify("cover-letter", from: lang-data)
    ]
  ][
    #context {
      counter(page).display()
    }
  ]
}

#let __resume_footer(author, language, lang-data, date) = {
  set text(
    fill: gray,
    size: 8pt,
  )
  __justify_align_3[
    #smallcaps[#date]
  ][
    #smallcaps[
      #if language == "zh" or language == "ja" [
        #author.firstname#author.lastname
      ] else [
        #author.firstname#sym.space#author.lastname
      ]
      #sym.dot.c
      #linguify("resume", from: lang-data)
    ]
  ][
    #context {
      counter(page).display()
    }
  ]
}

/// Show a link with an icon, specifically for Github projects
/// *Example*
/// #example(`resume.github-link("DeveloperPaul123/awesome-resume")`)
/// - github-path (string): The path to the Github project (e.g. "DeveloperPaul123/awesome-resume")
/// -> none
#let github-link(github-path) = {
  set box(height: 11pt)
  
  align(right + horizon)[
    #text("🔗", fill: color-darkgray) #link(
      "https://github.com/" + github-path,
      github-path,
    )
  ]
}

/// Right section for the justified headers
/// - body (content): The body of the right header
#let secondary-right-header(body) = {
  set text(
    size: 11pt,
    weight: "medium",
  )
  body
}

/// Right section of a tertiaty headers.
/// - body (content): The body of the right header
#let tertiary-right-header(body) = {
  set text(
    weight: "light",
    size: 9pt,
  )
  body
}

/// Justified header that takes a primary section and a secondary section. The primary section is on the left and the secondary section is on the right.
/// - primary (content): The primary section of the header
/// - secondary (content): The secondary section of the header
#let justified-header(primary, secondary) = {
  set block(
    above: 0.7em,
    below: 0.7em,
  )
  pad[
    #__justify_align[
      == #primary
    ][
      #secondary-right-header[#secondary]
    ]
  ]
}

/// Justified header that takes a primary section and a secondary section. The primary section is on the left and the secondary section is on the right. This is a smaller header compared to the `justified-header`.
/// - primary (content): The primary section of the header
/// - secondary (content): The secondary section of the header
#let secondary-justified-header(primary, secondary) = {
  __justify_align[
    === #primary
  ][
    #tertiary-right-header[#secondary]
  ]
}

#let resume(
  author: (:),
  profile-picture: image,
  date: datetime.today().display("[month repr:long] [day], [year]"),
  accent-color: default-accent-color,
  colored-headers: true,
  show-footer: true,
  language: "en",
  font: ("Source Sans Pro", "Source Sans 3"),
  header-font: ("Roboto"),
  paper-size: "a4",
  body,
) = {
  if type(accent-color) == str {
    accent-color = rgb(accent-color)
  }
  
  let lang_data = toml("lang.toml")

  show: body => context {
    set document(
      author: author.firstname + " " + author.lastname,
      title: linguify("resume", lang: language, from: lang_data),
    )
    body
  }

  set text(
    font: font,
    lang: language,
    size: 11pt,
    fill: color-darkgray,
    fallback: true,
  )
  
  set page(
    paper: paper-size,
    margin: (left: 15mm, right: 15mm, top: 10mm, bottom: 10mm),
    footer: if show-footer [#__resume_footer(
        author,
        language,
        lang_data,
        date,
      )] else [],
    footer-descent: 0pt,
  )
  
  // set paragraph spacing
  set par(
    spacing: 0.75em,
    justify: true,
  )
  
  set heading(
    numbering: none,
    outlined: false,
  )
  
  show heading.where(level: 1): it => [
    #set text(
      size: 16pt,
      weight: "regular",
    )
    #set align(left)
    #set block(above: 1em)
    #let color = if colored-headers {
      accent-color
    } else {
      color-darkgray
    }
    #text[#strong[#text(color)[#it.body]]]
    #box(width: 1fr, line(length: 100%))
  ]
  
  show heading.where(level: 2): it => {
    set text(
      color-darkgray,
      size: 12pt,
      style: "normal",
      weight: "bold",
    )
    it.body
  }
  
  show heading.where(level: 3): it => {
    set text(
      size: 10pt,
      weight: "regular",
    )
    smallcaps[#it.body]
  }
  
  let name = {
    align(center)[
      #pad(bottom: 5pt)[
        #block[
          #set text(
            size: 32pt,
            style: "normal",
            font: header-font,
          )
          #if language == "zh" or language == "ja" [
            #text(
              accent-color,
              weight: "thin",
            )[#author.firstname]#text(weight: "bold")[#author.lastname]
          ] else [
            #text(accent-color, weight: "thin")[#author.firstname]
            #text(weight: "bold")[#author.lastname]
          ]
        ]
      ]
    ]
  }
  
  let positions = {
    set text(
      accent-color,
      size: 9pt,
      weight: "regular",
    )
    align(center)[
      #smallcaps[
        #author.positions.join(
          text[#"  "#sym.dot.c#"  "],
        )
      ]
    ]
  }
  
  let address = {
    set text(
      size: 9pt,
      weight: "regular",
    )
    align(center)[
      #if ("address" in author) [
        #author.address
      ]
    ]
  }
  
  let contacts = {
    set box(height: 9pt)
    
    let separator = box(width: 5pt)
    
    align(center)[
      #set text(
        size: 9pt,
        weight: "regular",
        style: "normal",
      )
      #block[
        #align(horizon)[
          #if ("birth" in author) [
            #birth-icon
            #box[#text(author.birth)]
            #separator
          ]
          #if ("phone" in author) [
            #phone-icon
            #box[#text(author.phone)]
            #separator
          ]
          #if ("email" in author) [
            #email-icon
            #box[#link("mailto:" + author.email)[#author.email]]
          ]
          #if ("homepage" in author) [
            #separator
            #homepage-icon
            #box[#link(author.homepage)[#author.homepage]]
          ]
          #if ("github" in author) [
            #separator
            #github-icon
            #box[#link("https://github.com/" + author.github)[#author.github]]
          ]
          #if ("linkedin" in author) [
            #separator
            #linkedin-icon
            #box[
              #link("https://www.linkedin.com/in/" + author.linkedin)[#author.firstname #author.lastname]
            ]
          ]
          #if ("twitter" in author) [
            #separator
            #twitter-icon
            #box[#link("https://twitter.com/" + author.twitter)[\@#author.twitter]]
          ]
          #if ("scholar" in author) [
            #let fullname = str(author.firstname + " " + author.lastname)
            #separator
            #google-scholar-icon
            #box[#link("https://scholar.google.com/citations?user=" + author.scholar)[#fullname]]
          ]
          #if ("orcid" in author) [
            #separator
            #orcid-icon
            #box[#link("https://orcid.org/" + author.orcid)[#author.orcid]]
          ]
          #if ("website" in author) [
            #separator
            #website-icon
            #box[#link(author.website)[#author.website]]
          ]
        ]
      ]
    ]
  }
  
  if profile-picture != none {
    grid(
      columns: (100% - 4cm, 4cm),
      rows: (100pt),
      gutter: 10pt,
      [
        #name
        #positions
        #address
        #contacts
      ],
      align(left + horizon)[
        #block(
          clip: true,
          stroke: 0pt,
          radius: 2cm,
          width: 4cm,
          height: 4cm,
          profile-picture,
        )
      ],
    )
  } else {
    name
    positions
    address
    contacts
  }

  body

}

#let default-closing(lang-data) = {
  align(bottom)[
    #text(weight: "light", style: "italic")[ #linguify(
        "attached",
        from: lang-data,
      )#sym.colon #linguify("curriculum-vitae", from: lang-data)]
  ]
}

#let coverletter(
  author: (:),
  profile-picture: image,
  date: datetime.today().display("[month repr:long] [day], [year]"),
  accent-color: default-accent-color,
  language: "en",
  font: ("Source Sans Pro", "Source Sans 3"),
  show-footer: true,
  closing: none,
  paper-size: "a4",
  body,
) = {
  if type(accent-color) == str {
    accent-color = rgb(accent-color)
  }
  
  // language data
  let lang_data = toml("lang.toml")
  
  if closing == none {
    closing = default-closing(lang_data)
  }

  show: body => context {
    set document(
      author: author.firstname + " " + author.lastname,
      title: linguify("cover-letter", lang: language, from: lang_data),
    )
    body
  }

  set text(
    font: font,
    lang: language,
    size: 11pt,
    fill: color-darkgray,
    fallback: true,
  )
  
  set page(
    paper: paper-size,
    margin: (left: 15mm, right: 15mm, top: 10mm, bottom: 10mm),
    footer: if show-footer [#__coverletter_footer(
        author,
        language,
        date,
        lang_data,
      )] else [],
    footer-descent: 0pt,
  )
  
  // set paragraph spacing
  set par(
    spacing: 0.75em,
    justify: true,
  )
  
  set heading(
    numbering: none,
    outlined: false,
  )
  
  show heading: it => [
    #set block(
      above: 1em,
      below: 1em,
    )
    #set text(
      size: 16pt,
      weight: "regular",
    )
    
    #align(left)[
      #text[#strong[#text(accent-color)[#it.body]]]
      #box(width: 1fr, line(length: 100%))
    ]
  ]
  
  let name = {
    align(right)[
      #pad(bottom: 5pt)[
        #block[
          #set text(
            size: 32pt,
            style: "normal",
            font: ("Roboto"),
          )
          #if language == "zh" or language == "ja" [
            #text(
              accent-color,
              weight: "thin",
            )[#author.firstname]#text(weight: "bold")[#author.lastname]
          ] else [
            #text(accent-color, weight: "thin")[#author.firstname]
            #text(weight: "bold")[#author.lastname]
          ]
          
        ]
      ]
    ]
  }
  
  let positions = {
    set text(
      accent-color,
      size: 9pt,
      weight: "regular",
    )
    align(right)[
      #smallcaps[
        #author.positions.join(
          text[#"  "#sym.dot.c#"  "],
        )
      ]
    ]
  }
  
  let address = {
    set text(
      size: 9pt,
      weight: "bold",
      fill: color-gray,
    )
    align(right)[
      #if ("address" in author) [
        #author.address
      ]
    ]
  }
  
  let contacts = {
    set box(height: 9pt)
    
    let separator = [  #box(sym.bar.v)  ]
    let author_list = ()

    if ("phone" in author) {
      author_list.push[
        #phone-icon
        #box[#text(author.phone)]
      ]
    }
    if ("email" in author) {
      author_list.push[
        #email-icon
        #box[#link("mailto:" + author.email)[#author.email]]
      ]
    }
    if ("github" in author) {
      author_list.push[
        #github-icon
        #box[#link("https://github.com/" + author.github)[#author.github]]
      ]
    }
    if ("linkedin" in author) {
      author_list.push[
        #linkedin-icon
        #box[
          #link("https://www.linkedin.com/in/" + author.linkedin)[#author.firstname #author.lastname]
        ]
      ]
    }
    if ("orcid" in author) {
      author_list.push[
        #orcid-icon
        #box[#link("https://orcid.org/" + author.orcid)[#author.orcid]]
      ]
    }
    if ("website" in author) {
      author_list.push[
        #website-icon
        #box[#link(author.website)[#author.website]]
      ]
    }


    align(right)[
      #set text(
        size: 8pt,
        weight: "light",
        style: "normal",
      )
      #author_list.join(separator)
    ]
  }
  
  let letter-heading = {
    grid(
      columns: (1fr, 2fr),
      rows: (100pt),
      align(left + horizon)[
        #block(
          clip: true,
          stroke: 0pt,
          radius: 2cm,
          width: 4cm,
          height: 4cm,
          profile-picture,
        )
      ],
      [
        #name
        #positions
        #address
        #contacts
      ],
    )
  }
  
  let signature = {
    align(bottom)[
      #pad(bottom: 2em)[
        #text(weight: "light")[#linguify(
            "sincerely",
            from: lang_data,
          )#if language != "de" [#sym.comma]] \
        #text(weight: "bold")[#author.firstname #author.lastname] \ \
      ]
    ]
  }
  
  // actual content
  letter-heading
  body
  linebreak()
  signature
  closing
}

#let hiring-entity-info(
  entity-info: (:),
  date: datetime.today().display("[month repr:long] [day], [year]"),
) = {
  set par(leading: 1em)
  pad(top: 1.5em, bottom: 1.5em)[
    #__justify_align[
      #text(weight: "bold", size: 12pt)[#entity-info.target]
    ][
      #text(weight: "light", style: "italic", size: 9pt)[#date]
    ]
    
    #pad(top: 0.65em, bottom: 0.65em)[
      #text(weight: "regular", fill: color-gray, size: 9pt)[
        #smallcaps[#entity-info.name] \
        #entity-info.street-address \
        #entity-info.city \
      ]
    ]
  ]
}

#let letter-heading(job-position: "", addressee: "", dear: "") = {
  let lang_data = toml("lang.toml")
  
  // TODO: Make this adaptable to content
  underline(evade: false, stroke: 0.5pt, offset: 0.3em)[
    #text(weight: "bold", size: 12pt)[#linguify("letter-position-pretext", from: lang_data) #job-position]
  ]
  pad(top: 1em, bottom: 1em)[
    #text(weight: "light", fill: color-gray)[
      #if dear == "" [
        #linguify("dear", from: lang_data)
      ] else [
        #dear
      ]
      #addressee,
    ]
  ]
}

#let coverletter-content(content) = {
  pad(top: 1em, bottom: 1em)[
    #set par(first-line-indent: 3em)
    #set text(weight: "light")
    #content
  ]
}

// Resume component functions (formerly in resume.typ)
#let item(body) = {
  set text(
    size: 10pt,
    style: "normal",
    weight: "light",
    fill: color-darknight,
  )
  set block(
    above: 0.75em,
    below: 1.25em,
  )
  set par(leading: 0.65em)
  block(above: 0.5em)[
    #body
  ]
}

#let entry(
  title: none,
  location: "",
  date: "",
  description: "",
  title-link: none,
  accent-color: default-accent-color,
  location-color: default-location-color,
) = {
  let title-content
  if type(title-link) == str {
    title-content = link(title-link)[#title]
  } else {
    title-content = title
  }
  block(above: 1em, below: 0.65em)[
    #pad[
      #justified-header(title-content, location)
      #if description != "" or date != "" [
        #secondary-justified-header(description, date)
      ]
    ]
  ]
}

#let gpa(numerator, denominator) = {
  set text(
    size: 12pt,
    style: "italic",
    weight: "light",
  )
  text[Cumulative GPA: #box[#strong[#numerator] / #denominator]]
}

#let certification(certification: "", date: "") = {
  justified-header(certification, date)
}

#let skill-item(category: "", items: ()) = {
  set block(below: 0.65em)
  set pad(top: 2pt)
  
  pad[
    #grid(
      columns: (20fr, 80fr),
      gutter: 10pt,
      align(right)[
        #set text(hyphenate: false)
        == #category
      ],
      align(left)[
        #set text(
          size: 11pt,
          style: "normal",
          weight: "light",
        )
        #items.join(", ")
      ],
    )
  ]
}

// Standardized functions for consistency between templates
#let education(
  school: "",
  degree: "",
  date: "",
  location: "",
  gpa: "",
  honors: "",
  courses: "",
) = {
  entry(
    title: school,
    location: location,
    date: date,
    description: degree,
  )
  if gpa != "" or honors != "" or courses != "" {
    item[
      #if gpa != "" [- GPA: #gpa]
      #if honors != "" [- Honors: #honors]
      #if courses != "" [- Relevant Coursework: #courses]
    ]
  }
}

#let experience(
  company: "",
  position: "",
  date: "",
  location: "",
  description: [],
) = {
  entry(
    title: position,
    location: location,
    date: date,
    description: company,
  )
  if description != [] {
    description
  }
}

#let project(
  name: "",
  date: "",
  description: [],
  link: "",
) = {
  entry(
    title: name,
    location: if link != "" { github-link(link) } else { "" },
    date: date,
    description: "",
  )
  if description != [] {
    description
  }
}

#let extracurriculars(
  organization: "",
  role: "",
  date: "",
  description: [],
) = {
  entry(
    title: organization,
    location: "",
    date: date,
    description: role,
  )
  if description != [] {
    description
  }
}

#let skill(
  category: "",
  skills: "",
) = {
  set block(below: 0.65em)
  set pad(top: 2pt)
  
  pad[
    #grid(
      columns: (20fr, 80fr),
      gutter: 10pt,
      align(right)[
        #set text(hyphenate: false)
        == #category
      ],
      align(left)[
        #set text(
          size: 11pt,
          style: "normal",
          weight: "light",
        )
        #skills
      ],
    )
  ]
}
