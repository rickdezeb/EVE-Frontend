import { api } from "../API/api";

const controller = "Excel";

export const getFiles = async (page = 0, pageSize = 15, sortByDate = false, isDescending = false, searchTerm = '') => {
  const endpoint = `?page=${page}&pagesize=${pageSize}&sortByDate=${sortByDate}&isDescending=${isDescending}&searchTerm=${searchTerm}`;
  console.log(`Calling API with endpoint: ${endpoint}`);
  const response = await api.get(controller, endpoint);
  if (!response.ok) {
    throw new Error("Failed to retrieve files");
  }
  const data = await response.json();
  console.log(`API response for page ${page}:`, data);
  return data;
};

export const changeObjectIdentifier = async (fileId, newIdentifier) => {
  const endpoint = `/ChangeIdentifier?id=${fileId}&objectIdentifier=${newIdentifier}`;
  const response = await api.put(controller, null, endpoint);
  if (response.status === 200) {
    return { status: 200 };
  } else {
    throw new Error("Failed to change object identifier");
  }
};


export const getFileCount = async () => {
  const endpoint = `/Count`;
  const response = await api.get(controller, endpoint);
  return response.json();
};


export const renameFile = async (fileId, newFileName) => {
  const data = await api.put(controller, null, `?id=${fileId}&fileName=${newFileName}`);
  if (data.status === 200) {
    return { status: 200 };
  } else {
    throw new Error("Failed to rename file");
  }
}

export const deleteFile = async (fileId) => {
  const data = await api.delete(controller, fileId);
  if (data.status === 200) {
    return { status: 200 };
  } else {
    throw new Error("Failed to delete file");
  }
};

export const uploadFile = (formData) => api.post(controller, formData);

export const downloadFile = async (fileId) => {
  const endpoint = `/${fileId}/download`;
  const response = await api.get(controller, endpoint);
  if (!response.ok) {
    throw new Error("Failed to download file");
  }
  return response.blob();
};
