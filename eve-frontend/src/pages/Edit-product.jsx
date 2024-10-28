import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetProperties, useUpdateProperty } from '../hooks/PropertyHooks';
import { useGetProducts } from "../hooks/ProductHooks"

function Editpage() {
  const location = useLocation();
  const data = location.state || {};
  const { product, file } = data;

  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const itemsPerPage = 1;
  
  const [selectedProductId, setSelectedProductId] = useState(product.id); 
  const { properties, isLoading: isLoadingProperties, refreshItems } = useGetProperties(selectedProductId);
  const { update, isLoading: isLoadingUpdate } = useUpdateProperty(refreshItems);
  const { products, isLoading: isLoadingProducts } = useGetProducts(file.id);

  const [localProperties, setLocalProperties] = useState(properties);

  useEffect(() => {
    refreshItems();
  }, [selectedProductId]);

  useEffect(() => {
    if (properties) {
      setLocalProperties(properties);
    }
  }, [properties]);

  const handleInputChange = (index, event) => {
    const newProperties = [...properties];
    newProperties[index].value = event.target.value;
    setLocalProperties(newProperties);
  };

  const handleSave = async () => {
    const updatePromises = localProperties.map(property =>
      update(selectedProductId, property.id, property.value)
    );
    await Promise.all(updatePromises);
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const getPaginationNumbers = () => {
    const paginationNumbers = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);

    if (totalPages > maxVisible) {
      if (startPage + maxVisible - 1 > totalPages) {
        startPage = totalPages - maxVisible + 1;
      }
      if (startPage < 1) {
        startPage = 1;
      }
    }

    for (let i = 0; i < maxVisible && startPage <= totalPages; i++, startPage++) {
      paginationNumbers.push(startPage);
    }
    return paginationNumbers;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setInputPage('');
      setSelectedProductId(products[(page - 1) * itemsPerPage].id);
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
    <div className="d-flex flex-column">
      <main className="container flex-fill">
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
                  <div>Total {products.length} products </div>
                </div>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                      </button>
                    </li>
                    {getPaginationNumbers().map((pageNumber) => (
                      <li className={`page-item ${currentPage === pageNumber ? 'active' : ''}`} key={pageNumber}>
                        <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                          {pageNumber}
                        </button>
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
                  <button className="btn btn-primary me-2" onClick={handleGoToPage}>Go</button>
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
