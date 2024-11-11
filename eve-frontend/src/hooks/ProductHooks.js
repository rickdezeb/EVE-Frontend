import { useEffect, useState } from "react"
import * as productService from "../services/ProductService"

export const useGetProducts = (fileId, page = 0, pageSize = 15, isDescending = false) => {
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const retrieve = async () => {
        try {
            setIsLoading(true);
            const [data, count] = await Promise.all([
                productService.getProducts(fileId, page, pageSize, isDescending),
                productService.getProductCount(fileId)
            ]);
            setProducts(data);
            setTotalProducts(count);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        retrieve();
    }, [refresh, page, isDescending]);

    const refreshItems = () => {
        setRefresh((prevRefresh) => !prevRefresh);
    };

    return { products, totalProducts, isLoading, refreshItems };
};

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