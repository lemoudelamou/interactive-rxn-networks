//https://react-responsive-modal.leopradel.com/#custom-animation
import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../style/Modal.css';

const InstructionModal = ({ open, onClose }) => {
    return (
        <Modal 
            open={open} 
            onClose={onClose} 
            center
            classNames={{
                overlayAnimationIn: 'customEnterOverlayAnimation',
                overlayAnimationOut: 'customLeaveOverlayAnimation',
                modalAnimationIn: 'customEnterModalAnimation',
                modalAnimationOut: 'customLeaveModalAnimation',
            }}
            animationDuration={800}
        >
            <div className="modal-header">
                <h2 className="modal-header-title">Instructions</h2>
            </div>

            <div className="modal-body">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                    pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
                    hendrerit risus, sed porttitor quam.
                </p>
            </div>

            <div className="modal-footer">
                <button className="close-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default InstructionModal;

