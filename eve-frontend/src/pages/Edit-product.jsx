import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetProperties, useUpdateProperty } from '../hooks/PropertyHooks';
import { toast } from 'react-toastify';
import { useGetProducts } from "../hooks/ProductHooks";

function Editpage() {
  const location = useLocation();
  const data = location.state || {};
  const { product, file, indexation, currentProductPage, isDescending } = data;

  const initialPage = () => {
    const fakeindex = currentProductPage - 1;
    const realindex = fakeindex * 15;
    const realerindex = indexation + realindex + 1;
    return realerindex;
  };
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [inputPage, setInputPage] = useState('');
  const itemsPerPage = 1;

  const [selectedProductId, setSelectedProductId] = useState(product.id);
  const { properties, isLoading: isLoadingProperties, refreshItems } = useGetProperties(selectedProductId);
  const { update, isLoading: isLoadingUpdate } = useUpdateProperty(refreshItems);
  const { products, totalProducts, isLoading: isLoadingProducts} = useGetProducts(file.id, currentPage - 1, itemsPerPage, isDescending);

  const [localProperties, setLocalProperties] = useState(properties);
  
  useEffect(() => {
    refreshItems();
  }, [selectedProductId]);

  useEffect(() => {
    if (properties) {
      setLocalProperties(properties);
    }
  }, [properties]);

  useEffect(() => {
    if (products.length > 0) {
      setSelectedProductId(products[0]?.id);
    }
    const selectedProduct = products.find((p) => p.id === selectedProductId);
    if (selectedProduct) {
      setCurrentProduct(selectedProduct);
    }
  }, [products]);

  const handleInputChange = (index, event) => {
    const newProperties = [...properties];
    newProperties[index].value = event.target.value;
    console.log(newProperties);
    setLocalProperties(newProperties);
  };

  const handleSave = async () => {
    const updatePromises = localProperties.map(property =>
      update(selectedProductId, property.id, property.value)
    );

    try {
      await Promise.all(updatePromises);
      toast.success("Properties updated successfully.", { theme: "colored" });
      refreshItems();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update properties.", { theme: "colored" });
      refreshItems();
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

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPagesToShow / 2));

    if (startPage > 2) {
      pages.push(<li key="start-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
        </li>
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(<li key="end-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
    }

    return (
      <ul className="pagination mb-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
        </li>
        {pages}
        {totalPages > 1 && (
          <li className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
          </li>
        )}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        </li>
      </ul>
    );
  };

  return (
    <div className="d-flex flex-column">
      <main className="container flex-fill">
      <h2 className="text-start">ID: {products && products[0] ? products[0].id : 'Laden...'}</h2>
        <div className="card mb-3">
          <div className="card-body overflow-auto" style={{ maxHeight: '75vh', minHeight: '75vh' }}>
            {isLoadingProperties ? (
              <div className="text-center">Loading properties...<span className="spinner-border spinner-border-sm ms-2"></span></div>
            ) : (
              properties.map((property, index) => (
                <div key={index}>
                  <div className="card-body">
                    <div key={index}>
                      <label className="form-label">{property.name}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={property.value}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="footer text-center text-lg-start py-3">
        <div className="container-fluid d-flex flex-column align-items-center">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {isLoadingProducts ? (<div className="text-center">Loading pagination...<span className="spinner-border spinner-border-sm ms-2"></span></div>) : (
              <>
                <div className="me-3">
                  <div>Total {totalProducts} products </div>
                </div>
                <nav>
                  {renderPagination()}
                </nav>
                <div className="d-flex align-items-center ms-3">
                  <span className="me-2">Go to:</span>
                  <input
                    type="number"
                    className="form-control me-2 w-25"
                    value={inputPage}
                    onChange={handleInputPageChange}
                    placeholder="Product"
                  />

                  <button className="btn btn-primary me-2" onClick={handleGoToPage} disabled={!inputPage}>Go</button>
                  <button className="btn btn-success" onClick={handleSave}>Save</button>
                </div>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Editpage;