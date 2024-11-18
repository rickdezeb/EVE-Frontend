import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlus, faTrash, faSortAlphaAsc, faSortNumericAsc, faSortNumericDesc } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetProducts, useAddProduct, useDeleteProduct } from '../hooks/ProductHooks';
import { useDownloadFile } from '../hooks/FileHooks';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Property = ({ product, file }) => {
  const navigate = useNavigate();
  const loadEditPage = () => {
    navigate("/editpage", { state: { product, file } });
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

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteProducts = async () => {
    try {
      await Promise.all(selectedProducts.map(productId => remove(productId)));
      const updatedProducts = products.filter(product => !selectedProducts.includes(product.id));
      refreshItems(updatedProducts); 
  
      setSelectedProducts([]);
      setShowDeleteModal(false);
      toast.error("File deleted.", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete products.", { theme: "colored" });
    }
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

  const handleSelectAllProducts = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleDownloadClick = () => {
    download(file.id, file.name);
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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

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

  if (isLoadingProducts) {
    return <div className="text-center">Loading products...<span className="spinner-border spinner-border-sm ms-2"></span></div>;
  }

  return (
    <main className="container mt-4">
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>{file?.name}</h4>
            <div className="d-flex">
              <button className="btn btn-primary me-2" onClick={handleDownloadClick}>
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
              {products.length > 0 ? products.map((product) => (
                <tr key={product.id}>
                  <td><input type="checkbox" className="me-2" checked={selectedProducts.includes(product.id)} onChange={() => handleSelectProduct(product.id)} /> </td>
                  <td><Property product={product} file={file} /></td>
                  <td>{new Date(product.lastUpdated).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No products found.</td>
                </tr>)}
            </tbody>
          </table>

          <div className="d-flex justify-content-center align-items-center mt-3">
            {isLoadingProducts ? (
              <div className="text-center">Loading pagination...<span className="spinner-border spinner-border-sm ms-2"></span></div>
            ) : (
              <>
                <div className="me-3">
                  <div>Total {totalProducts} products </div>
                </div>
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
                          <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
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
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProducts}
        itemCount={selectedProducts.length}
        itemType="products"
      />
    </main>
  );
}
