import React from "react";
import MyNavbar from "../navbars/Navbar";
import Github from "../../assets/pics/19-198636_github-logo-png-github-square-logo-png-transparent.png";
export default function contact() {
  return (
    <>
      <div className="contact-page">
        <MyNavbar />
        <div className="contact-content">
          {/* <img src={Github} alt="github" className="github-contact" /> */}
          <div>Github : </div>
          <div>Email</div>
        </div>
      </div>
    </>
  );
}
