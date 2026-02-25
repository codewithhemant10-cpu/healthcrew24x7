import mongoose from "mongoose";

const doctorRegistrationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profession: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: String, required: true },
    currentWorkplace: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    message: { type: String },
    status: { 
        type: String, 
        enum: ['pending', 'reviewed', 'approved', 'rejected'], 
        default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now }
});

const doctorRegistration = mongoose.model('DoctorRegistration', doctorRegistrationSchema);

export default doctorRegistration;