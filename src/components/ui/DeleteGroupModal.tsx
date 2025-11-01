import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
}

export const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  groupName
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

  useEffect(() => {
    setIsConfirmEnabled(confirmText.toLowerCase() === 'apagar');
  }, [confirmText]);

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setIsConfirmEnabled(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      onConfirm();
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isConfirmEnabled) {
      handleConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Apagar Grupo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-900 dark:text-white font-medium mb-2">
                Você está prestes a apagar o grupo "{groupName}"
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Esta ação é <strong>irreversível</strong> e todas as notas deste grupo serão perdidas permanentemente.
              </p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium mb-3">
              Para confirmar a exclusão, digite <span className="font-bold">"apagar"</span> no campo abaixo:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite: apagar"
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${
              isConfirmEnabled
                ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            }`}
          >
            Apagar Grupo
          </button>
        </div>
      </div>
    </div>
  );
};