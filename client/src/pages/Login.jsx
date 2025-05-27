import React, { useState } from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";

const Login = ({ setUser }) => {
    const navigate = useNavigate(); // Import useNavigate from react-router-dom
    const location = useLocation();
    const [credentials, setCredentials] = useState({ Email: "", Password: "" });

    const from = location.state?.from || "/";

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3000/auth/login", credentials);
            alert(res.data.message);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(setUser));

            alert("Token: " + res.data.token);
            setUser(res.data.user);
            navigate(from); // Redirect to homepage after successful login
        } catch (err) {
            alert(err  || "Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="Email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="Password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
