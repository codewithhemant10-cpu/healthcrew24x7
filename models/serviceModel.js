import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    date: { type: Number, default: Date.now },
}, { minimize: false });

const serviceModel = mongoose.models.Service || mongoose.model("Service", serviceSchema);
export default serviceModel;
