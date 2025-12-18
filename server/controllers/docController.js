const Document = require("../models/documentModel");
const asyncHandler = require("express-async-handler");

const createDocument = asyncHandler(async (req, res) => {
  const document = await Document.create({
    owner: req.user._id,
    title: req.body.title || "Untitled Document",
    content: req.body.content || {},
    status: req.body.status || "draft",
    boardId: req.body.boardId || null,
  });
  res.status(201).json(document);
});

const getDocumentsByBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const docs = await Document.find({
    boardId: boardId,
    $or: [{ owner: req.user._id }, { "collaborators.userId": req.user._id }],
  })
    .populate("owner", "name")
    .sort({ lastModified: -1 });

  res.status(200).json(docs);
});

const getDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id).populate("owner", "name");
  if (!doc) return res.status(404).json({ error: "Document not found" });

  // owner is populated, so use doc.owner._id
  const ownerId = doc.owner._id
    ? doc.owner._id.toString()
    : doc.owner.toString();
  const isOwner = ownerId === req.user._id.toString();
  const isCollaborator = doc.collaborators.some(
    (c) => c.userId.toString() === req.user._id.toString()
  );

  if (!isOwner && !isCollaborator)
    return res.status(403).json({ error: "Access denied" });

  res.status(200).json(doc);
});

const getUserDocuments = asyncHandler(async (req, res) => {
  // Find documents where the user is the owner OR a collaborator
  const docs = await Document.find({
    $or: [{ owner: req.user._id }, { "collaborators.userId": req.user._id }],
  })
    .populate("owner", "name")
    .sort({ lastModified: -1 });

  res.status(200).json(docs);
});

const updateDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });

  // Check permissions (Owner or Edit access collaborator)
  const isOwner = doc.owner.toString() === req.user._id.toString();
  // Simple collaborator check for now - generally might want to distinguish 'view' vs 'edit'
  const isCollaborator = doc.collaborators.some(
    (c) => c.userId.toString() === req.user._id.toString()
  );

  if (!isOwner && !isCollaborator) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (req.body.title) doc.title = req.body.title;
  if (req.body.content) doc.content = req.body.content;
  if (req.body.status) doc.status = req.body.status;

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
  getUserDocuments,
  getDocumentsByBoard,
  updateDocument,
  deleteDocument,
};
