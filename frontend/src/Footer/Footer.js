import React from "react";
import {
  FaEnvelope,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import "./Footer.css";
import mernLogo from "utils/MERNlogo/MERN-logo_adobe_express.svg";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="made-with">
          Made with{" "}
          <img src={mernLogo} loading="lazy" className="mern_logo" alt="MERN" />{" "}
          by Yaman Saini
        </div>
        <br></br>
        <div className="social-icons">
          <a
            href="mailto:yamansaini0@gmail.com@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope className="icon" />
          </a>
          <a
            href="https://www.linkedin.com/in/yaman-saini-80b749200/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="icon" />
          </a>
          <a
            href="https://www.instagram.com/yamansaini0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="icon" />
          </a>
          <a
            href="https://twitter.com/yamansaini0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="icon" />
          </a>
          <a
            href="https://github.com/yamansaini0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
