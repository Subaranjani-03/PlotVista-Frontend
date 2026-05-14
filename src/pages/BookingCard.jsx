import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import { toast } from "react-toastify";
import "./BookingCard.css";

const BookingCard = ({
  item,
  role = "user",
  bookings = [],
  onCancel,
  onConfirm,
  onAssignAgent,
  onAcceptVisit,
  onVisitStatusChange,
  extraButtons,
}) => {
  const navigate = useNavigate();

  const plot = item.plotId;

  /* ================= ASSIGN MODAL STATE ================= */

  const [showAssignModal, setShowAssignModal] = useState(false);

  const [agents, setAgents] = useState([]);

  const [selectedAgent, setSelectedAgent] = useState("");

  const [isUnassign, setIsUnassign] = useState(false);

  /* ================= SCHEDULE MODAL STATE ================= */

  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [scheduleDateTime, setScheduleDateTime] = useState("");

  /* ================= PAYMENT MODAL STATE ================= */

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  /* ================= REMARK STATE ================= */

  const [remarks, setRemarks] = useState(item.remarks || "");

  /* ================= FETCH AGENTS ================= */

  useEffect(() => {
    if (showAssignModal) {
      fetchAgents();
    }
  }, [showAssignModal]);

  const fetchAgents = async () => {
    try {
      const data = await apiRequest("/users?role=agent");

      if (data.status) {
        setAgents(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= HANDLE ASSIGN ================= */

  const handleAssign = async () => {
    try {
      if (!isUnassign && !selectedAgent) {
        toast.error("Please select an agent");
        return;
      }

      // CHECK ALREADY ASSIGNED
      if (
        item.assignedAgent &&
        item.assignedAgent._id &&
        item.assignedAgent._id !== selectedAgent &&
        !isUnassign
      ) {
        toast.error(
          `Already assigned to ${item.assignedAgent.name}. Unassign first to reassign.`,
        );

        return;
      }

      const data = await apiRequest(
        `/bookings/assign-agent/${item._id}`,
        "PUT",
        {
          agentId: isUnassign ? null : selectedAgent,
        },
      );

      if (data.status) {
        if (isUnassign) {
          item.assignedAgent = null;
        } else {
          const selected = agents.find((a) => a._id === selectedAgent);

          item.assignedAgent = selected;
        }

        toast.success(data.message);

        setShowAssignModal(false);

        setSelectedAgent("");

        setIsUnassign(false);

        if (onAssignAgent) {
          onAssignAgent();
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);

      toast.error("Failed to assign agent");
    }
  };

  return (
    <>
      <div
        className={`booking-card ${
          item.status === "Cancelled" ? "cancelled-card" : ""
        }`}
      >
        {/* ================= HEADER ================= */}

        <div className="booking-top">
          <div className="booking-title">
            <h3>{plot?.plotName}</h3>
          </div>

          <span
            className={
              item.visitStatus === "Visited"
                ? "visit-badge visited"
                : "visit-badge pending"
            }
          >
            {item.visitStatus === "Visited" ? "Visited" : "Pending Visit"}
          </span>
        </div>

        {/* ================= BODY ================= */}

        <div className="booking-body">
          {/* USER NAME */}

          {(role === "admin" || role === "agent") && (
            <div className="info-row">
              <div className="left-info">
                <i className="fa-solid fa-user"></i>

                <span className="user-name">
                  {item.userId?.name || "No User"}
                </span>
              </div>
            </div>
          )}

          {/* AGENT + PRICE */}

          <div className="info-row">
            <div className="left-info">
              <i className="fa-solid fa-user-tie"></i>

              <span className="agent-name">
                {item.assignedAgent?.name || "No Agent"}
              </span>
            </div>

            <div className="price">₹ {plot?.totalPrice}</div>
          </div>

          {/* LOCATION */}

          <div className="info-row">
            <div className="left-info">
              <i className="fa-solid fa-location-dot"></i>

              <span>
                {plot?.city}, {plot?.district}
              </span>
            </div>

            <div>
              {plot?.plotSize} {plot?.unit}
            </div>
          </div>

          {/* BOOKING DATE */}

          <div className="info-row">
            <div className="left-info">
              <i className="fa-regular fa-calendar"></i>

              <span>
                Booked{" "}
                {item.bookingDate
                  ? new Date(item.bookingDate).toLocaleDateString("en-IN")
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* VISIT DATE + TIME */}

          <div className="info-row">
            <div className="left-info">
              <i className="fa-regular fa-clock"></i>

              <span>
                {item.visitDate
                  ? `Visit ${new Date(item.visitDate).toLocaleDateString(
                      "en-IN",
                    )} at ${new Date(item.visitDate).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata",
                      },
                    )}`
                  : "Visit Not Scheduled"}
              </span>
            </div>
          </div>

          {/* PAYMENT STATUS */}

          <div className="info-row">
            <div className="left-info">
              <i className="fa-solid fa-money-check-dollar"></i>

              <span>
                Payment : <strong>{item.paymentStatus || "Pending"}</strong>
              </span>
            </div>
          </div>

          {/* ================= REMARKS ================= */}

          {role !== "user" && (
            <div className="remarks-container">
              <label>Remark :</label>

              {/* AGENT CAN EDIT */}

              {role === "agent" ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter remark..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />

                  <button
                    className="save-remarks-btn"
                    onClick={async () => {
                      try {
                        const res = await apiRequest(
                          `/bookings/remarks/${item._id}`,
                          "PUT",
                          { remarks },
                        );

                        if (res.status) {
                          toast.success("Remark updated");

                          item.remarks = remarks;
                        } else {
                          toast.error(res.message);
                        }
                      } catch (err) {
                        console.log(err);

                        toast.error("Failed to update remark");
                      }
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                /* ADMIN READ ONLY */

                <div className="remarks-view">
                  {item.remarks || "No remarks added"}
                </div>
              )}
            </div>
          )}

          {/* ================= AGENT VISIT STATUS ================= */}

          {role === "agent" && (
            <div className="info-row visit-status-row">
              <select
                className="status-dropdown"
                value={item.visitStatus || "Pending"}
                onChange={(e) => onVisitStatusChange(item._id, e.target.value)}
              >
                <option value="Pending">Pending Visit</option>

                <option value="Visited">Visited</option>
              </select>

              <button
                className="assign-btn"
                onClick={() => setShowScheduleModal(true)}
              >
                Schedule
              </button>
            </div>
          )}
        </div>

        {/* ================= ADMIN SECTION ================= */}

        {role === "admin" && (
          <div className="status-section">
            <select
              className="status-dropdown"
              value={item.status}
              onChange={async (e) => {
                try {
                  const value = e.target.value;

                  const res = await apiRequest(
                    `/bookings/status/${item._id}`,
                    "PUT",
                    { status: value },
                  );

                  if (res.status) {
                    toast.success("Status Updated");

                    if (onAssignAgent) {
                      onAssignAgent(); // refresh bookings from parent
                    }
                  } else {
                    toast.error(res.message);
                  }
                } catch (err) {
                  console.log(err);

                  toast.error("Failed to update status");
                }
              }}
            >
              <option value="">Select</option>

              <option value="Pending">Pending</option>

              <option value="Assigned">Assigned</option>

              <option value="Scheduled">Scheduled</option>

              <option value="Confirmed">Confirmed</option>

              <option value="Approved">Approved</option>

              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              className="assign-btn"
              onClick={() => setShowAssignModal(true)}
            >
              Assign Agent
            </button>
          </div>
        )}

        {/* ================= USER SECTION ================= */}

        {role === "user" && (
          <div className="status-section">
            {/* STATUS BADGE */}

            <div className={`status-badge ${item.status?.toLowerCase()}`}>
              {item.status}
            </div>

            {/* PAYMENT BUTTON */}

            {item.status !== "Cancelled" && (
              <button
                className="assign-btn"
                disabled={item.paymentStatus === "Paid"}
                onClick={() => {
                  if (item.paymentStatus !== "Paid") {
                    setShowPaymentModal(true);
                  }
                }}
              >
                {item.paymentStatus === "Paid"
                  ? "Payment Completed"
                  : "Make Payment"}
              </button>
            )}

            {/* CANCEL BUTTON */}

            {item.status !== "Cancelled" && (
              <button className="cancel-btn" onClick={() => onCancel(item._id)}>
                Cancel Booking
              </button>
            )}
          </div>
        )}

        {/* ================= ACTIONS ================= */}

        {/* {role !== "user" && (
          <div className="booking-actions">
            <button className="confirm-btn" onClick={onConfirm}>
              Confirm
            </button>

            <button className="cancel-btn" onClick={() => onCancel(item._id)}>
              Cancel
            </button>

            {extraButtons}
          </div>
        )} */}
      </div>

      {/* ================= ASSIGN AGENT MODAL ================= */}

      {showAssignModal && (
        <div className="overlay">
          <div className="modals">
            <div className="modals-header">
              <h3>Assign Agent</h3>

              <span onClick={() => setShowAssignModal(false)}>✕</span>
            </div>

            <div className="modals-body">
              <div className="fields">
                <label>
                  <input
                    type="checkbox"
                    checked={isUnassign}
                    onChange={(e) => setIsUnassign(e.target.checked)}
                  />
                  Unassign Agent
                </label>
              </div>

              {!isUnassign && (
                <div className="field">
                  <label className="required">Select Agent</label>

                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    <option value="">-- Select Agent --</option>

                    {agents
                      .filter((agent) => {
                        const alreadyAssigned = bookings?.some(
                          (booking) =>
                            booking.assignedAgent?._id === agent._id &&
                            booking._id !== item._id,
                        );

                        return agent.role === "agent" && !alreadyAssigned;
                      })
                      .map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="cancel"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>

              <button className="save" onClick={handleAssign}>
                {isUnassign ? "Unassign" : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SCHEDULE MODAL ================= */}

      {showScheduleModal && (
        <div className="overlay">
          <div className="modals">
            <div className="modals-header">
              <h3>Schedule Visit</h3>

              <span onClick={() => setShowScheduleModal(false)}>✕</span>
            </div>

            <div className="modals-body">
              <div className="field">
                <label>Select Date & Time</label>

                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </button>

              <button
                className="save"
                onClick={async () => {
                  try {
                    if (!scheduleDateTime) {
                      toast.error("Select date and time");
                      return;
                    }

                    const fullDateTime = new Date(scheduleDateTime);

                    const res = await apiRequest(
                      `/bookings/schedule-visit/${item._id}`,
                      "PUT",
                      {
                        visitDate: fullDateTime,
                      },
                    );

                    if (res.status) {
                      toast.success("Visit Scheduled");

                      item.visitDate = fullDateTime;

                      setShowScheduleModal(false);

                      setScheduleDateTime("");
                    } else {
                      toast.error(res.message);
                    }
                  } catch (err) {
                    console.log(err);

                    toast.error("Failed to schedule visit");
                  }
                }}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAYMENT MODAL ================= */}

      {showPaymentModal && (
        <div className="overlay">
          <div className="modals">
            <div className="modals-header">
              <h3>Make Payment</h3>

              <span onClick={() => setShowPaymentModal(false)}>✕</span>
            </div>

            <div className="modals-body">
              <div className="info-row">
                <strong>Plot :</strong> {plot?.plotName}
              </div>

              <div className="info-row">
                <strong>Amount :</strong> ₹ {plot?.totalPrice}
              </div>

              <div className="info-row">
                <strong>Location :</strong> {plot?.city}, {plot?.district}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>

              <button
                className="save"
                onClick={async () => {
                  try {
                    const res = await apiRequest(
                      `/bookings/payment/${item._id}`,
                      "PUT",
                    );

                    if (res.status) {
                      item.paymentStatus = "Paid";

                      toast.success("Payment Successful");

                      setShowPaymentModal(false);
                    } else {
                      toast.error(res.message);
                    }
                  } catch (err) {
                    console.log(err);

                    toast.error("Payment Failed");
                  }
                }}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;
