document.documentElement.classList.add("has-js");

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = new Date().getFullYear();

for (const link of document.querySelectorAll('a[target="_blank"]')) {
  if (!link.getAttribute("aria-label")) {
    link.setAttribute("aria-label", `${link.textContent.trim()} (opens in a new tab)`);
  }
}

// Keep the primary enquiry route consistent across the static site while
// preserving direct email links as a secondary fallback.
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
    const lines = [
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      organisation ? `Organisation: ${organisation}` : "",
      `Project type: ${type}`,
      value("location-dates") ? `Location / timing: ${value("location-dates")}` : "",
      value("budget") ? `Budget: ${value("budget")}` : "",
      value("reference") ? `Brief / reference link: ${value("reference")}` : "",
      "",
      "Project / problem:",
      value("brief"),
      "",
      `Sent from: ${window.location.href}`
    ].filter(Boolean);

    return {
      subject: `Project enquiry — ${type}${organisation ? ` — ${organisation}` : ""}`,
      body: lines.join("\n")
    };
  };

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const enquiry = buildEnquiry();
    window.location.href = `mailto:blucinelab@gmail.com?subject=${encodeURIComponent(enquiry.subject)}&body=${encodeURIComponent(enquiry.body)}`;
  });

  const copyButton = enquiryForm.querySelector("[data-copy-enquiry]");
  if (copyButton && navigator.clipboard) {
    copyButton.addEventListener("click", async () => {
      if (!enquiryForm.reportValidity()) return;
      const enquiry = buildEnquiry();
      await navigator.clipboard.writeText(`${enquiry.subject}\n\n${enquiry.body}`);
      const original = copyButton.textContent;
      copyButton.textContent = "Brief copied";
      window.setTimeout(() => { copyButton.textContent = original; }, 1800);
    });
  }
}
