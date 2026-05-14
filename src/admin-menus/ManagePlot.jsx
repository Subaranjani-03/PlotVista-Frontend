import React, { useState, useEffect } from "react";
import PlotCard from "../pages/PlotCard";
import SearchBar from "../pages/SearchBar";
import Swal from "sweetalert2";
import "./ManagePlot.css";
import PlotFormModal from "../pages/PlotFormModal";
import { toast } from "react-toastify";
import { apiRequest, BASE_URL } from "../api/api";

const ManagePlot = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [plots, setPlots] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(null);

  /* ================= FETCH PLOTS ================= */

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

  /* ================= SAVE ================= */
  const handleSave = async (formData) => {
    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "documents") {
          if (formData.documents?.length > 0) {
            formData.documents.forEach((file) => {
              form.append("documents", file);
            });
          }
        } else if (key === "assignedAgent") {
          form.append("assignedAgent", formData.assignedAgent || "null");
        } else {
          form.append(key, formData[key] ?? "");
        }
      });

      const data = await apiRequest(
        selectedPlot ? `/plots/${selectedPlot._id}` : "/plots",
        selectedPlot ? "PUT" : "POST",
        form,
        true,
      );

      if (data.status) {
        toast.success(
          
          selectedPlot
            ? "Plot updated successfully"
            : "Plot added successfully",
        );

        fetchPlots();
        setShowPopup(false);
        setSelectedPlot(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this plot!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const data = await apiRequest(`/plots/${id}`, "DELETE");

        if (data.status) {
          fetchPlots();

          Swal.fire("Deleted!", "Plot deleted successfully", "success");
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (err) {
        Swal.fire("Error", "Cannot delete plot", "error");
      }
    }
  };

  /* ================= FILTER ================= */

  const filteredPlots = plots.filter((plot) =>
    plot.district?.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= UI ================= */

  return (
    <div className="page">
      <div className="header-row">
        <SearchBar
          placeholder="Search By District..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="add-btn"
          onClick={() => {
            setSelectedPlot(null);
            setShowPopup(true);
          }}
        >
          + Add Plot
        </button>
      </div>

      {filteredPlots.length > 0 && (
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
              mode="manage"
              onEdit={() => {
                setSelectedPlot(plot);
                setShowPopup(true);
              }}
              onDelete={() => handleDelete(plot._id)}
            />
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}

      <PlotFormModal
        show={showPopup}
        onClose={() => {
          setShowPopup(false);
          setSelectedPlot(null);
        }}
        onSave={handleSave}
        selectedPlot={selectedPlot}
      />
    </div>
  );
};

export default ManagePlot;
