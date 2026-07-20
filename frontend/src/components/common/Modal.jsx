const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
