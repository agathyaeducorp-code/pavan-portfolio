/**
 * Pavan Kumar — Contact Form
 * Submits enquiries to Google Apps Script
 * without leaving the portfolio page.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
});

function initContactForm() {
  const form = document.querySelector("#project-form-element");
  const successMessage = document.querySelector("#form-success");
  const errorMessage = document.querySelector("#form-error");

  if (!form || !successMessage || !errorMessage) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');

    // Hide previous messages
    successMessage.hidden = true;
    errorMessage.hidden = true;

    // Disable button while sending
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    // Collect form data
    const formData = new FormData(form);

    try {
      await fetch(form.action, {
        method: "POST",
        body: formData,
        mode: "no-cors"
      });

      // Clear the form
      form.reset();

      // Show success message
      successMessage.hidden = false;

      successMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    } catch (error) {
      console.error("Contact form submission failed:", error);

      // Show error message
      errorMessage.hidden = false;

      errorMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    } finally {
      // Restore button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Let's build it";
      }
    }
  });
}