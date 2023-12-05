import React from "react";
import "./Link.css"; // Import the CSS file for styling

const Link = ({ url, text, emoji }) => {
  return (
    <a href={url} className="animated-link" target="_blank">
      <span className="emoji">{emoji}</span> {text}
    </a>
  );
};

export default Link;
