import jwt from "jsonwebtoken";
import config from "config";
export default function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access Denied. No token provided");
  try {
    const decoded = jwt.verify(token, process.env.forumly_jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}
