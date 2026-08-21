document.documentElement.classList.add("has-js");

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = new Date().getFullYear();

for (const link of document.querySelectorAll('a[target="_blank"]')) {
  if (!link.getAttribute("aria-label")) {
    link.setAttribute("aria-label", `${link.textContent.trim()} (opens in a new tab)`);
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
