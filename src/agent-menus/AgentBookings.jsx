import React, { useEffect, useState } from "react";
import BookingCard from "../pages/BookingCard";
import { apiRequest } from "../api/api";

const AgentBookings = () => {

  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const res = await apiRequest(
        `/bookings/agent/${user._id}`
      );

      if (res.status) {
        setBookings(res.data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const updateVisitStatus = async (
    bookingId,
    visitStatus
  ) => {

    try {

      const res = await apiRequest(
        `/bookings/visit-status/${bookingId}`,
        "PUT",
        { visitStatus }
      );

      if (res.status) {
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
            role="agent"
            onVisitStatusChange={updateVisitStatus}
          />

        ))}

      </div>

    </div>
  );
};

export default AgentBookings;