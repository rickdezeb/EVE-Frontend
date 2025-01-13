import { useEffect, useState } from "react"
import * as fileService from '../services/FileService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useGetFiles = (page = 0, pageSize = 15, sortByDate = false, isDescending = false, searchTerm = '') => {
    const [files, setFiles] = useState([]);
    const [totalFiles, setTotalFiles] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const retrieve = async () => {
        try {
            setIsLoading(true);
            const [data, count] = await Promise.all([
                fileService.getFiles(page, pageSize, sortByDate, isDescending, searchTerm),
                fileService.getFileCount()
            ]);
            console.log(`Retrieved files for page ${page}:`, data);
            setFiles(data);
            setTotalFiles(count);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load files", { theme: "colored" });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log(`Fetching files for page ${page}`);
        try {
            retrieve();
        } catch (error) {
            console.log(error);
        }
    }, [refresh, page, sortByDate, isDescending, searchTerm]);

    const refreshItems = () => {
        setRefresh((prevRefresh) => !prevRefresh);
    };

    return { files, totalFiles, isLoading, refreshItems };
};

export const useChangeObjectIdentifier = (refreshItems) => {
    const [isLoading, setIsLoading] = useState(false);
  
    const changeIdentifier = async (fileId, newIdentifier) => {
      try {
        setIsLoading(true);
        await fileService.changeObjectIdentifier(fileId, newIdentifier);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false);
        refreshItems();
      }
    };
  
    return { changeIdentifier, isLoading };
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
            throw error;
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
        if (fileName.endsWith(".xlsx")) {
            link.download = `${fileName}`;
        } else {
            link.download = `${fileName + ".xlsx"}`;
        }
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
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
            throw error;
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
            throw error;
        }
        finally {
            setIsLoading(false)
            refreshItems();
        }
    }
    return { upload, isLoading }; 
}