import React from "react";
import "./background.css"
const BackgroundImagePage = ({ children, ...rest }) => (
  <aside {...rest}>
    <div className="bg-container">{children}</div>
  </aside>
);

export default BackgroundImagePage;
