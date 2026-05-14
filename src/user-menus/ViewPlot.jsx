import React, { useState, useEffect } from "react";
import PlotCard from "../pages/PlotCard";
import SearchBar from "../pages/SearchBar";
import "./ViewPlot.css";
import { apiRequest } from "../api/api";
import Swal from "sweetalert2";

import PlotMap from "../pages/PlotMap";

const ViewPlot = () => {
  const mode = "view";

  /* ================= STATE ================= */
  const [plots, setPlots] = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const data = await apiRequest("/plots");

      if (data.status) {
        setPlots(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER ================= */
  const filteredPlots = plots.filter((plot) =>
    plot.district?.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= UI ================= */
  return (
    <div className="page">
      {/* SEARCH */}
      <div className="header-row">
        <SearchBar
          placeholder="Search By District..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* MAP COMPONENT */}
      <PlotMap plots={filteredPlots} />

      {/* CARDS */}
      <div className="card-container">
        {filteredPlots.map((plot) => (
          <PlotCard
            key={plot._id}
            plot={{
              ...plot,
              name: plot.plotName,
              survey: plot.surveyNo,
              area: plot.plotSize + " " + plot.unit,
              price: plot.totalPrice,
            }}
            mode={mode}
            onBook={async () => {
              try {
                const user = JSON.parse(localStorage.getItem("user"));

                const res = await apiRequest("/bookings/create", "POST", {
                  userId: user._id,
                  plotId: plot._id,
                });

                if (res.status) {
                  Swal.fire({
                    icon: "success",
                    title: "Plot Booked Successfully",
                    text: "Check Booking page for more details.",
                  });

                  fetchPlots();
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "Booking Not Allowed",
                    text: res.message,
                  });
                }
              } catch (err) {
                console.log(err);

                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Something went wrong",
                });
              }
            }}
            onMore={() => {
              setSelectedPlot(plot);
              setShowPopup(true);
            }}
          />
        ))}
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && selectedPlot && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{selectedPlot.plotName}</h3>

              <span
                onClick={() => {
                  setShowPopup(false);
                  setSelectedPlot(null);
                }}
                style={{ cursor: "pointer" }}
              >
                ✕
              </span>
            </div>

            <div className="modal-body">
              {Object.entries(selectedPlot)
                .filter(
                  ([key]) =>
                    ![
                      "_id",
                      "__v",
                      "plotImage",
                      "latitude",
                      "longitude",
                      "document",
                      "documents",
                      "assignedAgent",
                      "status",
                      "createdAt",
                      "updatedAt",
                    ].includes(key),
                )
                .map(([key, value]) => (
                  <p key={key}>
                    <b>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      :
                    </b>{" "}
                    {value?.toString() || "-"}
                  </p>
                ))}
            </div>

            <div className="modal-footer">
              {selectedPlot?.documents?.length > 0 ? (
                selectedPlot.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-btn"
                  >
                    Download{index + 1}
                  </a>
                ))
              ) : (
                <p>No documents available</p>
              )}

              <button
                className="cancel"
                onClick={() => {
                  setShowPopup(false);
                  setSelectedPlot(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPlot;
