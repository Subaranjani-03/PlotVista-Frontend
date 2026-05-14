import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import Swal from "sweetalert2";
import BookingCard from "../pages/BookingCard";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await apiRequest(`/bookings/my-bookings/${user._id}`);

      if (res.status) {
        setBookings(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cancelBooking = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "This booking will be removed permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await apiRequest(`/bookings/cancel/${id}`, "PUT");

      if (res.status) {
        Swal.fire({
          icon: "success",
          title: "Booking Cancelled",
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
        {bookings.map((item) => (
          <BookingCard
            key={item._id}
            item={item}
            role="user"
            onCancel={cancelBooking}
            onAcceptVisit={(id) => {
              console.log("Accept Visit", id);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MyBooking;
