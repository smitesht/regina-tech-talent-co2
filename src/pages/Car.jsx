import React, { useEffect, useState } from "react";
import { FaCar } from "react-icons/fa";
import {
  BsFillEmojiFrownFill,
  BsEmojiNeutralFill,
  BsFillEmojiSmileFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";

const Car = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState({});
  const [carModels, setCarModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState({});
  const [runcar, setRunCar] = useState(0);
  const [emmissionResult, setEmmissionResult] = useState({});

  const getAllCars = async () => {
    const response = await fetch("http://localhost:5001/api/v1/cars/make", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    //console.log(data);
    setCars(data);
  };

  const getAllModelOfTheMake = async () => {
    if (selectedCar) {
      console.log(selectedCar.data.id);

      const response = await fetch(
        "http://localhost:5001/api/v1/cars/model/" + selectedCar.data.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      setCarModels(data);
    }
  };

  //console.log(cars.length);

  useEffect(() => {
    getAllCars();

    if (selectedCar.data) {
      console.log("Data", selectedCar.data);
      getAllModelOfTheMake();
    }
  }, [selectedCar]);

  const OnSelectCar = (e) => {
    console.log(e.target.value);
    setSelectedCar(cars[e.target.value]);

    // getAllModelOfTheMake();
  };

  //

  //console.log(selectedCar);

  const OnRunCarChange = (e) => {
    //console.log(e.target.value);
    setRunCar(e.target.value);
  };

  const calculateEmission = async (data) => {
    const response = await fetch(
      "http://localhost:5001/api/v1/calculate/footprint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const res = await response.json();
    setEmmissionResult(res.data);
    // console.log(res);
  };

  const OnCalculateEmissionConsumption = (e) => {
    e.preventDefault();
    console.log(runcar);
    const data = {
      distance_value: runcar,
      vehicle_model_id: selectedModel.data.id,
    };

    calculateEmission(data);
    // console.log(data);
  };

  const OnCarModelSelected = (e) => {
    const carModel = carModels[e.target.value];
    console.log(carModel);
    setSelectedModel(carModel);
  };

  console.log(emmissionResult.attributes);

  const handleSuggestion = () => {
    <h1>Assessment Of Your Vehicle Performance</h1>;
    console.log(emmissionResult);
    if (emmissionResult.attributes) {
      if (emmissionResult.attributes.carbon_mt) {
        const carbon_mt = parseFloat(emmissionResult.attributes.carbon_mt);

        if (carbon_mt >= 2.739) {
          //display red
          return (
            <>
              <label>
                Ohh No! Please check your vehicle engine, for more information
                click <Link>Here</Link>
              </label>
              <div className="red">
                <BsFillEmojiFrownFill />
              </div>
            </>
          );
        } else if (carbon_mt < 2.738 && carbon_mt >= 1.0) {
          // display orange
          return (
            <>
              <label>Okay! Your vehicle emission system is fine.</label>
              <div className="yellow">
                <BsEmojiNeutralFill />
              </div>
            </>
          );
        } else {
          // display green
          return (
            <>
              <label>Awesome! You are eligible for a prize.</label>
              <div className="smile">
                <BsFillEmojiSmileFill />
              </div>
            </>
          );
        }
      }
    }
  };

  const OnUpdateGraph = () => {
    if (emmissionResult.attributes) {
      if (emmissionResult.attributes.carbon_mt) {
        const cm = parseFloat(emmissionResult.attributes.carbon_mt);

        return (
          <div className="summary-table">
            <div className="inline-data">
              <span className="leftalign">Your Footprint:{" " + cm + " "}</span>
              <label
                className="ur-emission"
                style={{
                  width: emmissionResult.attributes.carbon_mt + "%",
                  backgroundColor:
                    cm > 2.74
                      ? "red"
                      : cm > 1.0 && cm < 2.738
                      ? "orange"
                      : "green",
                }}
              ></label>
            </div>

            <div className="inline-data">
              <span className="leftalign">Sasktachewan Footprint: 2.73 </span>
              <label className="sask-footprint"></label>
            </div>
            <div className="inline-data">
              <span className="leftalign">Canada Footprint: 15.50 </span>

              <label className="canada-footprint"></label>
            </div>
            <div className="inline-data">
              <span className="leftalign">World Footprint: 4.79 </span>
              <label className="world-footprint"></label>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="car-container">
      <div className="car-emmision-calc-wrapper">
        <div className="car-header">
          <FaCar className="car-logo" />
          <h2>Vehicle Carbon Emission Calculator</h2>
        </div>
        <form className="form-wrapper">
          <div className="input-group">
            <label>Select Make: </label>
            <select onChange={(e) => OnSelectCar(e)}>
              {cars.map((car, indx) => {
                return (
                  <option key={indx} value={indx}>
                    {car.data.attributes.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="input-group">
            <label>Select Model: </label>

            <select onChange={(e) => OnCarModelSelected(e)}>
              {carModels.length > 0
                ? carModels.map((carmodel, indx) => {
                    return (
                      <option key={indx} value={indx}>
                        {carmodel.data.attributes.name +
                          " - " +
                          carmodel.data.attributes.year}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="distance">Distance (in Miles): </label>
            <input
              type="number"
              placeholder="How many miles you run the car?"
              value={runcar}
              name="runcar"
              onChange={(e) => OnRunCarChange(e)}
            />
          </div>
          {/*<div className="current-data">
            {selectedModel.data === undefined ? null : (
              <div>
                <h3>Input Data</h3>
                <h4>Car Brand: {selectedCar.data.attributes.name}</h4>
                <h4>Car Model: {selectedModel.data.attributes.name}</h4>
                <h4>Car Model Year: {selectedModel.data.attributes.year}</h4>
                <h4>Milage (in Miles): {runcar}</h4>
                <hr />
              </div>
            )}
            </div>*/}
          <button
            className="btn"
            onClick={(e) => OnCalculateEmissionConsumption(e)}
          >
            Calculate
          </button>
        </form>
        {emmissionResult.attributes ? (
          <div className="result-wrapper">
            <h2>Your Vehicle Carbon Emission Result</h2>
            <div className="inline">
              <h4>Carbon Emmission Consumption:</h4>
              <span>
                {emmissionResult.attributes.carbon_mt} (Metric Tonnes)
              </span>
            </div>
            <div className="inline">
              <h4>Make:</h4>
              <span>{emmissionResult.attributes.vehicle_make}</span>
            </div>
            <div className="inline">
              <h4>Model:</h4>
              <span>{emmissionResult.attributes.vehicle_model}</span>
            </div>
            <div className="inline">
              <h4>Year:</h4>
              <span>{emmissionResult.attributes.vehicle_year}</span>
            </div>
            <div className="inline">
              <h4>Milage / Distance (in Mile):</h4>
              <span>{emmissionResult.attributes.distance_value}</span>
            </div>
          </div>
        ) : null}
        <div className="comparision-wrapper">
          <div className="comparision-status">
            {emmissionResult !== undefined ? handleSuggestion() : null}
          </div>
        </div>
        <div className="summary-table">{OnUpdateGraph()}</div>
      </div>
    </div>
  );
};

export default Car;
