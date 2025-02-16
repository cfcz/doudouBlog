import axios from "axios";
import { store } from "../store/store";

interface UploadResponse {
  url: string;
  filename: string;
  type: "image" | "video";
}

export const uploadMedia = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const state = store.getState();
    const token = state.user.user?.token;

    if (!token) {
      throw new Error("未登录");
    }

    // 详细的调试日志
    console.log("File being uploaded:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    console.log("FormData entries:", Array.from(formData.entries()));

    const response = await axios.post<UploadResponse>(
      `${import.meta.env.VITE_BASE_URL}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        // 添加调试信息
        onUploadProgress: (progressEvent) => {
          console.log("Upload progress:", progressEvent);
        },
      }
    );

    console.log("Upload response:", response.data);
    return response.data;
  } catch (error) {
    // 详细的错误日志
    if (axios.isAxiosError(error)) {
      console.error("Upload failed:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};
