import express from 'express';
import { create, getAllUsers, getUserById, update, deleteUser } from '../controller/userController.js';
import { validateUser, validateUserUpdate, validateObjectId } from '../middleware/validation.js';

const route = express.Router();

// Create user - with validation
route.post("/user", validateUser, create);

// Get all users - with pagination support
route.get("/users", getAllUsers);

// Get user by ID - with ID validation
route.get("/user/:id", validateObjectId, getUserById);

// Update user - with ID validation and update validation
route.put("/update/user/:id", validateObjectId, validateUserUpdate, update);

// Delete user - with ID validation
route.delete("/delete/user/:id", validateObjectId, deleteUser);

export default route;