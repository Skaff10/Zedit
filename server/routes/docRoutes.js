const express = require("express");
const router = express.Router();
const {
  createDocument,
  getDocument,
  getUserDocuments,
  updateDocument,
  deleteDocument,
} = require("../controllers/docController");
const protect = require("../middlewares/auth");

router.route("/").post(protect, createDocument).get(protect, getUserDocuments);
router
  .route("/:id")
  .get(protect, getDocument)
  .put(protect, updateDocument)
  .delete(protect, deleteDocument);

module.exports = router;
