const express = require("express");
const app = express();
// const courseData = require("./courses.json");
const fs = require("fs");
// const Validator = require("./helpers/validator");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/authJWT");
const user = require("./models/user");
const axios = require("axios");
const PORT = 800;
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", () => {});

app.post("/register", (req, res) => {
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role,
    preference: req.body.preference,
  });
  user
    .save()
    .then((data) => {
      return res.status(200).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

app.post("/login", (req, res) => {
  let emailPassed = req.body.email;
  let passwordPassed = req.body.password;
  User.findOne({
    email: emailPassed,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      var isPasswordValid = bcrypt.compareSync(passwordPassed, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({
          message: "Invalid Password",
        });
      } else {
        var token = jwt.sign(
          {
            id: user.id,
          },
          process.env.API_SECRET,
          {
            expiresIn: 86400,
          }
        );
        console.log("here");
        return res.status(200).send({
          user: {
            id: user.id,
          },
          message: "Login successful",
          accessToken: token,
        });
      }
    })
    .catch((err) => {});
});

app.get("/preferences", verifyToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: req.message });
  }

  return res.status(200).json({ preferences: req.user.preference });
});

// Update news preferences for the logged-in user
app.put("/preferences", verifyToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: req.message });
  }

  const { preference } = req.body;

  // Ensure preferences is an array
  if (!Array.isArray(preference)) {
    return res.status(400).json({ message: "Preferences should be an array" });
  }

  User.findOneAndUpdate(
    { email: req.user.email },
    { preference: preference }, // Update preferences with the new array
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "Preferences updated successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// Fetch news articles based on the logged-in user's preferences
app.get("/news", verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: req.message });
  }

  try {
    const user = req.user;
    console.log(user.preference);
    if (!user.preference || user.preference.length === 0) {
      return res.status(400).json({ message: "User preferences not set" });
    }

    // Fetch news based on each user preference
    const promises = user.preference.map(async (preference) => {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${preference}&apiKey=cf697494a1d04862851efa4fda6060e0`
      );
      return response.data.articles;
    });

    // Wait for all requests to finish
    const newsArticlesArrays = await Promise.all(promises);

    // Concatenate arrays of news articles
    const newsArticles = newsArticlesArrays.reduce(
      (acc, curr) => acc.concat(curr),
      []
    );

    return res.status(200).json({ articles: newsArticles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/news2", verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: req.message });
  }

  try {
    const user = req.user;
    if (!user.preference) {
      return res.status(400).json({ message: "User preferences not set" });
    }

    // Fetch news based on user preferences
    const response = await axios.get(
      // https://newsapi.org/v2/everything?q=tesla&from=2024-04-13&sortBy=publishedAt&apiKey=cf697494a1d04862851efa4fda6060e0
      `https://newsapi.org/v2/everything?q=${user.preference}&apiKey=cf697494a1d04862851efa4fda6060e0`
    );
    const newsArticles = response.data.articles;

    return res.status(200).json({ articles: newsArticles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

try {
  mongoose.connect("mongodb://localhost:27017/usersdb");
} catch (err) {
  console.log("Failed while connecting to mongodb");
}
app.listen(PORT, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${PORT}`);
});

module.exports = app;
