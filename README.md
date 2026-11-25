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
├── about.html              # About page
├── projects/
│   ├── fluency-align.html  # Fluency Align case study
│   ├── ponder.html         # Ponder case study
│   ├── lenovo.html         # Lenovo Play case study
│   └── project-one.html    # Blank project page template
├── images/
│   ├── fluency-align/      # Project images, from the Webflow site (the
│   ├── lenovo/             #   Ponder hero and three ideation images are
│   ├── ponder/             #   exports from Figma)
│   ├── about/              # Portrait
│   └── project-one/        # Template placeholder images
├── css/
│   └── styles.css          # Site styles
├── js/
│   ├── home-transitions.js # Keeps the clicked project on top during transitions
│   └── project-hero.js     # Expands the project hero to full width on scroll
├── partials/               # Shared <head> links, header and footer
├── tools/
│   └── sync.mjs            # Copies the partials into every page (see below)
└── README.md
```

Clicking a project card on the home page morphs its image, title, description and
tags into the project page's hero using cross-document view transitions (Chrome, Edge and
Safari 18.2+; other browsers navigate normally). To add a project, copy
`projects/project-one.html`, then give its hero and its home page card the same
`data-project` (e.g. `data-project="project-two"`) and run the sync script below.

## Shared header, footer and versions

The font links, stylesheet link, header and footer live once in `partials/`.
Each page keeps a full copy between `<!-- shared:NAME -->` markers, so the
pages are still plain HTML with nothing to build before deploying. After you
change a partial, CSS or JS file, or add a page or project, run:

```bash
node tools/sync.mjs
```

and commit the pages it updates. It:

- copies `partials/head.html`, `header.html` and `footer.html` into every page,
  fixing relative paths and marking the current page's nav link;
- sets the `?v=` on every CSS and JS link to a hash of that file, so browsers
  fetch it again only when it has changed (no more bumping it by hand);
- writes each card's and hero's `view-transition-name` from its
  `data-project` and `data-vt` attributes, so the two always match.

The header and footer stay in the HTML itself rather than being loaded with
JavaScript, so they're on screen at first paint and the header holds still
during page transitions. `node tools/sync.mjs --check` changes nothing and
fails if a page is out of date; GitHub runs it on every push.

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

I'm always happy to talk about design, collaborations, or new opportunities. You can find me on [LinkedIn](https://www.linkedin.com/in/jacksonbryan28/) and GitHub at [@jacksonbryan28](https://github.com/jacksonbryan28).

---

© 2026 Jackson Bryan. All rights reserved.
