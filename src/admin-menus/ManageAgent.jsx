import React, { useState, useEffect } from "react";
import UserCard from "../pages/UserCard";
import SearchBar from "../pages/SearchBar";
import UserFormModal from "../pages/UserFormModal";
import "./ManageUser.css";
import Swal from "sweetalert2";
import { apiRequest } from "../api/api";
import { toast } from "react-toastify";

const ManageAgent = () => {
  const [agents, setAgents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    experience: "",
    status: "active",
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  /* ================= FETCH AGENTS ================= */

  const fetchAgents = async () => {
    try {
      const data = await apiRequest("/users");

      if (data.status) {
        setAgents(data.data.filter((u) => u.role === "agent"));
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch {
      Swal.fire("Server Error", "Cannot fetch agents", "error");
    }
  };

  /* ================= FILTER ================= */

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async () => {
    try {
      let data;

      // UPDATE
      if (selectedAgent) {
        const { password, ...updateData } = formData;

        data = await apiRequest(
          `/agent/${selectedAgent._id}`,
          "PUT",
          updateData,
        );
      }

      // ADD
      else {
        data = await apiRequest("/create-agent", "POST", formData);
      }

      if (data.status) {
        toast.success(
          selectedAgent
            ? "Agent updated successfully"
            : "Agent added successfully",
        );

        fetchAgents();

        setShowPopup(false);

        setSelectedAgent(null);

        setFormData({
          name: "",
          phone: "",
          email: "",
          password: "",
          address: "",
          experience: "",
          status: "active",
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server Error");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (agent) => {
    setSelectedAgent(agent);

    setFormData({
      name: agent.name || "",
      phone: agent.phone || "",
      email: agent.email || "",
      password: "",
      address: agent.address || "",
      experience: agent.experience || "",

      status: agent.status === "Active" ? "active" : "inactive",
    });

    setShowPopup(true);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this agent!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const data = await apiRequest(`/agent/${id}`, "DELETE");

        if (data.status) {
          toast.success("Agent deleted successfully");

          fetchAgents();
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Cannot delete agent");
      }
    }
  };

  /* ================= UI ================= */

  return (
    <div className="page">
      <div className="header-row">
        <SearchBar
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="add-btn"
          onClick={() => {
            setSelectedAgent(null);

            setFormData({
              name: "",
              phone: "",
              email: "",
              password: "",
              address: "",
              experience: "",
              status: "active",
            });

            setShowPopup(true);
          }}
        >
          + Add Agent
        </button>
      </div>

      <div className="user-grid">
        {filteredAgents.map((agent) => (
          <UserCard
            key={agent._id}
            user={{
              ...agent,
              role: "Agent",
              status: agent.status === "active" ? "Active" : "Inactive",
              registered: new Date(agent.createdAt).toLocaleDateString(),
              image:
                "https://static.vecteezy.com/system/resources/thumbnails/017/800/528/small/user-simple-flat-icon-illustration-vector.jpg",
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* ================= MODAL ================= */}

      <UserFormModal
        showPopup={showPopup}
        modalType={selectedAgent ? "edit" : "add"}
        formData={formData}
        handleChange={handleChange}
        selectedName={selectedAgent?.name}
        handleClose={() => {
          setShowPopup(false);
          setSelectedAgent(null);
        }}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ManageAgent;
