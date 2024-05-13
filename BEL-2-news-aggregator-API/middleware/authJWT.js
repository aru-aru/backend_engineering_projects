const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    jwt.verify(
      req.headers.authorization,
      process.env.API_SECRET,
      function (err, decoded) {
        if (err) {
          req.user = undefined;
          req.message = "Header verification failed";
          next();
        } else {
          User.findOne({
            _id: decoded.id,
          })
            .then((user) => {
              req.user = user;
              req.message =
                "Found the user succcessfully, user has valid login token";
              next();
            })
            .catch((err) => {
              req.user = undefined;

              req.message =
                "Something went wrong while fetching the user information";
              next();
            });
        }
      }
    );
  } else {
    req.user = undefined;
    req.message = "Authorization header not found";
    next();
  }
};

module.exports = verifyToken;
