import { create } from "zustand";
import docService from "../features/docs/docService";
import { toast } from "react-toastify";

interface Document {
  _id: string;
  title: string;
  content: any;
  status: "draft" | "review" | "published" | "stable";
  lastModified: string;
  owner: { _id: string; name: string } | string;
  collaborators: any[];
}

interface DocState {
  documents: Document[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  createDocument: (docData: {
    title: string;
    content: any;
    status: string;
  }) => Promise<void>;
  getUserDocuments: () => Promise<void>;
  getDocument: (id: string) => Promise<Document | null>;
  updateDocument: (
    id: string,
    docData: { title?: string; content?: any; status?: string }
  ) => Promise<void>;
  reset: () => void;
}

export const useDocStore = create<DocState>((set, get) => ({
  documents: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",

  createDocument: async (docData) => {
    try {
      set({ isLoading: true });
      const doc = await docService.createDocument(docData);
      set((state) => ({
        documents: [doc, ...state.documents],
        isLoading: false,
        isSuccess: true,
      }));
      toast.success("Document saved successfully!");
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

  getUserDocuments: async () => {
    try {
      set({ isLoading: true });
      const docs = await docService.getUserDocuments();
      set({
        documents: docs,
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

  getDocument: async (id: string) => {
    try {
      set({ isLoading: true });
      const doc = await docService.getDocument(id);
      set({
        isLoading: false,
        isSuccess: true,
      });
      return doc;
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

  updateDocument: async (id, docData) => {
    try {
      // Optimistic update could be done here, but for now simple await
      const updatedDoc = await docService.updateDocument(id, docData);
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc._id === id ? { ...doc, ...updatedDoc } : doc
        ),
      }));
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
