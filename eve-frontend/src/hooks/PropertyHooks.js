import { useEffect, useState, useCallback } from "react";
import * as propertyService from "../services/PropertyService";

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

export const useUpdateProperty = (refreshItems) => {
    const [isLoading, setIsLoading] = useState(false);

    const update = async (productId, propertyId, value) => {
        try {
            setIsLoading(true);
            await propertyService.updateProperty(productId, propertyId, value);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            refreshItems(); 
        }
    };

    return { update, isLoading };
};
