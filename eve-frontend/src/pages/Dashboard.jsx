import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSortAlphaAsc, faSortNumericAsc, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import UploadExcelPopup from '../components/UploadExcelPopup';
import { useNavigate } from "react-router-dom";
import { useGetFiles, useDeleteFile, useRenameFile, useUploadFile } from '../hooks/FileHooks.js';

export function File({ file }) {
  const navigate = useNavigate();
  const loadProductPage = () => {
    navigate("/productpage", { state: { file } });
  }
  return (
    <div>
      <button onClick={loadProductPage}>
        {file.name}
      </button>
    </div>
  )
}

function Dashboard() {
  const { files, isLoading: isLoadingFiles, refreshItems } = useGetFiles();
  const { rename, isLoading: isLoadingRename } = useRenameFile(refreshItems);
  const { remove, isLoading: isLoadingDelete } = useDeleteFile(refreshItems);
  const { upload, isLoading: isLoadingUpload } = useUploadFile(refreshItems);

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
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleRename = async (fileId) => {
    await rename(fileId, renameFileName);
    setRenameFileId(null);
    setRenameFileName("");
  }

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const showRenameInput = (fileId) => {
    setRenameFileId(fileId);
  }

  const handleSelectAllFiles = (e) => {
    if (e.target.checked) {
      setSelectedFiles(files.map(file => file.id));
    }
    else {
      setSelectedFiles([]);
    }
  }

  const handleSelectFile = (fileId) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.includes(fileId)
        ? prevSelectedFiles.filter((id) => id !== fileId)
        : [...prevSelectedFiles, fileId]
    );
  };

  return (
    <main className="container">
      <div className="card mb-3">
        <div className="card-body">
          <div className="mb-4 d-flex flex-column">
            <div className="d-flex flex-row mb-4">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search for file..."
              />
              <div className="d-flex align-items-center">
                <UploadExcelPopup uploadFile={ upload } isLoading={isLoadingUpload}/>
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
                      <input type="checkbox" className="me-2" onClick={handleSelectAllFiles} checked={selectedFiles.length === files.length && files.length > 0} />
                    </th>
                    <th scope="col">
                      File Name <FontAwesomeIcon icon={faSortAlphaAsc} />
                    </th>
                    <th scope="col">
                      Last Updated <FontAwesomeIcon icon={faSortNumericAsc} />
                    </th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {files.length > 0 ? (
                    files.map((file, index) => (
                      <tr key={file.id}>
                        <td >
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
                            <File file={file} ></File>
                          </td>
                        )}
                        <td>{new Date(file.lastUpdated).toLocaleDateString()}</td>
                        <td className="d-flex justify-content-end">
                          <div className="dropdown" ref={dropdownRef}>
                            <button className="btn btn-link text-black p-0" onClick={() => toggleDropdown(index)}>
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                            {dropdownOpen === index && (
                              <div
                                className="dropdown-menu show"
                                style={{ maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                              >
                                <button className="dropdown-item" onClick={() => showRenameInput(file.id)} disabled={isLoadingRename}>
                                  Rename
                                </button>
                                <button className="dropdown-item" onClick={() => console.log('Export:', file.name)}>
                                  Export
                                </button>
                              </div>
                            )}
                          </div>
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
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
