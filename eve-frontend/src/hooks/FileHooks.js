import { useEffect, useState } from "react"
import * as fileService from '../Services/FileService.js';

export const useGetFiles = (page = 0, pageSize = 15, sortByDate = false, isDescending = false) => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const retrieve = async () => {
        try {
            setIsLoading(true);
            const data = await fileService.getFiles(page, pageSize, sortByDate, isDescending);
            console.log(`Retrieved files for page ${page}:`, data);
            setFiles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log(`Fetching files for page ${page}`);
        retrieve();
    }, [refresh, page, sortByDate, isDescending]);

    const refreshItems = () => {
        setRefresh((prevRefresh) => !prevRefresh);
    };

    return { files, isLoading, refreshItems };
};


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

export const useDownloadFile = () => {
    const [isLoading, setIsLoading] = useState(false);
  
    const download = async (fileId, fileName) => {
      setIsLoading(true);
      try {
        const blob = await fileService.downloadFile(fileId);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}`;
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading file:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    return { download, isLoading };
};

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