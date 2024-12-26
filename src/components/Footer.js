import React from 'react';
import '../style/Footer.css'
import PythonFileDownload from "../utils/PythonFileDownload";


const Footer = () => {

    const currentYear = new Date().getFullYear();


    return(
        <div className="footer-container">
        <div class="footer-left">
          <p>&copy; {currentYear} Fritz-Haber-Institut. All rights reserved.</p>
        </div>
        <PythonFileDownload />
      </div>
    );

}

export default Footer;