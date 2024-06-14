//<!Nir Hazan 316009489 Omer Bidoush 311528657 ,  NIROhazan.github.io >
document.addEventListener("DOMContentLoaded", function () {
  alert("Welcome , Please Register ! ");
  var registrationForm = document.getElementById("registrationForm");
  registrationForm.addEventListener("submit", function (event) {
    // Prevent the form from submitting initially in each part

    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    // Validate first name
    if (!firstName) {
      event.preventDefault();
      document
        .getElementById("firstName")
        .setCustomValidity("Must enter first name.");
      return;
    } else {
      document.getElementById("firstName").setCustomValidity("");
    }

    // Validate last name
    if (!lastName) {
      event.preventDefault();
      document
        .getElementById("lastName")
        .setCustomValidity("Must enter last name.");
      return;
    } else {
      document.getElementById("lastName").setCustomValidity("");
    }

    // Validate password length
    if (password.length < 8) {
      event.preventDefault();
      document
        .getElementById("passwordError")
        .setCustomValidity("Password must be at least 8 characters long.");
      return;
    } else {
      document.getElementById("password").setCustomValidity("");
    }

    // Validate password match
    if (password !== confirmPassword) {
      event.preventDefault();
      document
        .getElementById("confirmPassword")
        .setCustomValidity("Passwords don't match.");
      return;
    } else {
      document.getElementById("confirmPassword").setCustomValidity("");
    }

    // If all validations pass, submit the form
  });

  // Event listener for email input to check if email exists
  document.getElementById("email").addEventListener("blur", checkEmail);
});
document
  .getElementById("deleteForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data); // Display server response
        if (response.ok) {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error deleting user");
      });
  });
async function checkEmail() {
  const emailInput = document.getElementById("email");
  const email = emailInput.value;
  const emailError = document.getElementById("emailError");

  try {
    const response = await fetch("/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const data = await response.text();

    if (response.ok) {
      // Email is available
      emailError.textContent = "";
      emailInput.setCustomValidity("");
      return true;
    } else if (response.status === 409) {
      // Email already exists
      emailError.textContent = "Email already exists.";
      emailInput.setCustomValidity("Email already exists.");
      return false;
    } else {
      // Handle other errors
      console.error("Server responded with error:", data);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}
