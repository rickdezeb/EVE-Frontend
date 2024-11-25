import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadExcelPopup = ({ uploadFile, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [show, setShow] = useState(false);
  const fileInputRef = useRef(null);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setSelectedFile(null);
    setSelectedFileName('');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    } else {
      toast.error('Please select a valid .xlsx file', { theme: 'colored' });
      setSelectedFile(null);
      setSelectedFileName('');
    }
    event.target.value = null;
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        await uploadFile(formData);
        handleClose();
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div className="App">
      <button type="button" className="btn btn-primary me-1" onClick={handleShow}>
        <FontAwesomeIcon icon={faUpload} />
      </button>

      <div
        className={`modal fade ${show ? 'show' : ''}`}
        id="excelImportPopUp"
        tabIndex="-1"
        aria-labelledby="excelImportPopUpLabel"
        aria-hidden={!show}
        style={{ display: show ? 'block' : 'none' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fs-4" id="excelImportPopUpLabel">Upload Excel File</h5>
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              <h2 className="mb-3" style={{ fontWeight: "bold" }}>
                Import excel form
              </h2>
              <p>Click the button below to upload an Excel file</p>
              <div className="upload-section d-flex justify-content-center align-items-center p-4 rounded">
                <div className="text-center">
                  <button type="button" className="btn" onClick={triggerFileInput} disabled={isLoading}>
                    <i className="fa-solid fa-upload"></i>
                    <p className="icon-text m-t-5 fs-6">{selectedFileName || "Select Excel File"}</p>
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".xlsx"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
              >
                {isLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadExcelPopup;