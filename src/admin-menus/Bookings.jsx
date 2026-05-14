import React, { useEffect, useState } from "react";
import BookingCard from "../pages/BookingCard";
import { apiRequest } from "../api/api";
import Swal from "sweetalert2";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchAgents();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await apiRequest("/bookings");

      if (res.status) {
        setBookings(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await apiRequest("/users");

      if (res.status) {
        const onlyAgents = res.data.filter((item) => item.role === "agent");

        setAgents(onlyAgents);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const assignAgent = async (bookingId, agentId) => {
    try {
      const res = await apiRequest(
        `/bookings/assign-agent/${bookingId}`,
        "PUT",
        { agentId },
      );

      if (res.status) {
        Swal.fire({
          icon: "success",
          title: "Agent Assigned",
        });

        fetchBookings();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-grid">
        {bookings?.map((item) => (
          <BookingCard
            key={item._id}
            item={item}
            role="admin"
            agents={agents}
            bookings={bookings}
            onAssignAgent={fetchBookings}
          />
        ))}
      </div>
    </div>
  );
};

export default Bookings;
