import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import styles from "../styles/Buttons.module.scss";
import Modal from './Modal';
import WhatsAppBooking from './WhatsAppBooking';

const PrenotaButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <a className={styles.button} onClick={() => setShowModal(true)}> 
        <FaWhatsapp size={15} style={{ marginRight: '8px' }} /> Prenota
      </a>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <WhatsAppBooking onSuccess={() => setShowModal(false)} />
      </Modal>
    </>
  );
};

export default PrenotaButton;