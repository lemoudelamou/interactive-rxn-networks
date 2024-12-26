import { React, useState } from 'react';
import Modal from '../modals/InstructionModal.js';
import Image from 'react-bootstrap/Image';
import logo from '../assets/logo-Haber.png';
import '../style/Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); 
    const location = useLocation(); 

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    const handleNavigateToGraphList = () => {
        navigate('/graph-list');
    };

    const handleNavigateHome = () => {
        navigate('/'); 
    };

    const isHomePage = location.pathname === '/';

    return (
        <div className="header-container">
            <div className="second-container">
                <Link to="/" className="logo-link" title="Go to Home">
                    <Image src={logo} alt="Logo" className="logo" roundedCircle />
                </Link>
                <h1 className="title-box">Chemical Reaction Network Explorer</h1>
            </div>
            <button 
                className="instruction-button" 
                data-tooltip="Show instructions"
                onClick={handleOpen}
            >
                <i className="fa-regular fa-circle-question" style={{ fontSize: 30 }}></i>
            </button>
            
            <button 
                className="navigate-button" 
                onClick={isHomePage ? handleNavigateToGraphList : handleNavigateHome}
                data-tooltip={isHomePage ? "Go to Graph List" : "Go to Home"}>
                
                <i className={isHomePage ? "fa-solid fa-list" : "fa-solid fa-house"}></i>
            </button>

            <Modal className="instruction-button" open={isModalOpen} onClose={handleClose} />
        </div>
    );
};

export default Header;


