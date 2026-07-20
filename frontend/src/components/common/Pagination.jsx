const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center gap-2 mt-5">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Sebelumnya
      </button>

      <span className="px-4 py-2">
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Selanjutnya
      </button>
    </div>
  );
};

export default Pagination;
