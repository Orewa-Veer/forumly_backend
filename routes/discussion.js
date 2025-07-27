import express from "express";
import { Discussion, discussValidate } from "../models/Discussion.js";
import { User } from "../models/register.js";
import { Tag } from "../models/tags.js";
import sanitizeHtml from "sanitize-html";
import auth from "../middleware/auth.js";
import mongoose from "mongoose";
const router = express.Router();
router.get("/", auth, async (req, res) => {
  const {
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
    ...filters
  } = req.query;

  const sortOrder = order === "asc" ? 1 : -1;
  const pageNum = Math.max(1, parseInt(page));
  const pageLim = Math.min(Math.max(10, parseInt(limit)), 100);
  // console.log(filters);
  // creating filters
  const filter = {};
  if (filters.user && mongoose.isValidObjectId(filters.user)) {
    filter.user = new mongoose.Types.ObjectId(filters.user);
  }
  // if (filters["tags._id"] && mongoose.isValidObjectId(filters[tags._id])) {
  //   filter["tags._id"] = new mongoose.Types.ObjectId(filter["tags._id"]);
  // }
  if (filters.isSolved) {
    filter.isSolved = filters.isSolved === "true";
  }
  if (filters.title) {
    filter.title = { $regex: filters.title, $options: "i" };
  }
  const totalDocs = await Discussion.countDocuments(filter);
  const totalPages =
    totalDocs === 0 ? 0 : Math.floor((totalDocs - 1) / limit) + 1;
  // console.log(totalPages);
  // console.log(sort);
  const result = await Discussion.find({ ...filter })
    .populate({ path: "user", select: "username" })
    .sort({ [sort]: sortOrder })
    .limit(pageLim)
    .skip((pageNum - 1) * pageLim);
  res.json({ data: result, totalPages });
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Discussion.findById(id);
  res.json(result);
});
router.post("/", auth, async (req, res) => {
  const error = discussValidate({ ...req.body, userId: req.user._id });
  if (error) return res.status(400).send(error);
  const cleanBody = sanitizeHtml(req.body.body, {
    allowedTags: [
      "b",
      "i",
      "em",
      "strong",
      "u",
      "a",
      "ul",
      "ol",
      "li",
      "p",
      "br",
      "span",
      "blockquote",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      span: ["style"],
      "*": ["style"], // optional, only if you're allowing inline styles
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  const allTags = await Promise.all(
    req.body.tagId.map(async (tag) => {
      const tagin = await Tag.findById(tag);
      if (!tagin) throw new Error("No such tag exists with the given id");

      return tagin;
    })
  );
  // console.log(allTags);
  const discussion = new Discussion({
    title: req.body.title,
    body: cleanBody,
    user: { _id: req.user._id },
    tags: allTags,
  });
  await discussion.save();
  res.send(discussion);
});
router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const discuss = await Discussion.findById(id);
  if (!discuss) return res.status(400).send("No such discussion exits");
  if (discuss._id !== req.user._id) return res.status(403).send("Forbidden");
  const deleted = await Discussion.findByIdAndDelete(id);
  res.json(deleted);
});
export default router;
