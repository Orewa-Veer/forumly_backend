import mongoose from "mongoose";
import { Discussion } from "../models/discussion.js";
import { Notification } from "../models/notifications.js";
import { Upvote } from "../models/upvotes.js";

async function getUpvotedDiscussion(req, res) {
    const upvotes = await Upvote.find({ user_id: req.user._id }).lean();
    const dicussionIds = upvotes.map((up) => up.parent_id);
    const discussions = await Discussion.find({ _id: { $in: dicussionIds } });
    return res.json({ data: discussions });
}

async function postUpvote(req, res) {
    const discussId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(discussId))
        return res.status(400).json({ error: "Invalid Discussion id" });

    const discuss = await Discussion.findById(discussId);
    if (!discuss)
        return res
            .status(404)
            .json({ error: "No such discussion found with the given Id" });
    const removed = await Upvote.findOneAndDelete({
        user_id: req.user._id,
        parent_id: discuss._id,
    });
    let updateCounter = 0;
    if (removed) {
        updateCounter = -1;
        await Notification.findOneAndDelete({ typeId: removed._id });
    } else {
        const upvote = new Upvote({
            user_id: req.user._id,
            parent_id: discuss._id,
        });
        await upvote.save();
        updateCounter = 1;
        const newNotific = await Notification.create({
            userId: discuss.user,
            type: "upvote",
            typeId: upvote._id,
            discussId: discuss._id,
        });
        req.io.to(`room:${discuss.user}`).emit("notification:new", newNotific);
    }
    await Discussion.updateOne(
        { _id: discussId },
        { $inc: { upvoteCounter: updateCounter } }
    );
    const updatedDiscuss = await Discussion.findById(discussId).populate({
        path: "user",
        select: "username",
    });

    req.io.to("questions:join").emit("discussions:updated", updatedDiscuss);
    return res.json({
        status: removed ? "removed" : "added",
        upvoteCounter: updatedDiscuss.upvoteCounter,
    });
}

export { getUpvotedDiscussion, postUpvote };
