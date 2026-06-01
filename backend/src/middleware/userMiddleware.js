const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const userMiddleware = async (req, res, next) => {
  let token;
  //finding the token in the req.headers.authorization for the user
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    //fallback
    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }
  }
  //if token is not found in the cookies
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not finding the token in cookies" });
  }
  //verify the jwt token with process.env.JWT_SECRET
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //Attempting to find the user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = userMiddleware;
 