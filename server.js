//<!Nir Hazan 316009489 Omer Bidoush 311528657 ,  NIROhazan.github.io >
const express = require("express");
const mongojs = require("mongojs");
const { userInfo } = require("os");
const path = require("path");
const crypto = require("crypto");
// MongoDB connection
const db = mongojs(
  "mongodb+srv://Student:webdev2024student@cluster0.uqyflra.mongodb.net/webdev2024",
  ["mitzinet_<Nir_Hazan_Omer_Bidoush>"]
);

const users = db.collection("mitzinet_<Nir_Hazan_Omer_Bidoush>");

const app = express();
app.use(express.json()); // Middleware to parse JSON body
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'static' directory
app.use(express.static(path.join(__dirname, "static")));
// Hashing function
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}
//Delete user
app.post("/delete-user", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  users.findOne({ email: email }, (err, user) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database error");
    }
    if (!user) {
      return res.status(404).send("User not found");
    }
    const hashedPassword = hashPassword(password); // Hashing the provided password

    if (user.password !== hashedPassword) {
      return res.status(401).send("Incorrect password");
    }

    users.remove({ email: email }, (err, doc) => {
      if (err) {
        console.error("Error deleting user from database:", err);
        return res.status(500).send("Error deleting user");
      }
      return res.status(200).send("User deleted successfully");
    });
  });
});

// Check if email exists
app.post("/check-email", (req, res) => {
  const email = req.body.email;
  users.findOne({ email: email }, (err, user) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).send("Database error");
    } else if (user) {
      res.status(409).send("Email already exists");
      return false;
    } else {
      res.status(200).send("Email is available");
      return true;
    }
  });
});
// Handle form submission
app.post("/register", (req, res) => {
  const { firstName, lastName, phoneNumber, email, password, confirmPassword } =
    req.body;

  // Validation checks
  if (!email || !email.includes("@") || !email.includes(".")) {
    return res
      .status(400)
      .send(
        '<script>alert("Invalid email format"); window.location.href="/";</script>'
      );
  }
  if (!firstName || !lastName) {
    return res
      .status(400)
      .send(
        '<script>alert("must be first and last name"); window.location.href="/";</script>'
      );
  }
  if (password.length < 8) {
    return res
      .status(400)
      .send(
        '<script>alert("Password must be at least 8 characters long"); window.location.href="/";</script>'
      );
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .send(
        '<script>alert("Passwords do not match"); window.location.href="/";</script>'
      );
  }

  // Hash the password before saving it to the database
  const hashedPassword = hashPassword(password);

  // Check if email already exists
  users.findOne({ email: email }, (err, doc) => {
    if (err) {
      console.error("Error saving user to database:", err);
      return res
        .status(500)
        .send(
          '<script>alert("User registration failed"); window.location.href="/";</script>'
        );
    }
    if (doc) {
      return res
        .status(400)
        .send(
          '<script>alert("Email already registered"); window.location.href="/";</script>'
        );
    } else {
      // If all validations pass and email doesn't exist, insert the new user with hashed password
      const newUser = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        password: hashedPassword, // Save hashed password to the database
      };

      users.insert(newUser, (err, doc) => {
        if (err) {
          console.error("Error saving user to database:", err);
          return res
            .status(500)
            .send(
              '<script>alert("User registration failed"); window.location.href="/";</script>'
            );
        }
        return res
          .status(200)
          .send(
            '<script>alert("User registered successfully"); window.location.href="/";</script>'
          );
      });
    }
  });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

