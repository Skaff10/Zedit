import axios from "axios";

const API_URL = "/api/boards/";

// Get token from local storage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user?.token;
};

const createBoard = async (boardData: {
  name: string;
  isPrivate?: boolean;
  collaborators?: Array<{ userId: string; permission: string }>;
}) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, boardData, config);
  return response.data;
};

const getUserBoards = async () => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const getBoard = async (id: string) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + id, config);
  return response.data;
};

const updateBoard = async (
  id: string,
  boardData: {
    name?: string;
    isPrivate?: boolean;
    collaborators?: Array<{ userId: string; permission: string }>;
  }
) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + id, boardData, config);
  return response.data;
};

const deleteBoard = async (id: string) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

const boardService = {
  createBoard,
  getUserBoards,
  getBoard,
  updateBoard,
  deleteBoard,
};

export default boardService;
