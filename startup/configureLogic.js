export default function () {
  if (!process.env.forumly_jwtPrivateKey) throw new Error("Fatal Error");
}
