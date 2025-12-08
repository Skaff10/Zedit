import axios from "axios";

const API_URL = "/api/docs/";

// Get token from local storage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user?.token;
};

const createDocument = async (docData: {
  title: string;
  content: object;
  status: string;
}) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, docData, config);
  return response.data;
};

const getUserDocuments = async () => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const getDocument = async (id: string) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + id, config);
  return response.data;
};

const updateDocument = async (
  id: string,
  docData: { title?: string; content?: object; status?: string }
) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + id, docData, config);
  return response.data;
};

const docService = {
  createDocument,
  getUserDocuments,
  getDocument,
  updateDocument,
};

export default docService;
