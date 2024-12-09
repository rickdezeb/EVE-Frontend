import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange, inputPage, handleInputPageChange, handleGoToPage, showSaveButton, handleSave }) => {
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

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
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
      <div className="d-flex align-items-center ms-3">
        <span className="me-2">Go to:</span>
        <input
          type="number"
          className="form-control me-2 w-25"
          value={inputPage}
          onChange={handleInputPageChange}
          placeholder="Page"
        />
        <button className="btn btn-primary me-2" onClick={handleGoToPage} disabled={!inputPage}>
          Go
        </button>
        {showSaveButton && (
          <button className="btn btn-success ms-2" onClick={handleSave}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;