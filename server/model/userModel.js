import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        match: [/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [5, 'Address must be at least 5 characters long'],
        maxlength: [200, 'Address cannot exceed 200 characters']
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false // Removes __v field
});

// Create unique index on email field
userSchema.index({ email: 1 }, { unique: true });

// Pre-save middleware for additional validation
userSchema.pre('save', function(next) {
    // Additional custom validation can be added here
    next();
});

// Instance method to get user info without sensitive data
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    return user;
};

export default mongoose.model('User', userSchema);