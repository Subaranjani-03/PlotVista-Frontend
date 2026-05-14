import React, { useEffect, useState } from "react";
import UserCard from "../pages/UserCard";
import "./MyCustomer.css";
import { apiRequest } from "../api/api";
import { useUser } from "../context/UserContext";

const MyCustomer = () => {
  const { user } = useUser();

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await apiRequest(`/agent-customers/${user._id}`);

      if (res.status) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page">
      <h2 className="title">My Customers</h2>

      <div className="customer-grid">
        {customers.length === 0 ? (
          <p className="no-data">No customers found</p>
        ) : (
          customers.map((customer) => (
            <UserCard
              key={customer._id}
              user={{
                ...customer,

                image:
                  "https://static.vecteezy.com/system/resources/thumbnails/017/800/528/small/user-simple-flat-icon-illustration-vector.jpg",

                status: customer.status === "active" ? "Active" : "Inactive",

                registered: new Date(customer.createdAt).toLocaleDateString(),
              }}
              showActions={false}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyCustomer;
