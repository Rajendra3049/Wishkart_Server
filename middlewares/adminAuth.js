const jwt = require("jsonwebtoken");

async function adminAuth(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "wishkart", function (err, decoded) {
      next();
    });
  } else {
    res
      .status(401)
      .send({ status: false, msg: "You are not authorized, Please login" });
  }
}

module.exports = { adminAuth };
