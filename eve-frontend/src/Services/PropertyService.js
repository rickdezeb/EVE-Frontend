import { api } from "../API/api"

const controller = "Property"

export const getProperties = async (productId) => {
    const response = await api.get(controller, `/${productId}`);
    return response.json();
} 

export const updateProperty = async (productId, propertyId, value) => {
    await api.put(controller, null, `?ObjectId=${productId}&PropertyId=${propertyId}&Value=${value}`);
}