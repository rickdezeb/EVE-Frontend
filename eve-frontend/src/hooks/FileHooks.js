import { useEffect, useState } from "react"
import * as fileService from "../services/FileService"

export const useGetFiles = () => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const retreive = async () => {
        try {
            setIsLoading(true);
            const data = await fileService.getFiles();
            setFiles(data);
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
    return { files, isLoading, refreshItems };
}

export const useRenameFile = (refreshItems) => {
    const [isLoading, setIsLoading] = useState(false);
    const rename = async (id, newName) => {
        try {
            setIsLoading(true);
            await fileService.renameFile(id, newName);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false)
            refreshItems();
        }
    }
    return { rename, isLoading }; 
}

export const useDeleteFile = (refreshItems) => {
    const [isLoading, setIsLoading] = useState(false);
    const remove = async (id) => {
        try {
            setIsLoading(true);
            await fileService.deleteFile(id);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
            refreshItems();
        }
    }
    return { remove, isLoading }; 
}

export const useUploadFile = (refreshItems) => {
    const [isLoading, setIsLoading] = useState(false);
    const upload = async (formData) => {
        try {
            setIsLoading(true);
            await fileService.uploadFile(formData);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false)
            refreshItems();
        }
    }
    return { upload, isLoading }; 
}