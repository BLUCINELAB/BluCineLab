# BluCineLab — 2026 redesign

Editorial, image-led static website for BluCineLab, an independent creative and production studio based in Bologna.

**Direction before production.**

## Architecture

- Home
- Selected work and project pages
- Image practice
- People and Sonia Giudici profile
- Services
- Production in Italy
- Start a Project
- Studio

## Core team

BluCineLab presents one five-person core team with distinct responsibilities:

- **Anton Likht** — visual direction and production
- **Sonia Giudici** — photography and creative production
- **Michele Piccolo** — music and sound
- **Beatrice Visentin** — fashion and styling
- **Federico Basagni** — production design

A wider production network is assembled project by project around location, scale and specialist needs. The project lead changes according to the work; authorship and credits stay explicit.

## Credit policy

Every project is labelled as one of:

1. BluCineLab production or commission
2. Selected work by a studio member
3. Development concept

Earlier credits are not retroactively presented as studio commissions. Employers and individual professional experience are not presented as BluCineLab clients. Development material is not presented as delivered work.

## Growth layer

The V1.1 growth layer keeps the redesign intact and adds commercial clarity without turning the site into a generic production-company template:

- a dedicated `/production-in-italy/` landing page for project-specific local production support
- a guided `/start-project/` enquiry route that structures a brief without storing form data
- aligned team language across public copy and structured data
- deeper case-study framing around context, production logic and outputs
- stronger internal linking between services, proof and enquiry

## Build principles

The site is a dependency-free static build for GitHub Pages. Content and navigation work without JavaScript; the small script updates the footer year, improves external-link labelling, routes the primary enquiry CTA, and prepares structured project emails from the Start a Project page. Images preserve their native aspect ratio and use AVIF/WebP responsive variants where available.

The typographic system uses self-hosted Instrument Sans Variable and Instrument Serif under the SIL Open Font License. License files are stored beside the font files in `asset/fonts/`.

## Local preview

Serve the repository root with any static HTTP server. Root-relative asset paths require an HTTP preview rather than opening the HTML files directly.

## Contact

[Start a project](https://blucinelab.it/start-project/) · [blucinelab@gmail.com](mailto:blucinelab@gmail.com) · [Instagram](https://www.instagram.com/blucinelab/)
