document.documentElement.classList.add("has-js");

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = new Date().getFullYear();

for (const link of document.querySelectorAll('a[target="_blank"]')) {
  if (!link.getAttribute("aria-label")) {
    link.setAttribute("aria-label", `${link.textContent.trim()} (opens in a new tab)`);
  }
}

// Load the third-party video player only when the visitor chooses to play.
for (const preview of document.querySelectorAll("[data-video-id]")) {
  preview.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const id = preview.dataset.videoId;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    event.preventDefault();
    const player = document.createElement("iframe");
    player.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1";
    player.title = preview.dataset.videoTitle || "Video player";
    player.className = "video-player";
    player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    player.allowFullscreen = true;
    preview.replaceWith(player);
    player.focus();
  });
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

// Use native controls without JavaScript; enhance to a discreet, accessible
// play/pause button when the motion study is available.
for (const video of document.querySelectorAll("[data-practice-motion]")) {
  const button = video.closest(".motion-study")?.querySelector(".motion-toggle");
  if (button) {
    const update = () => {
      button.textContent = video.paused ? "Play" : "Pause";
      button.setAttribute("aria-label", (video.paused ? "Play" : "Pause") + " Secondo corpo");
    };
    video.addEventListener("play", update);
    video.addEventListener("pause", update);
    video.addEventListener("error", update);
    button.addEventListener("click", () => {
      if (video.paused) {
        video.muted = true;
        video.play().catch(update);
      } else {
        video.pause();
      }
    });
    video.controls = false;
    button.hidden = false;
    update();
  }
  // Muted inline playback begins only when the study is on screen.
  // The static poster and manual control remain for reduced-motion visitors.
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      video.muted = true;
      video.play().catch(() => {});
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(video);
  }
}
