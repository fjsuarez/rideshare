import React from "react";
import "./App.css";
import ProfilePanel from "./ProfilePanel";
import ListPanel from "./ListPanel";
import MapPanel from "./MapPanel";

function App() {
  return (
    <div className="app-container">
      {" "}
      <div className="column profile-column">
        {" "}
        <ProfilePanel />{" "}
      </div>{" "}
      <div className="column list-column">
        {" "}
        <ListPanel />{" "}
      </div>{" "}
      <div className="column map-column">
        {" "}
        <MapPanel />{" "}
      </div>{" "}
    </div>
  );
}

export default App;
