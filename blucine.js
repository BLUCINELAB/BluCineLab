document.documentElement.classList.add("has-js");

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = new Date().getFullYear();

for (const link of document.querySelectorAll('a[target="_blank"]')) {
  if (!link.getAttribute("aria-label")) {
    link.setAttribute("aria-label", `${link.textContent.trim()} (opens in a new tab)`);
  }
}

// Home image-practice composition: keep the static three-image fallback intact,
// then progressively enhance it into an authored four-image sequence.
const practiceTitle = document.querySelector("#practice-title");
const practiceSection = practiceTitle?.closest(".section");
const practiceStrip = practiceSection?.querySelector(".proof-strip");
if (practiceStrip) {
  const figures = Array.from(practiceStrip.querySelectorAll(":scope > figure"));
  if (figures.length === 3) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/home-image-practice.css";
    document.head.append(stylesheet);

    practiceStrip.classList.remove("proof-strip");
    practiceStrip.classList.add("practice-composition");
    figures[0].classList.add("practice-composition__body");
    figures[1].classList.add("practice-composition__material");
    figures[2].classList.add("practice-composition__night");

    const afterimage = document.createElement("figure");
    afterimage.className = "image-figure practice-composition__afterimage";
    afterimage.innerHTML = `
      <div class="afterimage-media" aria-busy="true"></div>
      <figcaption class="caption"><span>Afterimage — Anton Likht</span><span>Polaroid / 2026</span></figcaption>
    `;
    figures[2].before(afterimage);

    const media = afterimage.querySelector(".afterimage-media");
    const parts = [1, 2, 3].map((part) =>
      fetch(`/asset/portfolio/anton-afterimage-polaroid-480.b64.${part}.txt`, { cache: "force-cache" })
        .then((response) => {
          if (!response.ok) throw new Error(`Afterimage part ${part} failed`);
          return response.text();
        })
    );

    Promise.all(parts)
      .then((chunks) => {
        const image = document.createElement("img");
        image.src = `data:image/webp;base64,${chunks.join("").replace(/\s+/g, "")}`;
        image.width = 480;
        image.height = 583;
        image.loading = "lazy";
        image.decoding = "async";
        image.alt = "Warm-toned Polaroid portrait of a red-haired woman in white against a glowing textured background.";
        media.replaceWith(image);
      })
      .catch(() => {
        media.removeAttribute("aria-busy");
        media.classList.add("afterimage-media--error");
      });
  }
}

// Keep the primary enquiry route consistent across the static site while
// preserving direct email links as a secondary fallback when JavaScript is off.
for (const link of document.querySelectorAll(".header-contact")) {
  link.setAttribute("href", "/start-project/");
}

const enquiryForm = document.querySelector("[data-enquiry-form]");
if (enquiryForm) {
  const buildEnquiry = () => {
    const data = new FormData(enquiryForm);
    const value = (name) => String(data.get(name) || "").trim();
    const type = value("project-type") || "Project";
    const organisation = value("organisation");
    const detailLines = [
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      organisation ? `Organisation: ${organisation}` : "",
      `Project type: ${type}`,
      value("location-dates") ? `Location / timing: ${value("location-dates")}` : "",
      value("budget") ? `Budget: ${value("budget")}` : "",
      value("reference") ? `Brief / reference link: ${value("reference")}` : ""
    ].filter(Boolean);

    const body = [
      ...detailLines,
      "",
      "Project / problem:",
      value("brief"),
      "",
      `Sent from: ${window.location.href}`
    ].join("\n");

    return {
      subject: `Project enquiry — ${type}${organisation ? ` — ${organisation}` : ""}`,
      body
    };
  };

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const enquiry = buildEnquiry();
    window.location.href = `mailto:blucinelab@gmail.com?subject=${encodeURIComponent(enquiry.subject)}&body=${encodeURIComponent(enquiry.body)}`;
  });

  const copyButton = enquiryForm.querySelector("[data-copy-enquiry]");
  if (copyButton) {
    if (!navigator.clipboard?.writeText) {
      copyButton.hidden = true;
    } else {
      copyButton.addEventListener("click", async () => {
        if (!enquiryForm.reportValidity()) return;
        const enquiry = buildEnquiry();
        const original = copyButton.textContent;
        try {
          await navigator.clipboard.writeText(`${enquiry.subject}\n\n${enquiry.body}`);
          copyButton.textContent = "Brief copied";
        } catch {
          copyButton.textContent = "Copy unavailable";
        }
        window.setTimeout(() => { copyButton.textContent = original; }, 1800);
      });
    }
  }
}
