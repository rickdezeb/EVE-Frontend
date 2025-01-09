import { useEffect, useState } from "react";
import * as productService from "../services/ProductService";
import * as fileService from "../services/FileService";
import { use } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useGetProducts = (fileId, page = 0, pageSize = 15, isDescending = false) => {
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [objectIdentifier, setObjectIdentifier] = useState('');

    const retrieve = async () => {
        try {
            setIsLoading(true);
            const data = await productService.getProducts(fileId, page, pageSize, isDescending);
            const count = await productService.getProductCount(fileId);
            setProducts(data.objects);
            setTotalProducts(count);
            setObjectIdentifier(data.objectIdentifier);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products", { theme: "colored" });
            throw error;
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

    return { products, totalProducts, isLoading, objectIdentifier, refreshItems };
};

export const useDeleteProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const remove = async (id) => {
        try {
            setIsLoading(true);
            await productService.deleteProduct(id);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            setIsLoading(false);
            return;
        }
    }

    
    return { remove, isLoading }; 
}

export const useAddProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const add = async (fileId) => {
        try {
            setIsLoading(true);
            await productService.addProduct(fileId);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            setIsLoading(false)
        }
    }
    return { add, isLoading }; 
};