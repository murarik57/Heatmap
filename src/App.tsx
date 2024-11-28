import React, { useState } from "react";
import "./App.css";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import ReactTooltip from "react-tooltip";
import * as d3 from "d3-geo";

const COLOR_RANGE = [
  "#99dfff", // Light Sky Blue
  "#99dfff", // Sky Blue
  "#99dfff", // Deeper Sky Blue
  "#99dfff", // Vibrant Blue
  "#33bfff", // Stronger Blue
  "#007fff", // Darker Blue
  "#32cd32", // Lime Green
  "#32cd32", // Forest Green
  "#32cd32", // Dark Green
];

const DEFAULT_COLOR = "#EEE";

const getRandomInt = () => {
  return Math.floor(Math.random() * 10200);
};

const getHeatMapData = () => {
  return [
    { id: 1, state: "Alabama", value: getRandomInt() },
    { id: 2, state: "Alaska", value: getRandomInt() },
    { id: 3, state: "Arizona", value: getRandomInt() },
    { id: 4, state: "Arkansas", value: getRandomInt() },
    { id: 5, state: "California", value: getRandomInt() },
    { id: 6, state: "Colorado", value: getRandomInt() },
    { id: 7, state: "Connecticut", value: getRandomInt() },
    { id: 8, state: "Delaware", value: getRandomInt() },
    { id: 9, state: "Florida", value: getRandomInt() },
    { id: 10, state: "Georgia", value: getRandomInt() },
    { id: 11, state: "Hawaii", value: getRandomInt() },
    { id: 12, state: "Idaho", value: getRandomInt() },
    { id: 13, state: "Illinois", value: getRandomInt() },
    { id: 14, state: "Indiana", value: getRandomInt() },
    { id: 15, state: "Iowa", value: getRandomInt() },
    { id: 16, state: "Kansas", value: getRandomInt() },
    { id: 17, state: "Kentucky", value: getRandomInt() },
    { id: 18, state: "Louisiana", value: getRandomInt() },
    { id: 19, state: "Maine", value: getRandomInt() },
    { id: 20, state: "Maryland", value: getRandomInt() },
    { id: 21, state: "Massachusetts", value: getRandomInt() },
    { id: 22, state: "Michigan", value: getRandomInt() },
    { id: 23, state: "Minnesota", value: getRandomInt() },
    { id: 24, state: "Mississippi", value: getRandomInt() },
    { id: 25, state: "Missouri", value: getRandomInt() },
    { id: 26, state: "Montana", value: getRandomInt() },
    { id: 27, state: "Nebraska", value: getRandomInt() },
    { id: 28, state: "Nevada", value: getRandomInt() },
    { id: 29, state: "New Hampshire", value: getRandomInt() },
    { id: 30, state: "New Jersey", value: getRandomInt() },
    { id: 31, state: "New Mexico", value: getRandomInt() },
    { id: 32, state: "New York", value: getRandomInt() },
    { id: 33, state: "North Carolina", value: getRandomInt() },
    { id: 34, state: "North Dakota", value: getRandomInt() },
    { id: 35, state: "Ohio", value: getRandomInt() },
    { id: 36, state: "Oklahoma", value: getRandomInt() },
    { id: 37, state: "Oregon", value: getRandomInt() },
    { id: 38, state: "Pennsylvania", value: getRandomInt() },
    { id: 39, state: "Rhode Island", value: getRandomInt() },
    { id: 40, state: "South Carolina", value: getRandomInt() },
    { id: 41, state: "South Dakota", value: getRandomInt() },
    { id: 42, state: "Tennessee", value: getRandomInt() },
    { id: 43, state: "Texas", value: getRandomInt() },
    { id: 44, state: "Utah", value: getRandomInt() },
    { id: 45, state: "Vermont", value: getRandomInt() },
    { id: 46, state: "Virginia", value: getRandomInt() },
    { id: 47, state: "Washington", value: getRandomInt() },
    { id: 48, state: "West Virginia", value: getRandomInt() },
    { id: 49, state: "Wisconsin", value: getRandomInt() },
    { id: 50, state: "Wyoming", value: getRandomInt() },
  ];
};

const App: React.FC = () => {
  const [tooltipContent, setTooltipContent] = useState("");
  const [data, setData] = useState(getHeatMapData());

  const geographyStyle = {
    default: {
      stroke: "#607D8B",
      strokeWidth: 0.45,
      outline: "none",
    },
    hover: {
      fill: "#ccc",
      stroke: "#607D8B",
      transition: "all 250ms",
      strokeWidth: 1,
      outline: "none",
    },
    pressed: {
      fill: "#FF5722",
      stroke: "#607D8B",
      strokeWidth: 1,
      outline: "none",
    },
  };

  const colorScale = scaleQuantile<string>()
    .domain(data.map((d) => d.value))
    .range(COLOR_RANGE);

  const onMouseLeave = () => {
    setTooltipContent("");
  };

  return (
    <div className="heat-map-container">
      <div data-tip="">
        <ComposableMap
          projectionConfig={{
            scale: 800,
          }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          projection="geoAlbersUsa"
        >
          <ZoomableGroup disablePanning>
            <Geographies
              geography={
                "https://raw.githubusercontent.com/shawnbot/topogram/master/data/us-states.geojson"
              }
            >
              {({ geographies }) =>
                geographies.map((geo) => {
                  const current = data.find(
                    (s) => s.state === geo.properties.name
                  );
                  const centroid = d3.geoPath().centroid(geo);

                  return (
                    <>
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={
                          current ? colorScale(current.value) : DEFAULT_COLOR
                        }
                        onMouseEnter={() => {
                          const { name } = geo.properties;
                          setTooltipContent(
                            `${name} — ${current?.value ? current.value : 0}`
                          );
                        }}
                        onMouseLeave={onMouseLeave}
                        style={geographyStyle}
                      />
                      <Marker coordinates={centroid}>
                        <text
                          textAnchor="middle"
                          style={{ fontSize: 10, fill: "#000" }}
                        >
                          {current?.value}
                        </text>
                      </Marker>
                    </>
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
  );
};

export default App;
