import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./adduser.css";
import api from '../config/api';
import toast from 'react-hot-toast';

const AddUser = () => {
    const initialUser = {
        name: "",
        email: "",
        address: "",
    };
    
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!user.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (user.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters long';
        } else if (!/^[a-zA-Z\s]+$/.test(user.name.trim())) {
            newErrors.name = 'Name can only contain letters and spaces';
        }
        
        if (!user.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(user.email.trim())) {
            newErrors.email = 'Please provide a valid email address';
        }
        
        if (!user.address.trim()) {
            newErrors.address = 'Address is required';
        } else if (user.address.trim().length < 5) {
            newErrors.address = 'Address must be at least 5 characters long';
        }
        
        return newErrors;
    };

    const submitForm = async (e) => {
        e.preventDefault();
        
        // Validate form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        setLoading(true);
        setErrors({});
        
        try {
            const response = await api.post("/user", {
                name: user.name.trim(),
                email: user.email.trim().toLowerCase(),
                address: user.address.trim(),
            });
            
            toast.success(response.data.message, { position: "top-right" });
            navigate("/");
        } catch (error) {
            console.error("Error adding user:", error);
            
            if (error.status === 400 && error.originalError?.response?.data?.errors) {
                // Handle validation errors from backend
                const backendErrors = {};
                error.originalError.response.data.errors.forEach(err => {
                    backendErrors[err.field] = err.message;
                });
                setErrors(backendErrors);
            } else if (error.status === 409) {
                setErrors({ email: 'User with this email already exists' });
            } else {
                toast.error(error.message || 'Failed to add user', { position: "top-right" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addUser">
            <Link to="/" type="button" className="btn btn-secondary">
                <i className="fa-solid fa-backward"></i> Back
            </Link>
            <h3>Add New User</h3>
            <form className="addUserForm" onSubmit={submitForm}>
                <div className="inputGroup">
                    <label htmlFor="name">Name *</label>
                    <input 
                        type="text"
                        id="name"
                        onChange={inputHandler}
                        name="name"
                        value={user.name}
                        autoComplete="off"
                        placeholder="Enter your name"
                        className={errors.name ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="inputGroup">
                    <label htmlFor="email">E-mail *</label>
                    <input 
                        type="email"
                        id="email"
                        onChange={inputHandler}
                        name="email"
                        value={user.email}
                        autoComplete="off"
                        placeholder="Enter your email"
                        className={errors.email ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="inputGroup">
                    <label htmlFor="address">Address *</label>
                    <input 
                        type="text"
                        id="address"
                        onChange={inputHandler}
                        name="address"
                        value={user.address}
                        autoComplete="off"
                        placeholder="Enter your address"
                        className={errors.address ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
                
                <div className="inputGroup">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add User'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUser;