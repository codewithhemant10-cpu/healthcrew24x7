// models/reviewModel.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointment',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {        
        type: String,
        required: false 
    },
    serviceName: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    doctorImage: {       
        type: String,
        required: false 
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true
    }
}, { timestamps: true });

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
