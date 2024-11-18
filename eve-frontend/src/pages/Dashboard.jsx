import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSortAlphaAsc, faSortAlphaDesc, faSortNumericAsc, faSortNumericDesc, faEllipsisVertical, faDownload } from '@fortawesome/free-solid-svg-icons';
import UploadExcelPopup from '../components/UploadExcelPopup';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import LivesearchComponent from '../components/LiveSearchComponent';
import { useNavigate } from "react-router-dom";
import { useGetFiles, useDeleteFile, useRenameFile, useUploadFile, useDownloadFile } from '../hooks/FileHooks.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [isDescending, setIsDescending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 15;
  const { files, totalFiles, isLoading: isLoadingFiles, refreshItems } = useGetFiles(currentPage - 1, itemsPerPage, sortByDate, isDescending, searchTerm);
  const { rename, isLoading: isLoadingRename } = useRenameFile(refreshItems);
  const { remove, isLoading: isLoadingDelete } = useDeleteFile(refreshItems);
  const { upload, isLoading: isLoadingUpload } = useUploadFile(refreshItems);
  const { download, isLoading: isLoadingDownload } = useDownloadFile();

  const [renameFileId, setRenameFileId] = useState(null);
  const [renameFileName, setRenameFileName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
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
      setShowDeleteModal(false);
      toast.error("Selected files deleted.", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete files.", { theme: "colored" });
    }
  };

  const handleDeleteFile = async () => {
    try {
      await remove(fileToDelete);
      setFileToDelete(null);
      setShowDeleteModal(false);
      toast.error("File deleted.", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete file.", { theme: "colored" });
    }
  };

  const handleRename = async (fileId) => {
    if (renameFileName.trim() === "") return;
    try {
      await rename(fileId, renameFileName);
      setRenameFileId(null);
      setRenameFileName("");
      toast.success("File successfully renamed.", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to rename file.", { theme: "colored" });
    }
  };

  const handleUpload = async (file) => {
    try {
      await upload(file);
      toast.success("File successfully uploaded.", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file.", { theme: "colored" });
    }
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
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
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

  const handleSortByDate = () => {
    setSortByDate(true);
    setIsDescending(prev => !prev);
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

  const totalPages = Math.ceil(totalFiles / itemsPerPage);

  const getPaginationNumbers = () => {
    const paginationNumbers = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisible - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      paginationNumbers.push(1);
      if (startPage > 2) {
        paginationNumbers.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationNumbers.push('...');
      }
      paginationNumbers.push(totalPages);
    }

    return paginationNumbers;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setInputPage('');
    }
  };

  const handleInputPageChange = (event) => {
    setInputPage(event.target.value);
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputPage, 10);
    if (!isNaN(pageNumber)) {
      handlePageChange(pageNumber);
    }
  };

  return (
    <main className="container">
      <div className="card mb-3">
        <div className="card-body">
          <LivesearchComponent onSearch={setSearchTerm} />
          <div className="mb-4 d-flex flex-column">
            <div className="d-flex flex-row-reverse mb-4">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search for file..."
                hidden
              />
              <div className="d-flex align-items-center">
                <UploadExcelPopup uploadFile={handleUpload} isLoading={isLoadingUpload} />
                <button className="btn btn-primary me-2" onClick={handleBulkDownload} disabled={selectedFiles.length === 0 || isLoadingDownload}>
                  {isLoadingDownload ? <span className="spinner-border spinner-border-sm ms-2"></span> : <FontAwesomeIcon icon={faDownload} />}
                </button>
                <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)} disabled={selectedFiles.length === 0 || isLoadingDelete}>
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
                    <th scope="col" onClick={handleSortByDate} style={{ cursor: 'pointer' }}>
                      Last Updated <FontAwesomeIcon icon={sortByDate ? (isDescending ? faSortNumericDesc : faSortNumericAsc) : faSortNumericAsc} />
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
                        <td>{new Date(file.lastUpdated).toLocaleString()}</td>
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
                                <button className="dropdown-item" onClick={() => { setFileToDelete(file.id); setShowDeleteModal(true); }}>
                                  Delete
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
          <div className="d-flex justify-content-center align-items-center mt-3">
            {isLoadingFiles ? (
              <div className="text-center">Loading pagination...<span className="spinner-border spinner-border-sm ms-2"></span></div>
            ) : (
              <>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                      </button>
                    </li>
                    {getPaginationNumbers().map((pageNumber, index) => (
                      <li className={`page-item ${currentPage === pageNumber ? 'active' : ''}`} key={index}>
                        {pageNumber === '...' ? (
                          <span className="page-link">...</span>
                        ) : (
                          <button 
                          className="page-link" 
                          style={{ minWidth: '45px', textAlign: 'center', margin: '0 2px' }}
                          onClick={() => handlePageChange(pageNumber)}>
                            {pageNumber}
                          </button>
                        )}
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
                <div className="d-flex align-items-center ms-3">
                  <span className="me-2">Go to:</span>
                  <input
                    type="number"
                    className="form-control me-2 w-25"
                    value={inputPage}
                    onChange={handleInputPageChange}
                    placeholder="Page"
                  />
                  <button className="btn btn-primary me-2" onClick={handleGoToPage} disabled={!inputPage}>Go</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={fileToDelete ? handleDeleteFile : handleDelete}
      />
    </main>
  );
}