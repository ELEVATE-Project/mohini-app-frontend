import { IoIosHelpCircle } from "react-icons/io";
import { MdHelpOutline, MdMoreVert, MdOutlineLogout, MdViewList } from "react-icons/md";
import { useState } from "react";
import "./shikshaChatStyle.css"

function Header({ name, hasInfo, isMobileFirst=false, content, logo,showCompanyLogo=false, showTheDots=false }) {
  return (
    <header className={`header-1 ${isMobileFirst ? "header-2" : "header-3"}`}>
      <div className="div59">
        <div className="div60">
          {(showCompanyLogo)&& <img
            src={logo || './images/shikshagrahaLogo.png'}
            height="2rem"
            width="auto"
            alt="shikshalokam logo"
            className="img-1"
          />}
        </div>
      </div>
      {(isMobileFirst || !showTheDots)&&
        <div className="div62">
          {!!name && <div className="div63">{name}</div>}
          {!!hasInfo && <button className="button-12">
            <MdHelpOutline className="icon-3" />
          </button>}
          {!!content && content} 
        </div>
      }
    </header>
  );
}

export default Header;