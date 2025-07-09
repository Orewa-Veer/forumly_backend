import mongoose from "mongoose";
const upvotesSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true },
});
export default upvotesSchema;
