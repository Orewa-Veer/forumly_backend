export default function admin(req, res, next) {
  if (req.user.admin) next();
  else return res.status(403).json({ error: "Forbidden" });
}
