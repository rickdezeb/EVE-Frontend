import { useEffect, useState } from "react"
import * as productService from "../services/ProductService"

export const useGetProducts = (fileId) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const retreive = async () => {
        try {
            setIsLoading(true);
            const data = await productService.getProducts(fileId);
            setProducts(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        retreive();
    },[fileId]);

    return { products, isLoading, refreshItems: retreive };
}

export const useDeleteProduct = (refreshItems) => {
    const [isLoading, setIsLoading] = useState(false);
    const remove = async (id) => {
        try {
            setIsLoading(true);
            await productService.deleteProduct(id);
            await refreshItems();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }
    return { remove, isLoading }; 
}

export const useAddProduct = (refreshItems) => {
    const [isLoading, setIsLoading] = useState(false);
    const add = async (fileId) => {
        try {
            setIsLoading(true);
            await productService.addProduct(fileId);
            await refreshItems();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false)
        }
    }
    return { add, isLoading }; 
}