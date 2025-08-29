// Scroll to top button
document.getElementById("scrollTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
<script>
  const settingsBtn = document.querySelector(".btn.purple");
  const modal = document.getElementById("settingsModal");
  const closeBtn = document.getElementById("closeSettings");
  const fontSizeInput = document.getElementById("fontSize");
  const lineHeightInput = document.getElementById("lineHeight");
  const toggleThemeBtn = document.getElementById("toggleTheme");
  const content = document.querySelector(".content");
/</script>
  

// Apply saved settings
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("fontSize")) {
    content.style.fontSize = localStorage.getItem("fontSize") + "px";
    fontSizeSelect.value = localStorage.getItem("fontSize");
  }
  if (localStorage.getItem("fontFamily")) {
    content.style.fontFamily = localStorage.getItem("fontFamily");
    fontFamilySelect.value = localStorage.getItem("fontFamily");
  }
  if (localStorage.getItem("lineHeight")) {
    content.style.lineHeight = localStorage.getItem("lineHeight");
    lineHeightSelect.value = localStorage.getItem("lineHeight");
  }
  if (localStorage.getItem("theme")) {
    setTheme(localStorage.getItem("theme"));
    themeSelect.value = localStorage.getItem("theme");
  }
});

// Open / Close modal
settingsBtn.addEventListener("click", () => modal.style.display = "block");
closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

// Font size
fontSizeSelect.addEventListener("change", () => {
  content.style.fontSize = fontSizeSelect.value + "px";
  localStorage.setItem("fontSize", fontSizeSelect.value);
});

// Font family
fontFamilySelect.addEventListener("change", () => {
  content.style.fontFamily = fontFamilySelect.value;
  localStorage.setItem("fontFamily", fontFamilySelect.value);
});

// Line height
lineHeightSelect.addEventListener("change", () => {
  content.style.lineHeight = lineHeightSelect.value;
  localStorage.setItem("lineHeight", lineHeightSelect.value);
});

// Theme
themeSelect.addEventListener("change", () => {
  setTheme(themeSelect.value);
  localStorage.setItem("theme", themeSelect.value);
});

// Function to change theme
function setTheme(theme) {
  document.body.classList.remove("light-theme","dark-theme","sepia-theme","blue-theme");
  if (theme === "dark") document.body.classList.add("dark-theme");
  else if (theme === "sepia") document.body.classList.add("sepia-theme");
  else if (theme === "blue") document.body.classList.add("blue-theme");
  else document.body.classList.add("light-theme");
}

  
