import { api } from "../API/api";

const controller = "Excel";

export const getFiles = async (page = 0, pageSize = 15, sortByDate = false, isDescending = false) => {
  const endpoint = `?page=${page}&pagesize=${pageSize}&sortByDate=${sortByDate}&isDescending=${isDescending}`;
  console.log(`Calling API with endpoint: ${endpoint}`);
  const response = await api.get(controller, endpoint);
  const data = await response.json();
  console.log(`API response for page ${page}:`, data);
  return data;
};

export const getFileCount = async () => {
  const endpoint = `/Count`;
  const response = await api.get(controller, endpoint);
  return response.json();
};

export const renameFile = (fileId, newFileName) => api.put(controller, null, `?id=${fileId}&fileName=${newFileName}`);

export const deleteFile = (fileId) => api.delete(controller, fileId);

export const uploadFile = (formData) => api.post(controller, formData);

export const downloadFile = async (fileId) => {
  const endpoint = `/${fileId}/download`;
  const response = await api.get(controller, endpoint);
  if (!response.ok) {
    throw new Error("Failed to download file");
  }
  return response.blob();
};
