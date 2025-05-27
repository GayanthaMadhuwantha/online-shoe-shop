 import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Register = ({ setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    const [formData, setFormData] = useState({
        FName: "",
        LName: "",
        Address: "",
        Email: "",
        Password: "",
        Role: "Customer",
        PhoneNumber: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3000/auth/register", formData);

            alert(res.data.message);

            // Simulated user object from formData or from res.data
            const user = {
                ...formData,
                id: res.data.user?.id || Date.now(), // fallback if backend doesn't send user ID
            };
            // Set user in local storage and state
            localStorage.setItem("token", res.data.token); // Save token to local storage
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));


            navigate(from); // Redirect back to where user came from (like /checkout)
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="FName" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="LName" placeholder="Last Name" onChange={handleChange} required />
                <input type="text" name="Address" placeholder="Address" onChange={handleChange} required />
                <input type="email" name="Email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="Password" placeholder="Password" onChange={handleChange} required />
                <input type="text" name="PhoneNumber" placeholder="Phone Number" onChange={handleChange} required />
                
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
