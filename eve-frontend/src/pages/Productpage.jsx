import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlus, faTrash, faSortAlphaAsc, faSortNumericAsc } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useGetProducts, useAddProduct, useDeleteProduct } from '../hooks/ProductHooks';

const Property = ({ product, file }) => {
  const navigate = useNavigate();
  const loadEditPage = () => {
    navigate("/editpage", { state: { product, file } });
  }
  return (
    <div>
      <button onClick={loadEditPage}>
        {product.id}
      </button>
    </div>
  )

}

export default function ProductPage() {
  const location = useLocation();
  const data = location.state || {};
  const { file } = data;

  const { products, isLoading: isLoadingProducts, refreshItems } = useGetProducts(file.id);
  const { remove, isLoading: isLoadingDelete } = useDeleteProduct(refreshItems);
  const { add, isLoading: isLoadingAdd } = useAddProduct(refreshItems);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleDeleteProducts = async () => {
    try {
      await Promise.all(selectedProducts.map(productId => remove(productId)));
      setSelectedProducts([]);
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await add(file.id);
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleSelectAllProducts = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(product => product.id));
    }
    else {
      setSelectedProducts([]);
    }
  }

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.includes(productId)
        ? prevSelectedProducts.filter((id) => id !== productId)
        : [...prevSelectedProducts, productId]
    );
  };

  if (isLoadingProducts) {
    return <div className="text-center">Loading products...<span className="spinner-border spinner-border-sm ms-2"></span></div>;
  }

  return (
    <main className="container mt-4">
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>{file.name}</h4>
            <div className="d-flex">
              <button className="btn btn-primary me-2">
                <FontAwesomeIcon icon={faDownload} className="text-white" />
              </button>
              <button type="button" className="btn btn-primary me-2" onClick={handleAddProduct}>
              {isLoadingAdd ? <span className="spinner-border spinner-border-sm"></span> : <FontAwesomeIcon icon={faPlus} className="text-white" />}
              </button>
              <button className="btn btn-danger" onClick={handleDeleteProducts} disabled={selectedProducts.length === 0}>
              {isLoadingDelete ? <span className="spinner-border spinner-border-sm"></span> : <FontAwesomeIcon icon={faTrash} />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search for a file..."
            />
          </div>

          <table className="table table-auto table-hover align-middle">
            <thead>
              <tr>
                <th scope="col"><input type="checkbox" className="me-2" onChange={handleSelectAllProducts} checked={selectedProducts.length === products.length && products.length > 0} /></th>
                <th scope="col">Product Identifier <FontAwesomeIcon icon={faSortAlphaAsc} /></th>
                <th scope="col">Last Updated <FontAwesomeIcon icon={faSortNumericAsc} /></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {products.length > 0 ? products.map((product) => (
                <tr key={product.id}>
                  <td><input type="checkbox" className="me-2" checked={selectedProducts.includes(product.id)} onChange={() => handleSelectProduct(product.id)} /> </td>
                  <td><Property product={product} file={file} /></td>
                  <td>{product.lastUpdated}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No products found.</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

