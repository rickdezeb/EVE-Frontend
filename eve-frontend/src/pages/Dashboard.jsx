import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSortAlphaAsc, faSortAlphaDesc, faSortNumericAsc, faSortNumericDesc, faEllipsisVertical, faDownload } from '@fortawesome/free-solid-svg-icons';
import UploadExcelPopup from '../components/UploadExcelPopup';
import { useNavigate } from "react-router-dom";
import { useGetFiles, useDeleteFile, useRenameFile, useUploadFile, useDownloadFile } from '../hooks/FileHooks.js';

export function File({ file, onFileClick }) {
  return (
    <div>
      <span
        onClick={onFileClick}
        className="text-primary"
        style={{ cursor: 'pointer' }}
      >
        {file.name}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [sortByDate, setSortByDate] = useState(false);
  const [isDescending, setIsDescending] = useState(false);
  const [page, setPage] = useState(0);
  const { files, isLoading: isLoadingFiles, refreshItems } = useGetFiles(page, 15, sortByDate, isDescending);
  const { rename, isLoading: isLoadingRename } = useRenameFile(refreshItems);
  const { remove, isLoading: isLoadingDelete } = useDeleteFile(refreshItems);
  const { upload, isLoading: isLoadingUpload } = useUploadFile(refreshItems);
  const { download, isLoading: isLoadingDownload } = useDownloadFile();

  const [renameFileId, setRenameFileId] = useState(null);
  const [renameFileName, setRenameFileName] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleDelete = async () => {
    try {
      await Promise.all(selectedFiles.map(fileId => remove(fileId)));      
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRename = async (fileId) => {
    if (renameFileName.trim() === "") return;
    await rename(fileId, renameFileName);
    setRenameFileId(null);
    setRenameFileName("");
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const showRenameInput = (fileId, currentName) => {
    console.log(fileId, currentName);
    setRenameFileId(fileId);
    setRenameFileName(currentName);
  };

  const handleSelectAllFiles = (e) => {
    if (e.target.checked) {
      setSelectedFiles(files.map(file => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleNextPage = () => {
    console.log(`Next page: ${page + 1}`);
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    console.log(`Previous page: ${Math.max(page - 1, 0)}`);
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleSelectFile = (fileId) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.includes(fileId)
        ? prevSelectedFiles.filter((id) => id !== fileId)
        : [...prevSelectedFiles, fileId]
    );
  };

  const loadProductPage = (file) => {
    navigate("/productpage", { state: { file } });
  };

  const handleSortByName = () => {
    setIsDescending(prev => !prev);
    setSortByDate(false);
  };

  const HandleSortByDate = () => {
    setSortByDate(prev => !prev);
    setIsDescending(false);
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      await download(fileId, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleBulkDownload = async () => {
    try {
      await Promise.all(selectedFiles.map(fileId => {
        const file = files.find(f => f.id === fileId);
        return download(fileId, file.name);
      }));
    } catch (error) {
      console.error("Error downloading files:", error);
    }
  };

  return (
    <main className="container">
      <div className="card mb-3">
        <div className="card-body">
          <div className="mb-4 d-flex flex-column">
            <div className="d-flex flex-row-reverse mb-4">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search for file..."
                hidden
              />
              <div className="d-flex align-items-center">
                <UploadExcelPopup uploadFile={upload} isLoading={isLoadingUpload} />
                <button className="btn btn-primary me-2" onClick={handleBulkDownload} disabled={selectedFiles.length === 0 || isLoadingDownload}>
                  {isLoadingDownload ? <span className="spinner-border spinner-border-sm ms-2"></span> : <FontAwesomeIcon icon={faDownload} />}
                </button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={selectedFiles.length === 0 || isLoadingDelete}>
                  {isLoadingDelete ? <span className="spinner-border spinner-border-sm ms-2"></span> : <FontAwesomeIcon icon={faTrash} />}
                </button>
              </div>
            </div>
            {isLoadingFiles ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <table className="table table-auto align-middle">
                <thead>
                  <tr>
                    <th scope="col">
                      <input type="checkbox" className="me-2" onChange={handleSelectAllFiles} checked={selectedFiles.length === files.length && files.length > 0} />
                    </th>
                    <th scope="col" onClick={handleSortByName} style={{ cursor: 'pointer' }}>
                      File Name 
                      <FontAwesomeIcon icon={isDescending ? faSortAlphaDesc : faSortAlphaAsc} className="ms-1" />
                    </th>
                    <th scope="col" onClick={HandleSortByDate} style={{ cursor: 'pointer' }}>
                      Last Updated <FontAwesomeIcon icon={sortByDate ? faSortNumericAsc : faSortNumericDesc} />
                    </th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {files.length > 0 ? (
                    files.map((file, index) => (
                      <tr key={file.id}>
                        <td>
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => handleSelectFile(file.id)}
                          />
                        </td>
                        {renameFileId === file.id ? (
                          <td className='h-75'>
                            <input
                              type="text"
                              value={renameFileName}
                              onChange={(e) => setRenameFileName(e.target.value)}
                              onBlur={() => handleRename(file.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename(file.id);
                              }}
                              autoFocus
                              className="form-control"
                            />
                          </td>
                        ) : (
                          <td>
                            <File file={file} onFileClick={() => loadProductPage(file)} />
                          </td>
                        )}
                        <td>{new Date(file.lastUpdated).toLocaleDateString()}</td>
                        <td className="text-end">
                          <button className="btn btn-link text-black p-0" onClick={() => toggleDropdown(index)}>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </button>
                          {dropdownOpen === index && (
                            <div className="dropdown" ref={dropdownRef}>
                              <div className="dropdown-menu show">
                                <button className="dropdown-item" onClick={() => showRenameInput(file.id, file.name)} disabled={isLoadingRename}>
                                  Rename
                                </button>
                                <button className="dropdown-item" onClick={() => handleDownloadFile(file.id, file.name)}>
                                  Download
                                </button>
                                <button className="dropdown-item" onClick={() => console.log('Export:', file.name)} hidden>
                                  Export
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No files available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-primary me-2" onClick={handlePreviousPage} disabled={page === 0}>Previous Page</button>
              <button className="btn btn-primary" onClick={handleNextPage} disabled={files.length < 15}>Next Page</button>
            </div>
        </div>
      </div>
    </main>
  );
}