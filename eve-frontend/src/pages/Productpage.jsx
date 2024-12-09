import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlus, faTrash, faSortAlphaAsc, faSortNumericAsc, faSortNumericDesc, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { useLocation, useNavigate } from 'react-router-dom';
import { useGetProducts, useAddProduct, useDeleteProduct } from '../hooks/ProductHooks';
import { useDownloadFile, useRenameFile } from '../hooks/FileHooks';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Pagination from '../components/Pagination';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Property = ({ product, file, currentPage }) => {
  const navigate = useNavigate();
  const loadEditPage = () => {
    navigate("/editpage", { state: { product, file, currentPage } });
  };

  return (
    <div>
      <span
        onClick={loadEditPage}
        className="text-primary"
        style={{ cursor: 'pointer' }}
      >
        {product.id}
      </span>
    </div>
  );
};

export default function ProductPage() {
  const location = useLocation();
  const data = location.state || {};
  const { file } = data;

  const [isDescending, setIsDescending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const itemsPerPage = 15;
  const { products, totalProducts, isLoading: isLoadingProducts, refreshItems, searchProducts } = useGetProducts(file?.id, currentPage - 1, itemsPerPage, isDescending);
  const { remove, isLoading: isLoadingDelete } = useDeleteProduct(refreshItems);
  const { add, isLoading: isLoadingAdd } = useAddProduct(refreshItems);
  const { download, isLoading: isLoadingDownload } = useDownloadFile();
  const { rename, isLoading: isLoadingRename } = useRenameFile(refreshItems);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [renameFileName, setRenameFileName] = useState(localStorage.getItem(`fileName-${file?.id}`) || file?.name);
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    setRenameFileName(localStorage.getItem(`fileName-${file?.id}`) || file?.name);
  }, [file]);

  const handleRenameClick = () => {
    setIsRenaming(true);
  };

const handleRename = async () => {
    if (renameFileName.trim() === "" || renameFileName === file.name) {
        setIsRenaming(false);
        return;
    }
    try {
        await rename(file.id, renameFileName); // Voer de hernoeming uit
        file.name = renameFileName; // Update de bestandsnaam lokaal
        localStorage.setItem(`fileName-${file.id}`, renameFileName); // Sla op in localStorage
        setIsRenaming(false);
        toast.success("File successfully renamed.", { theme: "colored" });
        refreshItems(); // Ververs items om de wijziging weer te geven
    } catch (error) {
        console.error(error);
        toast.error("Failed to rename file.", { theme: "colored" });
    }
};

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    }
  };

  const handleRenameBlur = () => {
    handleRename();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await add(file.id);
      refreshItems();
      toast.success("Product added successfully.", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product.", { theme: "colored" });
    }
  };

  const handleDeleteProducts = async () => {
    try {
      await Promise.all(selectedProducts.map(productId => remove(productId)));
      setSelectedProducts([]);
      setShowDeleteModal(false);
      refreshItems();
      toast.success("Products deleted.", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete products.", { theme: "colored" });
    }
  };

  const handleSelectAllProducts = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.includes(productId)
        ? prevSelectedProducts.filter((id) => id !== productId)
        : [...prevSelectedProducts, productId]
    );
  };

  const handleSortClick = () => {
    setIsDescending((prevIsDescending) => !prevIsDescending);
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

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

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

  if (isLoadingProducts) {
    return <div className="text-center">Loading products...<span className="spinner-border spinner-border-sm ms-2"></span></div>;
  }

  return (
    <main className="container mt-4">
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              {isRenaming ? (
                <input
                  type="text"
                  value={renameFileName}
                  onChange={(e) => setRenameFileName(e.target.value)}
                  onBlur={handleRenameBlur}
                  onKeyDown={handleRenameKeyDown}
                  autoFocus
                  className="form-control me-2"
                  style={{ maxWidth: '200px' }}
                />
              ) : (
                <h4 className="me-2">{renameFileName}</h4>
              )}
              <FontAwesomeIcon
                icon={faPencilAlt}
                className="text-primary"
                style={{ cursor: 'pointer' }}
                onClick={handleRenameClick}
              />
            </div>
            <div className="d-flex">
              <button className="btn btn-primary me-2" onClick={() => download(file.id, file.name)}>
                {isLoadingDownload ? <span className="spinner-border spinner-border-sm"></span> : <FontAwesomeIcon icon={faDownload} className="text-white" />}
              </button>
              <button type="button" className="btn btn-primary me-2" onClick={handleAddProduct}>
                {isLoadingAdd ? <span className="spinner-border spinner-border-sm"></span> : <FontAwesomeIcon icon={faPlus} className="text-white" />}
              </button>
              <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)} disabled={selectedProducts.length === 0}>
                {isLoadingDelete ? <span className="spinner-border spinner-border-sm"></span> : <FontAwesomeIcon icon={faTrash} />}
              </button>
            </div>
          </div>

          <table className="table table-auto table-hover align-middle">
            <thead>
              <tr>
                <th scope="col"><input type="checkbox" className="me-2" onChange={handleSelectAllProducts} checked={selectedProducts.length === products.length && products.length > 0} /></th>
                <th scope="col">Product Identifier</th>
                <th scope="col" onClick={handleSortClick} style={{ cursor: 'pointer' }}>
                  Last Updated <FontAwesomeIcon icon={isDescending ? faSortNumericDesc : faSortNumericAsc} />
                </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {products.length > 0 ? products.map((product, index) => (
                <tr key={product.id}>
                  <td><input type="checkbox" className="me-2" checked={selectedProducts.includes(product.id)} onChange={() => handleSelectProduct(product.id)} /> </td>
                  <td><Property product={product} file={file} currentPage={currentPage} /></td>
                  <td>{new Date(product.lastUpdated).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No products found.</td>
                </tr>)}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            inputPage={inputPage}
            handleInputPageChange={handleInputPageChange}
            handleGoToPage={handleGoToPage}
            showSaveButton={false}
          />
        </div>
      </div>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProducts}
      />
    </main>
  );
}