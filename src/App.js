import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Header from "./components/header/Header";
import Car from "./pages/Car";
import House from "./pages/House";
import Flight from "./pages/Flight";

function App() {
  return (
    <div className="main-container">
      <Header />
      <Routes>
        <Route path="/" element={<Car />} />
        <Route path="/house" element={<House />} />
        <Route path="/flight" element={<Flight />} />
      </Routes>
    </div>
  );
}

export default App;
