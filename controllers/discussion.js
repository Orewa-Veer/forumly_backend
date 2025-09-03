import mongoose from "mongoose";
import { Discussion } from "../models/discussion.js";
async function getAllDiscussions(req, res) {
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
        filter.user = new mongoose.Types.ObjectId(`${filters.user}`);
    }
    if (filters["tagId"] && mongoose.isValidObjectId(filters["tagId"])) {
        filter["tags._id"] = new mongoose.Types.ObjectId(`${filters["tagId"]}`);
    }
    if (filters.isSolved) {
        filter.isSolved = filters.isSolved === "true";
    }
    if (filters.title) {
        filter.title = { $regex: filters.title, $options: "i" };
    }
    const totalDocs = await Discussion.countDocuments(filter);
    const totalPages =
        totalDocs === 0 ? 0 : Math.floor((totalDocs - 1) / pageLim) + 1;
    // console.log(totalPages);
    // console.log(sort);
    const result = await Discussion.find({ ...filter })
        .populate({ path: "user", select: "username" })
        .sort({ [sort]: sortOrder })
        .limit(pageLim)
        .skip((pageNum - 1) * pageLim);
    res.json({ data: result, totalPages });
}
export { getAllDiscussions }