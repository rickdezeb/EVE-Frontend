import { api } from "../API/api"

const controller = "Object"

export const getProducts = async (fileId) => {
    const response = await api.get(controller, `/${fileId}`);
    return response.json();
} 

export const deleteProduct = async (objectId) => {
    await api.delete(controller, objectId);
}

export const addProduct = async (fileId) => {
    await api.post(controller, null, `/${fileId}`);
}

