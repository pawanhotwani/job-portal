function searchInternship() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let internships = document.querySelectorAll(".internship");

    internships.forEach((internship) => {
        let title = internship.getAttribute("data-title").toLowerCase();
        let company = internship.getAttribute("data-company").toLowerCase();
        let location = internship.getAttribute("data-location").toLowerCase();

        if (title.includes(input) || company.includes(input) || location.includes(input)) {
            internship.style.display = "block";
        } else {
            internship.style.display = "none";
        }
    });
}


async function register() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    document.getElementById("signupMessage").innerText = data.message;
}

async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    document.getElementById("loginMessage").innerText = data.message;

    if (data.token) {
        localStorage.setItem("authToken", data.token);
        window.location.href = "dashboard.html";
    }
}

// Get modal elements
const modal = document.getElementById("jobModal");
const closeBtn = document.querySelector(".close");
const applyButtons = document.querySelectorAll(".apply-btn");

// Elements inside modal
const modalTitle = document.getElementById("modal-title");
const modalCompany = document.getElementById("modal-company");
const modalLocation = document.getElementById("modal-location");
const modalStipend = document.getElementById("modal-stipend");
const confirmApplyBtn = document.getElementById("confirmApply");

// Function to show modal with job details
applyButtons.forEach(button => {
    button.addEventListener("click", function() {
        const jobCard = this.parentElement;
        modalTitle.innerText = jobCard.getAttribute("data-title");
        modalCompany.innerText = jobCard.getAttribute("data-company");
        modalLocation.innerText = jobCard.getAttribute("data-location");
        modalStipend.innerText = jobCard.getAttribute("data-stipend");

        modal.style.display = "block";
    });
});
