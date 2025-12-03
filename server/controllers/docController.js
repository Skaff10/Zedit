const Document = require("../models/documentModel");
const asyncHandler = require("express-async-handler");
const createDocument = asyncHandler(async (req, res) => {
  const document = await Document.create({
    owner: req.user._id,
    title: req.body.title || "Untitled Document",
  });
  res.status(201).json(document);
});

const getDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id).populate("owner", "name");
  if (!doc) return res.status(404).json({ error: "Document not found" });

  const isOwner = doc.owner.toString() === req.user._id.toString();
  const isCollaborator = doc.collaborators.some(
    (c) => c.userId.toString() === req.user._id.toString()
  );

  if (!isOwner && !isCollaborator)
    return res.status(403).json({ error: "Access denied" });

  res.status(200).json(doc);
});

const updateDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });

  doc.content = req.body.content;
  doc.lastModified = Date.now();
  await doc.save();

  res.status(200).json(doc);
});

const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });
  res.status(200).json(doc);
});

module.exports = {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
};
