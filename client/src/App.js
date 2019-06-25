import React from "react";
import "./App.css";
import Form from "./components/Form";

import NavBar from "./components/NavBar";

const App = () => {
  return (
    <div className="">
      <NavBar />
      <div className="center">
        <Form />
      </div>
    </div>
  );
};

export default App;
