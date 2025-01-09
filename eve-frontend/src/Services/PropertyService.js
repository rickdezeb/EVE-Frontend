import { api } from "../API/api"

const controller = "Property"

export const getProperties = async (productId) => {
    const response = await api.get(controller, `/${productId}`);
    if (!response.ok) {
        throw new Error("Failed to retrieve properties");
    }
    return response.json();
} 

export const updateProperty = async (productId, propertyId, value) => {
    const response = await api.put(controller, null, `?ObjectId=${productId}&PropertyId=${propertyId}&Value=${value}`);
    if (response.status == 200){
        return { status: 200 };
    } else {
        throw new Error("Failed to update property");
    }
}