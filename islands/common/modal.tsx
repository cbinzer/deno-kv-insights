import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const Modal: FunctionComponent<ModalProps> = ({ open = false, onOpen = () => {}, onClose = () => {}, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      openModal();
    } else {
      closeModal();
    }
  }, [open]);

  const openModal = () => {
    addModalBackdrop();
    setIsOpen(true);

    setTimeout(() => {
      showModalBackdrop();
      setIsVisible(true);

      onOpen();
    }, 150);
  };

  const closeModal = () => {
    hideModalBackdrop();
    setIsVisible(false);

    setTimeout(() => {
      setIsOpen(false);
      removeModalBackdrop();

      onClose();
    }, 150);
  };

  const addModalBackdrop = () => {
    let modalBackdrop = document.body.querySelector('.fade.modal-backdrop');
    if (!modalBackdrop) {
      const modalBackdrop = document.createElement('div');
      modalBackdrop.className = 'fade modal-backdrop';
      document.body.append(modalBackdrop);
    }
  };

  const showModalBackdrop = () => {
    let modalBackdrop = document.body.querySelector<HTMLDivElement>('.fade.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.classList.add('show');
    }
  };

  const hideModalBackdrop = () => {
    let modalBackdrop = document.body.querySelector<HTMLDivElement>('.fade.modal-backdrop.show');
    if (modalBackdrop) {
      modalBackdrop.classList.remove('show');
    }
  };

  const removeModalBackdrop = () => {
    const modalBackdrop = document.body.querySelector('.fade.modal-backdrop');
    modalBackdrop?.remove();
  };

  return (
    <div
      class={`create-entry-modal modal fade ${isVisible ? 'show' : ''}`}
      tabIndex={-1}
      style={{ display: isOpen ? 'block' : undefined }}
    >
      <div class='modal-dialog'>
        <div class='modal-content'>
          {children}
        </div>
      </div>
    </div>
  );
};

export interface ModalProps {
  open: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export default Modal;
