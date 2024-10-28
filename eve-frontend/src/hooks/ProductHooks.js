import { useEffect, useState } from "react"
import * as productService from "../services/ProductService"

export const useGetProducts = (fileId) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

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
    },[refresh]);

    const refreshItems = () => {
        setRefresh((prevRefresh) => !prevRefresh);
    }
    return { products, isLoading, refreshItems };
}

export const useDeleteProduct = (refreshItems) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const [isLoading, setIsLoading] = useState(false);
    const remove = async (id) => {
        try {
            setIsLoading(true);
            await productService.deleteProduct(id);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            await delay(100);
            setIsLoading(false);
            refreshItems();
        }
    }
    return { remove, isLoading }; 
}

export const useAddProduct = (refreshItems) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const [isLoading, setIsLoading] = useState(false);
    const add = async (fileId) => {
        try {
            setIsLoading(true);
            await productService.addProduct(fileId);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            await delay(100);
            setIsLoading(false)
            refreshItems();
        }
    }
    return { add, isLoading }; 
}