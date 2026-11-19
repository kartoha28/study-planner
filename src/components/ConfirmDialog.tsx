import React from 'react';
import './ConfirmDialog.scss';

interface ConfirmDialogProps {
  title: string;
  message: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  isSubmitting,
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={() => !isSubmitting && onCancel()}
    >
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h2>
        <p className="confirm-dialog__text">{message}</p>

        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="confirm-dialog__cancel-btn"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Скасувати
          </button>
          <button
            type="button"
            className="confirm-dialog__confirm-btn"
            disabled={isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? 'Видалення...' : 'Видалити'}
          </button>
        </div>
      </div>
    </div>
  );
};
