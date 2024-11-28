import {React, useState} from 'react';
import Modal from '../utils/Modal.js';
import Image from 'react-bootstrap/Image';
import logo from '../assets/logo-Haber.png'
import '../style/Header.css'



const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    return (
        <div className="header-container">
            <div className="second-container">
                <Image src={logo} alt="Logo" className="logo" roundedCircle />
                <h1 className="title-box">Chemical Reaction Network Explorer</h1>
            </div>
            <button className="instruction-button" onClick={handleOpen}>
                <i className="fa-regular fa-circle-question" style={{ fontSize: 30 }}></i>
            </button>
            <Modal className="instruction-button" open={isModalOpen} onClose={handleClose} />
        </div>

    );


}

export default Header;