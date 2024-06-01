import React, { useState } from "react";
const inputStyle = {
  width: "100%",
  border: "1px solid grey",
  borderRadius: "5px",
  height: "40px",
  marginBottom: "15px",
  marginTop: "10px",
  paddingLeft: "10px",
};
const submitBtnStyle = {
  height: "40px",
  border: "1px solid #ffffff",
  borderRadius: "10px",
  width: "195px",
  backgroundColor: "#407bff",
  color: "#ffffff",
  cursor: "pointer",
};

const FormComponent = ({ submitUserForm }) => {
  const userDetails = JSON.parse(localStorage.getItem("userData"));
  // Initialize state for form inputs
  const [formData, setFormData] = useState({
    name: userDetails?.name ? userDetails?.name : "",
    gender: userDetails?.gender ? userDetails?.gender : "",
    email: userDetails?.email ? userDetails?.email : "",
    phone: userDetails?.phone ? userDetails?.phone : "",
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form inputs
  const validate = () => {
    let newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.email && !formData.phone) {
      newErrors.contact = "Either email or phone is required";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // Process form data here
      submitUserForm(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "12px" }}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
      </div>
      <div>
        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      {errors.contact && <span style={{ color: "red" }}>{errors.contact}</span>}
      <button type="submit" style={submitBtnStyle}>
        Submit
      </button>
    </form>
  );
};

export default FormComponent;
