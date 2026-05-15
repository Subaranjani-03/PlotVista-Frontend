import axios from "axios";

export const BASE_URL = "https://plotvista-backend-7k5o.onrender.com";

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isFormData = false
) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      data: body ? body : undefined,
    };

    const res = await axios(config);

    return res.data;
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "Server error",
    };
  }
};