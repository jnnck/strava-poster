import { useRef, useEffect, useState } from "react";
import Map, { Layer, Source } from "react-map-gl";
import bbox from "@turf/bbox";

import "mapbox-gl/dist/mapbox-gl.css";

import "./App.css";
import toGeoJSON from "@mapbox/togeojson";
import Input from "./Input";
import Label from "./Label";
import { useForm, useWatch } from "react-hook-form";

function App() {
  const mapRef = useRef();
  const [geoJSON, setGeoJSON] = useState();
  const [mapDimensions, setMapDimensions] = useState({
    height: 500,
    width: 500,
  });

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      height: 250,
      width: 250,
      dpi: 300,
      lineWidth: 4,
    },
  });

  const lineWidth = watch("lineWidth");

  const onSubmit = (data) => {
    const newMapDimensions = { ...mapDimensions };
    const dpi = data.dpi || 300;
    const dpmm = dpi / 2.54 / 10;

    if (data.width) {
      newMapDimensions.width = data.width * dpmm;
    }

    if (data.height) {
      newMapDimensions.height = data.height * dpmm;
    }

    setMapDimensions(newMapDimensions);
    setTimeout(() => mapRef.current.resize(), 1000);
  };

  // Get the coords, transpose them to geoJSON
  useEffect(() => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var geojson = toGeoJSON.gpx(
          new DOMParser().parseFromString(xhttp.responseText, "text/xml")
        );

        setGeoJSON(geojson);
      }
    };

    xhttp.open("GET", "/halve.gpx", true);
    xhttp.send();
  }, []);

  // Update the bounds once we know the coords.
  useEffect(() => {
    if (geoJSON) {
      const [minLng, minLat, maxLng, maxLat] = bbox(
        geoJSON.features[0].geometry
      );
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 40, duration: 1000 }
      );
    }
  }, [geoJSON]);

  const dataLayer = {
    id: "outline",
    type: "line",
    source: "gpx",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": parseInt(lineWidth)
    },
  };

  return (
    <>
      <div className="flex h-full">
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                placeholder="250"
                suffix="mm"
                type="number"
                {...register("width")}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                placeholder="250"
                suffix="mm"
                type="number"
                {...register("height")}
              />
            </div>
            <div>
              <Label htmlFor="dpi">DPI</Label>
              <Input
                id="dpi"
                placeholder="300"
                type="number"
                {...register("dpi")}
              />
            </div>

            <div>
              <Label htmlFor="dpi">Line Width</Label>
              <Input
                id="lineWidth"
                placeholder="4"
                type="number"
                {...register("lineWidth")}
              />
            </div>
            <input type="submit" />
          </form>
        </div>
        <div className="grow bg-slate-300 flex items-center justify-center">
          <div className="shadow-md w-48 h-48" style={{ ...mapDimensions }}>
            <Map
              ref={mapRef}
              initialViewState={{
                latitude: 37.78,
                longitude: -122.4,
                zoom: 11,
              }}
              mapStyle={"mapbox://styles/jannickv/cm3ec3qbt004d01pf0e5eewor"}
              mapboxAccessToken={
                "pk.eyJ1IjoiamFubmlja3YiLCJhIjoiY2pxMmZrMXNtMTBpcjQzbWw4dDd0bnlxNCJ9.qjmpQBAi4CCf31kWZZCA0Q"
              }
            >
              {!!geoJSON && (
                <Source type="geojson" data={geoJSON}>
                  <Layer {...dataLayer} />
                </Source>
              )}
            </Map>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
