const Version = require("../models/versionModel");
const asyncHandler = require("express-async-handler");
const saveVersion = asyncHandler(async (req, res) => {
  const { snapshotBuffer } = req.body;
  const version = await Version.create({
    documentId: req.params.id,
    createdBy: req.user._id,
    snapshot: Buffer.from(snapshotBuffer),
  });
  res.status(201).json(version);
});
const listVersions = asyncHandler(async (req, res) => {
  const versions = await Version.find({ documentId: req.params.id })
    .sort({ createdAt: -1 })
    .populate("createdBy", "name ");
  res.status(200).json(versions);
});

const restoreVersion = asyncHandler(async (req, res) => {
  const version = await Version.findById(req.params.id);
  if (!version) return res.status(404).json({ error: "Version not found" });

  res.status(200).json({
    snapshotBuffer: version.snapshot,
  });
});

module.exports = {
  saveVersion,
  listVersions,
  restoreVersion,
};
