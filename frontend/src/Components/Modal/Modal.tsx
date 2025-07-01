import type { ReactNode } from 'react';
import "./Modal.scss";
import Skeleton from '../Skeleton/Skeleton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  showSkeleton?: boolean;
}

// Components/Modal/Modal.tsx
const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showSkeleton = false // ← Par défaut à false
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {title && <h3 className="modal-title">{title}</h3>}
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {showSkeleton ? (
            <div className="skeleton-container">
              <Skeleton  />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;