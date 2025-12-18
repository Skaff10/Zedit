const Board = require("../models/boardModel");
const asyncHandler = require("express-async-handler");

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
const createBoard = asyncHandler(async (req, res) => {
  const { name, isPrivate, collaborators } = req.body;

  const board = await Board.create({
    name: name || "Untitled Board",
    owner: req.user._id,
    isPrivate: isPrivate !== undefined ? isPrivate : true,
    collaborators: collaborators || [],
  });

  res.status(201).json(board);
});

// @desc    Get all boards for current user
// @route   GET /api/boards
// @access  Private
const getUserBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({
    $or: [{ owner: req.user._id }, { "collaborators.userId": req.user._id }],
  })
    .populate("owner", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(boards);
});

// @desc    Get single board by ID
// @route   GET /api/boards/:id
// @access  Private
const getBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id).populate("owner", "name");

  if (!board) {
    return res.status(404).json({ error: "Board not found" });
  }

  const ownerId = board.owner._id
    ? board.owner._id.toString()
    : board.owner.toString();
  const isOwner = ownerId === req.user._id.toString();
  const isCollaborator = board.collaborators.some(
    (c) => c.userId && c.userId.toString() === req.user._id.toString()
  );

  if (!isOwner && !isCollaborator && board.isPrivate) {
    return res.status(403).json({ error: "Access denied" });
  }

  res.status(200).json(board);
});

// @desc    Update a board
// @route   PUT /api/boards/:id
// @access  Private
const updateBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    return res.status(404).json({ error: "Board not found" });
  }

  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner) {
    return res.status(403).json({ error: "Only owner can update board" });
  }

  if (req.body.name) board.name = req.body.name;
  if (req.body.isPrivate !== undefined) board.isPrivate = req.body.isPrivate;
  if (req.body.collaborators) board.collaborators = req.body.collaborators;

  await board.save();
  res.status(200).json(board);
});

// @desc    Delete a board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    return res.status(404).json({ error: "Board not found" });
  }

  const isOwner = board.owner.toString() === req.user._id.toString();

  if (!isOwner) {
    return res.status(403).json({ error: "Only owner can delete board" });
  }

  await Board.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Board deleted", id: req.params.id });
});

module.exports = {
  createBoard,
  getUserBoards,
  getBoard,
  updateBoard,
  deleteBoard,
};
