import { useEffect, useRef } from "react";
import styles from "./home.module.css";

function Modal({ openModal, closeModal, children }) {
  const ref = useRef();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog className={styles.modal} ref={ref} onCancel={closeModal}>
      {children}
    </dialog>
  );
}

export default Modal;
