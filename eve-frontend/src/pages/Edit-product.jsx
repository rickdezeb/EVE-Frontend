import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetProperties, useUpdateProperty } from '../hooks/PropertyHooks';
import { toast } from 'react-toastify';
import { useGetProducts } from "../hooks/ProductHooks";
import Pagination from '../components/Pagination';

function Editpage() {
  const location = useLocation();
  const data = location.state || {};
  const { product, file, indexation } = data;

  const [currentPage, setCurrentPage] = useState(indexation || 1);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [inputPage, setInputPage] = useState('');
  const itemsPerPage = 1;

  const [selectedProductId, setSelectedProductId] = useState(product.id);
  const { properties, isLoading: isLoadingProperties, refreshItems } = useGetProperties(selectedProductId);
  const { update, isLoading: isLoadingUpdate } = useUpdateProperty(refreshItems);
  const { products, totalProducts, isLoading: isLoadingProducts } = useGetProducts(file.id, currentPage - 1, itemsPerPage);

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
    const selectedProduct = products.find((p) => p.id === selectedProductId);
    if (selectedProduct) {
      setCurrentProduct(selectedProduct);
    }
  }, [selectedProductId, products]);

  useEffect(() => {
    if (products.length > 0) {
    setSelectedProductId(products[0]?.id);
    }
  }, [products[0]?.id]);

  const handleInputChange = (index, event) => {
    const newProperties = [...properties];
    newProperties[index].value = event.target.value;
    setLocalProperties(newProperties);
  };

  const handleSave = async () => {
    const updatePromises = localProperties.map(property =>
      update(selectedProductId, property.id, property.value)
    );

    try {
      await Promise.all(updatePromises);
      toast.success("Properties updated successfully.", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update properties.", { theme: "colored" });
    }
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setInputPage('');

      if (products.length > 0) {
        setSelectedProductId(products[0]?.id);
      }
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
        <h2 className="text-start">ID: {currentProduct ? currentProduct.id : 'Laden...'}</h2>
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
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    inputPage={inputPage}
                    handleInputPageChange={handleInputPageChange}
                    handleGoToPage={handleGoToPage}
                    showSaveButton={true}
                    handleSave={handleSave}
                  />
                </nav>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Editpage;