import { api } from "../API/api"

const controller = "Excel"

export const getFiles = async () => {
    const response = await api.get(controller);
    return response.json();
} 

export const renameFile = (fileId, newFileName) => api.put(controller, null, `?id=${fileId}&fileName=${newFileName}`);

export const deleteFile = (fileId) => api.delete(controller, fileId);

export const uploadFile = (formData) => api.post(controller, formData);
