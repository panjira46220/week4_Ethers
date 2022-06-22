import React from "react";
import Topbar from "../components/Topbar";

const NavLayout: React.FC<React.HTMLProps<HTMLElement>> = (props) => {
  return (
    <div className=" bg-lightbg ">
        <Topbar />
      
       
          {props.children}
        
     
      
    </div>
  );
};

export default NavLayout;