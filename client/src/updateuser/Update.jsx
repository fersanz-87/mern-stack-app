import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./update.css";
import api from '../config/api';
import toast from 'react-hot-toast';

const UpdateUser = () => {
    const initialUser = {
        name: "",
        email: "",
        address: "",
    };
    
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/user/${id}`);
            
            if (response.data.success) {
                setUser(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            toast.error(error.message || 'Failed to fetch user data', { position: "top-right" });
            navigate('/');
        } finally {
            setLoading(false);
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
        
        setUpdating(true);
        setErrors({});
        
        try {
            const response = await api.put(`/update/user/${id}`, {
                name: user.name.trim(),
                email: user.email.trim().toLowerCase(),
                address: user.address.trim(),
            });
            
            if (response.data.success) {
                toast.success(response.data.message, { position: "top-right" });
                navigate("/");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            
            if (error.status === 400 && error.originalError?.response?.data?.errors) {
                // Handle validation errors from backend
                const backendErrors = {};
                error.originalError.response.data.errors.forEach(err => {
                    backendErrors[err.field] = err.message;
                });
                setErrors(backendErrors);
            } else if (error.status === 409) {
                setErrors({ email: 'Email already exists' });
            } else {
                toast.error(error.message || 'Failed to update user', { position: "top-right" });
            }
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="addUser">
                <div className="loading">
                    <h3>Loading user data...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="addUser">
            <Link to="/" className="btn btn-secondary">
                <i className="fa-solid fa-backward"></i> Back
            </Link>
            <h3>Update User</h3>
            <form className="addUserForm" onSubmit={submitForm}>
                <div className="inputGroup">
                    <label htmlFor="name">Name *</label>
                    <input 
                        type="text"
                        id="name"
                        value={user.name}
                        onChange={inputHandler}
                        name="name"
                        autoComplete="off"
                        placeholder="Enter your name"
                        className={errors.name ? 'error' : ''}
                        disabled={updating}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="inputGroup">
                    <label htmlFor="email">E-mail *</label>
                    <input 
                        type="email"
                        id="email"
                        value={user.email}
                        onChange={inputHandler}
                        name="email"
                        autoComplete="off"
                        placeholder="Enter your email"
                        className={errors.email ? 'error' : ''}
                        disabled={updating}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="inputGroup">
                    <label htmlFor="address">Address *</label>
                    <input 
                        type="text"
                        id="address"
                        value={user.address}
                        onChange={inputHandler}
                        name="address"
                        autoComplete="off"
                        placeholder="Enter your address"
                        className={errors.address ? 'error' : ''}
                        disabled={updating}
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
                
                <div className="inputGroup">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={updating}
                    >
                        {updating ? 'Updating...' : 'Update User'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateUser;