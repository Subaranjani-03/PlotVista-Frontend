import React, { useEffect, useState } from "react";
import PlotCard from "../pages/PlotCard";
import { apiRequest } from "../api/api";
import { useUser } from "../context/UserContext";

const AssignedPlot = () => {

  const { user } = useUser();

  const [assignedPlots, setAssignedPlots] = useState([]);

  useEffect(() => {
    fetchAssignedPlots();
  }, []);

  const fetchAssignedPlots = async () => {

    try {

      const res = await apiRequest(
        `/bookings/agent/${user._id}`
      );

      if (res.status) {

        // GET ONLY PLOT DETAILS
        const plots = res.data.map(
          (booking) => booking.plotId
        );

        // REMOVE DUPLICATE PLOTS
        const uniquePlots = [];

        const ids = new Set();

        plots.forEach((plot) => {

          if (
            plot &&
            !ids.has(plot._id)
          ) {

            ids.add(plot._id);

            uniquePlots.push(plot);

          }
        });

        setAssignedPlots(uniquePlots);

      }

    } catch (err) {

      console.log(err);

    }
  };

  return (
    <div className="page">

      <div className="card-container">

        {assignedPlots.length === 0 ? (

          <p className="no-data">
            No plots assigned yet
          </p>

        ) : (

          assignedPlots.map((plot) => (

            <PlotCard
              key={plot._id}
              plot={{
                ...plot,
                name: plot.plotName,
                survey: plot.surveyNo,
                area:
                  plot.plotSize +
                  " " +
                  plot.unit,
                price: plot.totalPrice,
                location: plot.city,
                type: plot.approvalType,
              }}
              mode="assigned"
            />

          ))

        )}

      </div>

    </div>
  );
};

export default AssignedPlot;