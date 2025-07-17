// --- Nav Rendering (no profile image) ---
function renderNavActions() {
  const navActions = document.getElementById("navActions");
  if (!navActions) return;
  const loggedInType = localStorage.getItem("loggedInType");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  if (loggedInType === "student" || loggedInType === "company") {
    navActions.innerHTML = `
      <span style="font-weight:500;">${loggedInUser.name}</span>
      <a href="#" onclick="logout();" class="nav-btn">Logout</a>
    `;
  } else {
    navActions.innerHTML = `
      <a href="register.html" class="nav-btn">Register</a>
      <a href="login.html" class="nav-btn nav-btn-outline">Login</a>
    `;
  }
}
document.addEventListener("DOMContentLoaded", renderNavActions);

// --- Logout ---
function logout() {
  localStorage.removeItem("loggedInType");
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// --- Registration Form Toggle ---
function toggleRegisterForm() {
  const type = document.getElementById("registerType").value;
  document.getElementById("studentRegisterForm").style.display = type === "student" ? "block" : "none";
  document.getElementById("companyRegisterForm").style.display = type === "company" ? "block" : "none";
}

// --- Student Registration --- (localStorage, unchanged)
if (document.getElementById("studentRegisterForm")) {
  document.getElementById("studentRegisterForm").onsubmit = function (e) {
    e.preventDefault();
    const email = document.getElementById("studentEmail").value.trim().toLowerCase();
    const emailConfirm = document.getElementById("studentEmailConfirm").value.trim().toLowerCase();
    if (email !== emailConfirm) {
      alert("Email addresses do not match.");
      return;
    }
    let students = JSON.parse(localStorage.getItem("students")) || [];
    if (students.some(s => s.email === email)) {
      alert("Email already registered.");
      return;
    }
    const newStudent = {
      name: document.getElementById("studentName").value,
      email: email,
      index: document.getElementById("studentIndexNumber").value,
      password: document.getElementById("studentPassword").value,
      studentIdPic: ""
    };
    const fileInput = document.getElementById("studentIdPic");
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        newStudent.studentIdPic = evt.target.result;
        students.push(newStudent);
        localStorage.setItem("students", JSON.stringify(students));
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      alert("Please upload your Student ID picture.");
    }
  };
}

// --- Company Registration --- (localStorage, unchanged)
if (document.getElementById("companyRegisterForm")) {
  document.getElementById("companyRegisterForm").onsubmit = function (e) {
    e.preventDefault();
    const email = document.getElementById("companyEmail").value.trim().toLowerCase();
    const emailConfirm = document.getElementById("companyEmailConfirm").value.trim().toLowerCase();
    if (email !== emailConfirm) {
      alert("Email addresses do not match.");
      return;
    }
    let companiesList = JSON.parse(localStorage.getItem("companiesList")) || [];
    if (companiesList.some(c => c.email === email)) {
      alert("Email already registered.");
      return;
    }
    const newCompany = {
      name: document.getElementById("companyName").value,
      email: email,
      password: document.getElementById("companyPassword").value,
      permitFile: ""
    };
    const fileInput = document.getElementById("companyPermitFile");
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        newCompany.permitFile = evt.target.result;
        companiesList.push(newCompany);
        localStorage.setItem("companiesList", JSON.stringify(companiesList));
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      alert("Please upload proof of permit/registration.");
    }
  };
}

// --- Login Form --- (localStorage, unchanged)
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").onsubmit = function (e) {
    e.preventDefault();
    const userType = document.getElementById("loginType").value;
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const emailConfirm = document.getElementById("loginEmailConfirm").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    if (email !== emailConfirm) {
      alert("Email addresses do not match.");
      return;
    }
    let users = JSON.parse(localStorage.getItem(userType === "student" ? "students" : "companiesList")) || [];
    let user = users.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("loggedInType", userType);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = userType === "student" ? "dashboard.html" : "company-dashboard.html";
    } else {
      alert("Invalid login. Please check your credentials.");
    }
  };
}

// --- Show Add Listing Form for Company ---
function showAddListingForm() {
  document.getElementById("addListingForm").style.display = "block";
}

// --- Company Dashboard: Internship Posting (Firebase Firestore version) ---
if (document.getElementById("companyListingForm")) {
  document.getElementById("companyListingForm").onsubmit = function (e) {
    e.preventDefault();
    const title = document.getElementById("listingTitle").value;
    const desc = document.getElementById("listingDesc").value;
    const location = document.getElementById("listingLocation").value;
    const requirements = document.getElementById("listingReqs").value;
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    // Post listing to Firestore
    db.collection("internships").add({
      company: loggedInUser.name,
      title,
      desc,
      location,
      requirements,
      postedBy: loggedInUser.email,
      postedAt: new Date(),
      applications: []
    }).then(() => {
      document.getElementById("companyListingForm").reset();
      document.getElementById("addListingForm").style.display = "none";
      renderCompanyListings();
      alert("Listing posted!");
    }).catch((error) => {
      alert("Error posting listing: " + error);
    });
  };
}

// --- Render Company Listings (Firebase Firestore version) ---
function renderCompanyListings() {
  const listingsDiv = document.getElementById("companyListingList");
  if (!listingsDiv) return;
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  db.collection("internships").where("postedBy", "==", loggedInUser.email).get()
    .then((querySnapshot) => {
      let html = "";
      if (querySnapshot.empty) {
        html = "<p>No listings yet.</p>";
      } else {
        querySnapshot.forEach((doc) => {
          const listing = doc.data();
          html += `
            <div class="listing-card">
              <h4>${listing.title}</h4>
              <p><strong>Description:</strong> ${listing.desc}</p>
              <p><strong>Location:</strong> ${listing.location}</p>
              <p><strong>Requirements:</strong> ${listing.requirements}</p>
            </div>
          `;
        });
      }
      listingsDiv.innerHTML = html;
    })
    .catch((error) => {
      listingsDiv.innerHTML = "<p>Error loading listings.</p>";
      console.error("Error getting listings: ", error);
    });
}
if (document.getElementById("companyListingList")) {
  renderCompanyListings();
}
    </div>
  `).join("");
}
if (document.getElementById("companyListingList")) {
  renderCompanyListings();
}
