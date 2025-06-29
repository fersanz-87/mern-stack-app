import React, { useEffect, useState } from 'react'
import "./user.css"
import api from '../config/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    useEffect(() => {
        fetchUsers();
    }, [pagination.page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/users?page=${pagination.page}&limit=${pagination.limit}`);
            
            if (response.data.success) {
                setUsers(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.message || 'Failed to fetch users', { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            setDeleting({ ...deleting, [userId]: true });
            const response = await api.delete(`/delete/user/${userId}`);
            
            if (response.data.success) {
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
                toast.success(response.data.message, { position: "top-right" });
                
                // Refresh if current page becomes empty
                if (users.length === 1 && pagination.page > 1) {
                    setPagination({ ...pagination, page: pagination.page - 1 });
                }
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(error.message || 'Failed to delete user', { position: "top-right" });
        } finally {
            setDeleting({ ...deleting, [userId]: false });
        }
    };

    const handlePageChange = (newPage) => {
        setPagination({ ...pagination, page: newPage });
    };

    if (loading) {
        return (
            <div className="userTable">
                <div className="loading">
                    <h3>Loading users...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="userTable">
            <div className="header">
                <h2>User Management</h2>
                <Link to="/add" className="btn btn-primary">
                    Add User <i className="fa-solid fa-user-plus"></i>
                </Link>
            </div>

            {users.length === 0 ? (
                <div className="noUser">
                    <h3>No users found</h3>
                    <p>Please add a new user to get started</p>
                </div>
            ) : (
                <>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">S.No.</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Address</th>
                                <th scope="col">Created</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.address}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="actionButtons">
                                        <Link 
                                            to={`/update/${user._id}`}
                                            className="btn btn-info"
                                            title="Edit user"
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>

                                        <button 
                                            onClick={() => deleteUser(user._id)}
                                            className="btn btn-danger"
                                            disabled={deleting[user._id]}
                                            title="Delete user"
                                        >
                                            {deleting[user._id] ? (
                                                <i className="fa-solid fa-spinner fa-spin"></i>
                                            ) : (
                                                <i className="fa-solid fa-trash"></i>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="pagination">
                            <button 
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="btn btn-secondary"
                            >
                                Previous
                            </button>
                            
                            <span className="page-info">
                                Page {pagination.page} of {pagination.pages} 
                                ({pagination.total} total users)
                            </span>
                            
                            <button 
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className="btn btn-secondary"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default User;