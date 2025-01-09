import { useEffect, useState, useCallback } from "react";
import * as propertyService from "../services/PropertyService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useGetProperties = (productId) => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const retreive = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await propertyService.getProperties(productId);
            setProperties(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load properties", { theme: "colored" });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        retreive();
    }, [retreive]);

    const refreshItems = () => {
        retreive();
    };

    return { properties, isLoading, refreshItems };
};

export const useUpdateProperty = () => {
    const [isLoading, setIsLoading] = useState(false);

    const update = async (productId, propertyId, value) => {
        try {
            setIsLoading(true);
            await propertyService.updateProperty(productId, propertyId, value);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false); 
        }
    };

    return { update, isLoading };
};
