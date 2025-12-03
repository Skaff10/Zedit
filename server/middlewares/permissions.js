const Document = require("../models/documentModel");
const requirePermission =
  (required = "edit") =>
  async (req, res, next) => {
    const docId = req.params.id || req.body.documentId;
    if (!docId)
      return res.status(400).json({ error: "Document ID is required" });
    const document = await Document.findById(docId);
    if (!document) return res.status(404).json({ error: "Document not found" });

    const isOwner = document.owner.toString() === req.user._id.toString();
    if (isOwner) return next();

    const isCollaborator = document.collaborators.find(
      (collaborator) =>
        collaborator.userId.toString() === req.user._id.toString()
    );

    const permissionRank = { view: 0, edit: 1 };
    if (permissionRank[collaborator.permission] < permissionRank[required]) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };

module.exports = requirePermission;
