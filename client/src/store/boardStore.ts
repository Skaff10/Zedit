import { create } from "zustand";
import boardService from "../features/boards/boardService";
import { toast } from "react-toastify";

interface Board {
  _id: string;
  name: string;
  owner: { _id: string; name: string } | string;
  collaborators: Array<{ userId: string; permission: string }>;
  isPrivate: boolean;
  createdAt: string;
}

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  createBoard: (boardData: {
    name: string;
    isPrivate?: boolean;
  }) => Promise<Board | null>;
  getUserBoards: () => Promise<void>;
  getBoard: (id: string) => Promise<Board | null>;
  updateBoard: (
    id: string,
    boardData: { name?: string; isPrivate?: boolean }
  ) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  reset: () => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  currentBoard: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",

  createBoard: async (boardData) => {
    try {
      set({ isLoading: true });
      const board = await boardService.createBoard(boardData);
      set((state) => ({
        boards: [board, ...state.boards],
        isLoading: false,
        isSuccess: true,
      }));
      toast.success("Board created successfully!");
      return board;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({
        isError: true,
        isLoading: false,
        isSuccess: false,
        message,
      });
      toast.error(message);
      return null;
    }
  },

  getUserBoards: async () => {
    try {
      set({ isLoading: true });
      const boards = await boardService.getUserBoards();
      set({
        boards,
        isLoading: false,
        isSuccess: true,
      });
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({
        isError: true,
        isLoading: false,
        isSuccess: false,
        message,
      });
      toast.error(message);
    }
  },

  getBoard: async (id: string) => {
    try {
      set({ isLoading: true });
      const board = await boardService.getBoard(id);
      set({
        currentBoard: board,
        isLoading: false,
        isSuccess: true,
      });
      return board;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({
        isError: true,
        isLoading: false,
        isSuccess: false,
        message,
      });
      toast.error(message);
      return null;
    }
  },

  updateBoard: async (id, boardData) => {
    try {
      const updatedBoard = await boardService.updateBoard(id, boardData);
      set((state) => ({
        boards: state.boards.map((board) =>
          board._id === id ? { ...board, ...updatedBoard } : board
        ),
        currentBoard:
          state.currentBoard?._id === id
            ? { ...state.currentBoard, ...updatedBoard }
            : state.currentBoard,
      }));
      toast.success("Board updated!");
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  },

  deleteBoard: async (id) => {
    try {
      await boardService.deleteBoard(id);
      set((state) => ({
        boards: state.boards.filter((board) => board._id !== id),
      }));
      toast.success("Board deleted");
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  },

  reset: () => {
    set({
      isError: false,
      isSuccess: false,
      isLoading: false,
      message: "",
    });
  },
}));
