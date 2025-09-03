import express from "express";
import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";
import cloudinary from "../cloudinary.js";
import auth from "../middleware/auth.js";
import { limiter } from "../middleware/limiter.js";
import { upload } from "../middleware/upload.js";
import { Discussion, discussValidate } from "../models/discussion.js";
import { Tag } from "../models/tags.js";
import { getAllDiscussions } from "../controllers/discussion.js";

const router = express.Router();

router.get("/", auth, getAllDiscussions);

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Discussion.findById(id);
  res.json(result);
});

router.post("/", [auth, limiter], upload.single("image"), async (req, res) => {
  const error = discussValidate({ ...req.body, userId: req.user._id });
  if (error) return res.status(400).send(error);
  const cleanBody = sanitizeHtml(req.body.body, {
    allowedTags: [
      "a",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt"],
      code: ["class"],
      pre: ["class"],
      span: [],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    enforceHtmlBoundary: true,
  });
  let imageUrl = null;

  // if an image is uploaded
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "discussions", // optional: organize in folder
      resource_type: "image",
    });
    imageUrl = result.secure_url;
  }

  const allTags = await Promise.all(
    req.body.tagId.map(async (tag) => {
      const tagin = await Tag.findById(tag);
      if (!tagin) throw new Error("No such tag exists with the given id");
      await Tag.updateOne({ _id: tagin._id }, { $inc: { questionCounter: 1 } });
      return tagin;
    })
  );
  // console.log(allTags);
  const discussion = new Discussion({
    title: req.body.title,
    body: cleanBody,
    user: { _id: req.user._id },
    tags: allTags,
    image: imageUrl,
  });
  await discussion.save();
  res.json({ data: discussion });
});
router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const discuss = await Discussion.findById(id);
  if (!discuss) return res.status(400).send("No such discussion exits");
  if (discuss.user._id.toString() !== req.user._id.toString())
    return res.status(403).send("Forbidden");
  const deleted = await Discussion.findByIdAndDelete(id);
  res.json(deleted);
});

export default router;
