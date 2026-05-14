import React from "react";
import "./UserFormModal.css";

const UserFormModal = ({
  showPopup,
  modalType,
  formData,
  handleChange,
  handleSubmit,
  handleClose,
  selectedName,
  assignLabel,

  // OLD (ManageUser)
  agents,
  selectedAgent,
  setSelectedAgent,

  // NEW (ManageAgent)
  plots = [],
  selectedPlots = [],
  handlePlotSelect,
}) => {
  if (!showPopup) return null;

  return (
    <div className="overlay">
      <div className="modal">
        {/* ================= HEADER ================= */}

        <div className="modal-header">
          <h3>
            {modalType === "assign"
              ? `Assign ${assignLabel}`
              : modalType === "assignPlot"
              ? "Assign Plots"
              : modalType === "add"
              ? "Add Agent"
              : "Edit Details"}
          </h3>

          <span onClick={handleClose} style={{ cursor: "pointer" }}>
            ✕
          </span>
        </div>

        {/* ================= BODY ================= */}

        <div className="modal-body">
          {/* ================= ADD / EDIT ================= */}

          {(modalType === "edit" || modalType === "add") && (
            <>
              {/* NAME */}

              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* PHONE */}

              <div className="form-group">
                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* EMAIL */}

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* PASSWORD ONLY FOR ADD */}

              {modalType === "add" && (
                <div className="form-group">
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* ADDRESS */}

              <div className="form-group">
                <label>Address</label>

                <input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* EXPERIENCE */}

              {"experience" in formData && (
                <div className="form-group">
                  <label>Experience</label>

                  <input
                    type="number"
                    name="experience"
                    placeholder="Enter experience in years"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* STATUS */}

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>

                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </>
          )}

          {/* ================= ASSIGN AGENT ================= */}

          {modalType === "assign" && (
            <>
              <p>
                Assign {assignLabel} to <strong>{selectedName}</strong>
              </p>

              <div className="form-group">
                <label>Select Agent</label>

                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  <option value="">-- Select Agent --</option>

                  {agents?.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name} ({agent.phone})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* ================= ASSIGN PLOTS ================= */}

          {modalType === "assignPlot" && (
            <>
              <p>
                Assign Plots to <strong>{selectedName}</strong>
              </p>

              <div className="form-group">
                <label>Select Plots</label>

                {plots.map((plot) => (
                  <div key={plot._id}>
                    <input
                      type="checkbox"
                      checked={selectedPlots.includes(plot._id)}
                      onChange={() => handlePlotSelect(plot._id)}
                    />

                    {plot.plotName}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ================= FOOTER ================= */}

        <div className="modal-footer">
          <button className="update-btn" onClick={handleSubmit}>
            {modalType === "assign" || modalType === "assignPlot"
              ? "Assign"
              : modalType === "add"
              ? "Add"
              : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;