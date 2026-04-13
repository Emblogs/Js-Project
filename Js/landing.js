// Entry animation → then switch to infinite float
window.addEventListener("load", function () {
  var v = document.querySelector(".hero-visual");
  if (!v) return;
  // Wait for entry animation to finish (0.4s delay + 0.9s duration = 1.3s)
  setTimeout(function () {
    v.style.opacity = "1";
    v.style.transform = "translateY(-50%)";
    v.style.animation = "none";
    void v.offsetWidth; // force reflow
    v.classList.add("floating");
  }, 1350);
});

function scrollToLogin() {
  document.getElementById("login").scrollIntoView({ behavior: "smooth" });
}

function switchTab(tab) {
  const isLogin = tab === "login";
  document.getElementById("loginForm").style.display = isLogin ? "" : "none";
  document.getElementById("registerForm").style.display = isLogin ? "none" : "";
  document.getElementById("tabLogin").classList.toggle("active", isLogin);
  document.getElementById("tabRegister").classList.toggle("active", !isLogin);
  hideError();
}

function showError(msg) {
  const el = document.getElementById("errorMsg");
  el.textContent = msg;
  el.style.display = "block";
}

function hideError() {
  document.getElementById("errorMsg").style.display = "none";
}

/* ---- Storage helpers (landing.html doesn't load core.js) ---- */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("nfm_users")) || {};
  } catch {
    return {};
  }
}
function saveUsers(u) {
  localStorage.setItem("nfm_users", JSON.stringify(u));
}

/* ---- Simple hash using btoa — consistent encode/decode ---- */
function hashPass(p) {
  return btoa(unescape(encodeURIComponent(p)));
}

/* ---- SIGN IN ---- */
function doLogin() {
  const user = document.getElementById("loginUser").value.trim().toLowerCase();
  const pass = document.getElementById("loginPass").value;
  if (!user || !pass) {
    showError("Please enter your username and password.");
    return;
  }
  const users = getUsers();
  if (!users[user]) {
    showError("Username not found. Please register first.");
    return;
  }
  if (users[user].password !== hashPass(pass)) {
    showError("Incorrect password. Please try again.");
    return;
  }
  /* Save session then redirect to dashboard */
  localStorage.setItem(
    "nfm_session",
    JSON.stringify({
      user,
      name: users[user].name,
      loginTime: Date.now(),
    }),
  );
  window.location.href = "index.html";
}

/* ---- REGISTER ---- */
function doRegister() {
  const name = document.getElementById("regName").value.trim();
  const user = document.getElementById("regUser").value.trim().toLowerCase();
  const pass = document.getElementById("regPass").value;
  const pass2 = document.getElementById("regPass2").value;
  if (!user || !pass) {
    showError("Username and password are required.");
    return;
  }
  if (user.length < 3) {
    showError("Username must be at least 3 characters.");
    return;
  }
  if (pass.length < 4) {
    showError("Password must be at least 4 characters.");
    return;
  }
  if (pass !== pass2) {
    showError("Passwords do not match.");
    return;
  }
  const users = getUsers();
  if (users[user]) {
    showError("This username is already taken. Choose another.");
    return;
  }
  /* Save new user */
  users[user] = {
    name: name || user,
    password: hashPass(pass),
    createdAt: Date.now(),
  };
  saveUsers(users);
  /* Auto-login after register */
  localStorage.setItem(
    "nfm_session",
    JSON.stringify({
      user,
      name: users[user].name,
      loginTime: Date.now(),
    }),
  );
  window.location.href = "index.html";
}

/* ---- Enter key support ---- */
document.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  const loginVisible =
    document.getElementById("loginForm").style.display !== "none";
  if (loginVisible) doLogin();
  else doRegister();
});

/* ---- If already logged in, skip landing and go straight to dashboard ---- */
(function checkExistingSession() {
  try {
    const s = JSON.parse(localStorage.getItem("nfm_session"));
    if (s && s.user) window.location.href = "index.html";
  } catch {}
})();
lucide.createIcons();
