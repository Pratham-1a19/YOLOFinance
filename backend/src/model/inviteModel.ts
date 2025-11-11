import { Schema, model } from "mongoose";

const inviteSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverEmail: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
});

const Invite = model('invites', inviteSchema);
export default Invite;