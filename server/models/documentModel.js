const mongoose = require("mongoose");

const collaboratorSchema = new mongoose.Schema(
  {
    userId: { type: String, enum: ["view", "edit"], default: "view" },
  },
  { _id: false },
);

const documentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Object,
    default: {},
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collaborators: [[collaboratorSchema]],
  lastModified: {
    type: Date,
    default: Date.now,
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    default: null,
  },
  status: {
    type: String,
    enum: ["draft", "review", "in review", "published", "stable"],
    default: "draft",
  },
});
module.exports = mongoose.model("Document", documentSchema);
