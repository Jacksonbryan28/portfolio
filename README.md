# Jackson Bryan — Design Portfolio

This repository holds the source for my personal portfolio site: a home for my design work, the projects I've made, and a little about who I am.

## About me

I'm Jackson Bryan, a designer. I care about work that looks good, is easy to use, and solves a real problem for the people using it. To me, good design is clear, considered, and never louder than it needs to be.

This portfolio is where I collect what I've made, show how I think through a problem, and keep track of how my work develops over time.

<!-- TODO: add a sentence or two in your own words: your design focus (UI/UX, brand, graphic, product…), where you're based, and what you're looking for next. -->

## What's inside

- **Home**: an introduction and a selection of featured projects
- **Projects**: case studies covering the brief, the process, and the outcome
- **About**: more about me, my approach, and how to get in touch

## Built with

The site is built with plain HTML, CSS and a little JavaScript, with no frameworks or build step.

```
portfolio/
├── index.html              # Home page
├── projects/
│   ├── ponder.html         # Ponder case study
│   └── project-one.html    # Blank project page template
├── images/
│   ├── ponder/             # Ponder images (exported from Figma)
│   └── project-one/        # Template placeholder images
├── css/
│   └── styles.css          # Site styles
├── js/
│   └── project-hero.js     # Expands the project hero to full width on scroll
└── README.md
```

Clicking a project card on the home page morphs its image, title, description and
tags into the project page's hero using cross-document view transitions (Chrome, Edge and
Safari 18.2+; other browsers navigate normally). To add a project, copy
`projects/project-one.html` and give the card and hero a matching, unique
`view-transition-name` (e.g. `project-two-media`, `project-two-title`).

The stylesheet and script are linked with a version number (`?v=20261009`).
When you change `css/styles.css` or `js/project-hero.js`, bump that number in
every HTML file so browsers fetch the new files instead of a cached copy.

## Viewing it locally

Clone the repo and start a local web server from inside the folder:

```bash
git clone https://github.com/jacksonbryan28/portfolio.git
cd portfolio
python3 -m http.server
```

Then open http://localhost:8000. Double-clicking `index.html` also opens the
site, but the page transitions only play when it's served from a web address.
If styles look out of date, hard refresh with Cmd+Shift+R (Ctrl+Shift+R on
Windows).

## Get in touch

I'm always happy to talk about design, collaborations, or new opportunities. You can find me on GitHub at [@jacksonbryan28](https://github.com/jacksonbryan28).

---

© 2026 Jackson Bryan. All rights reserved.
