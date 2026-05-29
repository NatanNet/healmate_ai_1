// src/components/PopUp.jsx

export default function PopUp({ 
  isOpen, 
  title, 
  children, 
  onClose,
  onConfirm,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {title && (
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        <div className="px-6 py-4">
          {children}
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-[#22B2B0] text-white rounded-lg hover:bg-[#1E9E9D] transition-colors font-medium text-sm shadow-sm"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}