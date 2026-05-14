import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";
import "./Profile.css";
import { apiRequest } from "../api/api";

const Profile = () => {
  const { user, setUser } = useUser();

  const [showModal, setShowModal] = useState(false);

  const [assignedAgent, setAssignedAgent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user?._id) {
      fetchAssignedAgent();
    }
  }, [user]);

  const fetchAssignedAgent = async () => {
    try {
      const res = await apiRequest(`/bookings/my-bookings/${user._id}`);

      if (res.status && res.data.length > 0) {
        const latestBooking = res.data[0];

        setAssignedAgent(latestBooking.assignedAgent || null);
      } else {
        setAssignedAgent(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return null;

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // OPEN MODAL WITH LATEST DATA
  const handleEditOpen = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });

    setShowModal(true);
  };

  // UPDATE USER
  const handleUpdate = async () => {
    try {
      const data = await apiRequest(`/user/${user._id}`, "PUT", formData);

      if (data.status) {
        setUser(data.data);

        localStorage.setItem("user", JSON.stringify(data.data));

        setShowModal(false);

        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "Your profile has been updated!",
          timer: 1000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.message,
        });
      }
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* LEFT */}
        <div className="profile-left">
          <div className="Uavatar">{user.name?.charAt(0).toUpperCase()}</div>

          <h2 className="uname">{user.name}</h2>

          <p className="Uemail">{user.email}</p>

          <div className="badges">
            <span className="badge role">{user.role}</span>

            <span className="badge status">{user.status}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="profile-right">
          <div className="top">
            <h4>CONTACT DETAILS</h4>

            <button className="edit-btn" onClick={handleEditOpen}>
              Edit
            </button>
          </div>

          <div className="info-grid">
            <div>
              <p className="label">Phone</p>

              <p>{user.phone}</p>
            </div>

            <div>
              <p className="label">Member ID</p>

              <p>{user.userId}</p>
            </div>

            <div className="full">
              <p className="label">Address</p>

              <p>{user.address}</p>
            </div>
          </div>

          {/* ASSIGNED AGENT */}
          <div className="agent-Ubox">
            <h4>ASSIGNED AGENT</h4>

            <div className="agent-Ugrid">
              <div>
                <p className="label">Assigned Agent</p>

                <p>{assignedAgent?.name || "Not Assigned"}</p>
              </div>

              <div>
                <p className="label">Phone</p>

                <p>{assignedAgent?.phone || "-"}</p>
              </div>

              <div className="full">
                <p className="label">Experience</p>

                <p>
                  {assignedAgent
                    ? `${assignedAgent.experience || 0} yrs experience`
                    : "No agent assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Profile</h3>

              <span onClick={() => setShowModal(false)}>x</span>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Address</label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="save-btn" onClick={handleUpdate}>
                Save
              </button>

              <button
                className="cancel-btns"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
