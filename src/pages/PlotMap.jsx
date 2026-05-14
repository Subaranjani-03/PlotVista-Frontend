import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ================= RED MARKER ICON ================= */

const RedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const PlotMap = ({ plots }) => {
  const defaultCenter = [13.0827, 80.2707];

  return (
    <div style={{ width: "100%", height: "350px", marginBottom: "15px" }}>
      <MapContainer
        center={defaultCenter}
        zoom={8}
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {plots.map((plot) => {
          const lat = parseFloat(plot.latitude);
          const lng = parseFloat(plot.longitude);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={plot._id}
              position={[lat, lng]}
              icon={RedIcon}
            >
              <Popup>
                <b>{plot.plotName}</b>
                <br />
                {plot.district}
                <br />
                {plot.plotSize} {plot.unit}
                <br />
                ₹ {plot.totalPrice}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PlotMap;