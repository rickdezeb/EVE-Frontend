import { useEffect, useState } from "react";
import * as productService from "../services/ProductService";
import * as fileService from "../services/FileService";

export const useGetProducts = (fileId, page = 0, pageSize = 15, isDescending = false, searchTerm = '') => {
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

    const searchProducts = async (searchTerm) => {
        try {
            setIsLoading(true);
            const data = await fileService.getFiles(page, pageSize, false, false, searchTerm);
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { products, totalProducts, isLoading, refreshItems, searchProducts };
};

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
};