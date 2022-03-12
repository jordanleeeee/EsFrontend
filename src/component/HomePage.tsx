import magnifier from "../image/magnifier.png"
import aggregate from "../image/aggregate.png"
import Header from "./Header";
import React from "react";

function HomePage() {

    return (
        <>
            <Header/>
            <div style={{display: "flex", justifyContent: "space-around", marginTop: "15vh"}}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer"}}
                     onClick={() => {
                         window.location.assign("/search")
                     }}>
                    <img style={{maxHeight: "15vw"}} src={magnifier} alt={"search icon"}/>
                    <h2 style={{fontSize: '32px'}}>Searching</h2>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer"}}
                     onClick={() => window.location.assign("/aggregation")}>
                    <img style={{maxHeight: "15vw"}} src={aggregate} alt={"aggregate icon"}/>
                    <h2 style={{fontSize: '32px'}}>Aggregate</h2>
                </div>
            </div>
        </>
    );
}

export default HomePage;
