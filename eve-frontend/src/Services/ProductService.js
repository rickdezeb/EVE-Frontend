import { api } from "../API/api";

const controller = "Object";

export const getProducts = async (fileId, page = 0, pageSize = 15, isDescending = false) => {
    const endpoint = `/${fileId}?page=${page}&pagesize=${pageSize}&isDescending=${isDescending}`;
    const response = await api.get(controller, endpoint);
    if (!response.ok) {
        throw new Error("Failed to retrieve products");
    }
    return response.json();
};

export const getProductCount = async (fileId) => {
    const endpoint = `/${fileId}/Count`;
    const response = await api.get(controller, endpoint);
    return response.json();
};

export const deleteProduct = async (objectId) => {
    const response = await api.delete(controller, objectId);
    if (response.status == 200){
        return { status: 200 };
    } else {
        throw new Error("Failed to delete product");
    }
};

export const addProduct = async (fileId) => {
    const response = await api.post(controller, null, `/${fileId}`);
    if (response.status == 200){
        return { status: 200 };
    } else {
        throw new Error("Failed to add product");
    }

};