import React, { useState, useEffect } from "react";
import UserCard from "../pages/UserCard";
import SearchBar from "../pages/SearchBar";
import UserFormModal from "../pages/UserFormModal";
import "./ManageUser.css";
import Swal from "sweetalert2";
import { apiRequest } from "../api/api";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [modalType, setModalType] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiRequest("/users");

      if (data.status) {
        setUsers(data.data.filter((u) => u.role === "user"));
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch {
      Swal.fire("Server Error", "Cannot fetch users", "error");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = await apiRequest(`/user/${id}`, "DELETE");

        if (data.status) {
          Swal.fire("Deleted!", "User deleted", "success");
          fetchUsers();
        } else {
          Swal.fire("Error", data.message, "error");
        }
      }
    });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);

    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      email: user.email || "",
      address: user.address || "",
      status: user.status === "Active" ? "active" : "inactive",
    });

    setModalType("edit");
    setShowPopup(true);
  };

  const handleUpdate = async () => {
    const data = await apiRequest(
      `/user/${selectedUser._id}`,
      "PUT",
      formData
    );

    if (data.status) {
      Swal.fire("Updated!", "User updated", "success");
      fetchUsers();
      setShowPopup(false);
    } else {
      Swal.fire("Error", data.message, "error");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="page">
      <div className="header-row">
        <h2 className="title">Manage Users</h2>

        <SearchBar
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="user-grid">
        {filteredUsers.map((user) => (
          <UserCard
            key={user._id}
            user={{
              ...user,
              role: "User",
              status: user.status === "active" ? "Active" : "Inactive",
              registered: new Date(user.createdAt).toLocaleDateString(),
              image:
                "https://static.vecteezy.com/system/resources/thumbnails/017/800/528/small/user-simple-flat-icon-illustration-vector.jpg",
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <UserFormModal
        showPopup={showPopup}
        modalType={modalType}
        formData={formData}
        handleChange={handleChange}
        selectedName={selectedUser?.name}
        handleClose={() => setShowPopup(false)}
        handleSubmit={handleUpdate}
      />
    </div>
  );
};

export default ManageUser;