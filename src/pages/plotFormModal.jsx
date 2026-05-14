import React, { useState, useEffect } from "react";

const initialState = {
  assignedAgent: "",

  plotId: "",
  plotName: "",
  surveyNo: "",
  zone: "",
  projectName: "",
  address: "",
  plotImage: "",
  state: "",
  district: "",
  city: "",
  area: "",
  pincode: "",
  latitude: "",
  longitude: "",
  plotSize: "",
  unit: "Sq.ft",
  dimensions: "",
  pricePerSqft: "",
  totalPrice: "",
  facing: "",
  roadWidth: "",
  approvalType: "",
  cornerPlot: false,
  status: "Available",
  remarks: "",
  documents: [],
};

const PlotFormModal = ({ show, onClose, onSave, selectedPlot }) => {
  const [formData, setFormData] = useState(initialState);

  /* ================= FIXED EFFECT ================= */

  useEffect(() => {
    if (selectedPlot) {
      setFormData({
        ...selectedPlot,

        // IMPORTANT FIX
        assignedAgent: selectedPlot.assignedAgent?._id || "",

        // reset uploaded docs while editing
        documents: [],
      });
    } else if (show) {
      setFormData(initialState);
    }
  }, [selectedPlot, show]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        documents: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* ================= STATUS ================= */

  const setStatus = (status) => {
    setFormData((prev) => ({
      ...prev,
      status,
    }));
  };

  /* ================= UNIT CONVERT ================= */

  const convertToSqft = (size, unit) => {
    switch (unit) {
      case "Sq.m":
        return size * 10.764;

      case "Acres":
        return size * 43560;

      case "Cents":
        return size * 435.6;

      default:
        return size;
    }
  };

  /* ================= AUTO TOTAL PRICE ================= */

  useEffect(() => {
    const size = parseFloat(formData.plotSize);
    const price = parseFloat(formData.pricePerSqft);

    if (isNaN(size) || isNaN(price) || size <= 0 || price <= 0) {
      setFormData((prev) => ({
        ...prev,
        totalPrice: "",
      }));

      return;
    }

    const sqft = convertToSqft(size, formData.unit);

    const total = Math.round(sqft * price);

    setFormData((prev) => ({
      ...prev,
      totalPrice: total,
    }));
  }, [formData.plotSize, formData.pricePerSqft, formData.unit]);

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="overlay">
      <div className="modals-form large-modal">
        {/* HEADER */}

        <div className="modals-header">
          <h3>{selectedPlot ? "Edit Plot" : "Add Plot"}</h3>

          <span onClick={onClose}>✕</span>
        </div>

        {/* BODY */}

        <div className="modals-body">
          {/* BASIC */}

          <div className="section-title">Basic Information</div>

          <div className="grid-2">
            <div className="field">
              <label>Plot ID</label>

              <input
                name="plotId"
                value={formData.plotId}
                onChange={handleChange}
                placeholder="Enter Plot ID"
              />
            </div>

            <div className="field">
              <label>Plot Name</label>

              <input
                name="plotName"
                value={formData.plotName}
                onChange={handleChange}
                placeholder="Enter Plot Name"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Survey Number</label>

              <input
                name="surveyNo"
                value={formData.surveyNo}
                onChange={handleChange}
                placeholder="Enter Survey Number"
              />
            </div>

            <div className="field">
              <label>Zone / Sector</label>

              <input
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                placeholder="Enter Zone / Sector"
              />
            </div>
          </div>

          <div className="field">
            <label>Project / Layout Name</label>

            <input
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Enter Project Name"
            />
          </div>

          <div className="field">
            <label>Full Address</label>

            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Full Address"
            />
          </div>

          <div className="field">
            <label>Plot Image Link</label>

            <input
              name="plotImage"
              value={formData.plotImage}
              onChange={handleChange}
              placeholder="Enter Image URL"
            />
          </div>

          {/* LOCATION */}

          <div className="section-title">Location Details</div>

          <div className="grid-3">
            <div className="field">
              <label>State</label>

              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter State"
              />
            </div>

            <div className="field">
              <label>District</label>

              <input
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter District"
              />
            </div>

            <div className="field">
              <label>City / Village</label>

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City or Village"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Area / Locality</label>

              <input
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Enter Area"
              />
            </div>

            <div className="field">
              <label>Pincode</label>

              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter Pincode"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Latitude</label>

              <input
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Enter Latitude"
              />
            </div>

            <div className="field">
              <label>Longitude</label>

              <input
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Enter Longitude"
              />
            </div>
          </div>

          {/* DIMENSIONS */}

          <div className="section-title">Dimensions & Pricing</div>

          <div className="grid-3">
            <div className="field">
              <label>Plot Size</label>

              <input
                name="plotSize"
                value={formData.plotSize}
                onChange={handleChange}
                placeholder="Enter Plot Size"
              />
            </div>

            <div className="field">
              <label>Unit</label>

              <select name="unit" value={formData.unit} onChange={handleChange}>
                <option value="Sq.ft">Sq.ft</option>

                <option value="Sq.m">Sq.m</option>

                <option value="Acres">Acres</option>

                <option value="Cents">Cents</option>
              </select>
            </div>

            <div className="field">
              <label>Dimensions (L × W)</label>

              <input
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="Eg: 40 x 60"
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="field">
              <label>Price per sq ft</label>

              <input
                name="pricePerSqft"
                value={formData.pricePerSqft}
                onChange={handleChange}
                placeholder="Enter Price per sq ft"
              />
            </div>

            <div className="field">
              <label>Total Price</label>

              <input
                name="totalPrice"
                value={formData.totalPrice}
                readOnly
                placeholder="Auto calculated"
              />
            </div>

            <div className="field">
              <label>Facing</label>

              <select
                name="facing"
                value={formData.facing}
                onChange={handleChange}
              >
                <option value="">Select Facing</option>

                <option>North</option>
                <option>South</option>
                <option>East</option>
                <option>West</option>
              </select>
            </div>
          </div>

          {/* ADDITIONAL */}

          <div className="section-title">Additional Plot Details</div>

          <div className="grid-3">
            <div className="field">
              <label>Road Width (ft)</label>

              <input
                name="roadWidth"
                value={formData.roadWidth}
                onChange={handleChange}
                placeholder="Enter Road Width"
              />
            </div>

            <div className="field">
              <label>Approval Type</label>

              <select
                name="approvalType"
                value={formData.approvalType}
                onChange={handleChange}
              >
                <option value="">Select Approval</option>

                <option>DTCP</option>
                <option>CMDA</option>
                <option>Panchayat</option>
                <option>Corporation</option>
              </select>
            </div>

            <div className="field checkbox-field">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="cornerPlot"
                  checked={formData.cornerPlot}
                  onChange={handleChange}
                />

                <span>Corner Plot</span>
              </label>
            </div>
          </div>

          {/* STATUS */}

          <div className="section-title">Availability Status</div>

          <div className="chips">
            {["Available", "Booked", "Sold", "Blocked"].map((s) => (
              <button
                key={s}
                type="button"
                className={formData.status === s ? "chip active-chip" : "chip"}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* REMARKS */}

          <div className="section-title">Additional Notes</div>

          <div className="field">
            <label>Remarks</label>

            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter any additional remarks..."
            />
          </div>

          {/* DOCUMENTS */}

          <div className="section-title">Attach Documents</div>

          <div className="field">
            <label>Upload Plot Documents</label>

            <input
              type="file"
              name="documents"
              multiple
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />

            {formData.documents.length > 0 && (
              <div className="file-list">
                {formData.documents.map((file, index) => (
                  <p key={index} className="file-item">
                    📄 {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="modal-footer">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="save" onClick={handleSubmit}>
            Save Plot
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlotFormModal;
