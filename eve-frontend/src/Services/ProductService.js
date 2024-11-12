import { api } from "../API/api";

const controller = "Object";

export const getProducts = async (fileId, page = 0, pageSize = 15, isDescending = false) => {
    const endpoint = `/${fileId}?page=${page}&pagesize=${pageSize}&isDescending=${isDescending}`;
    const response = await api.get(controller, endpoint);
    return response.json();
};

export const getProductCount = async (fileId) => {
    const endpoint = `/${fileId}/Count`;
    const response = await api.get(controller, endpoint);
    return response.json();
};

export const deleteProduct = async (objectId) => {
    api.delete(controller, objectId);
};

export const addProduct = async (fileId) => {
    api.post(controller, null, `/${fileId}`);
};