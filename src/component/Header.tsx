import React from "react";
import icon from "../image/fast-food.png"

function Header() {
    return (
        <div style={{display: "flex", alignItems: "flex-end"}}>
            <img style={{maxHeight: "4vw", marginRight: "20px", cursor: "pointer"}}
                 onClick={() => window.location.assign("/")} src={icon} alt={"icon"}/>
            <h1>Fast Food Shop Search Engine</h1>
            <h4 style={{marginLeft: "10px"}}>powered by Elasticsearch</h4>
        </div>

    );
}

export default Header;
