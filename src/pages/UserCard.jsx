import React from "react";
import "../pages/UserCard.css";

const UserCard = ({
  user,
  onEdit,
  onDelete,
  onAssign, // generic assign function
  showActions = true,
  showAssign = false,
  assignLabel = "Assign", // dynamic label
}) => {
  return (
    <div className="user-card">
      {/* PROFILE */}
      <div className="profile">
        <img src={user.image} alt="profile" className="avatar" />

        <div>
          <h3 className="name">{user.name}</h3>

          <p className="user-id">ID #{user.userId}</p>

          <span
            className={`status-badge ${
              user.status === "Active" ? "active" : "inactive"
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* DETAILS */}
      <div className="details">
        <p>
          <i className="fa-solid fa-phone"></i>
          +91 {user.phone}
        </p>

        <p>
          <i className="fa-solid fa-user"></i>
          {user.role}
        </p>

        <p>
          <i className="fa-solid fa-calendar"></i>
          Registered {user.registered}
        </p>
      </div>

      {showActions && (
        <>
          <hr />

          <div className="actions">
            {/* EDIT */}
            <button
              className="icon-btn edit-btn"
              onClick={() => onEdit(user)}
              title="Edit"
            >
              <i className="fa-solid fa-pen"></i>
            </button>

            {/* DELETE */}
            <button
              className="icon-btn delete-btn"
              onClick={() => onDelete(user._id)}
              title="Delete"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCard;
