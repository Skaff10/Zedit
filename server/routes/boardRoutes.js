const express = require("express");
const router = express.Router();
const {
  createBoard,
  getUserBoards,
  getBoard,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");
const protect = require("../middlewares/auth");

router.route("/").get(protect, getUserBoards).post(protect, createBoard);
router
  .route("/:id")
  .get(protect, getBoard)
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);

module.exports = router;
