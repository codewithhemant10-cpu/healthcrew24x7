// import mongoose from "mongoose";

// const timeSlotSchema = new mongoose.Schema({
//     startTime: { type: String, required: true }, // "09:00"
//     endTime: { type: String, required: true },   // "12:00"
//     slotDuration: { type: Number, required: true, default: 30 }, // minutes
//     isActive: { type: Boolean, default: true }
// });

// const weeklyAvailabilitySchema = new mongoose.Schema({
//     day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
//     isAvailable: { type: Boolean, default: true },
//     timeSlots: [timeSlotSchema]
// });

// const holidaySchema = new mongoose.Schema({
//     date: { type: String, required: true }, // "2026-01-30"
//     reason: { type: String, default: "" },
//     isFullDay: { type: Boolean, default: true },
//     startTime: { type: String }, // if not full day
//     endTime: { type: String }    // if not full day
// });

// const doctorSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     image: { type: String, required: true },
//     speciality: { type: String, required: true },
//     degree: { type: String, required: true },
//     experience: { type: String, required: true },
//     about: { type: String, required: true },
//     available: { type: Boolean, default: true },
//     fees: { type: Number, required: true },
    
//     // ✅ NEW: Weekly availability
//     weeklyAvailability: [weeklyAvailabilitySchema],
    
//     // ✅ NEW: Holidays
//     holidays: [holidaySchema],
    
//     // Existing slots_booked structure
//     slots_booked: { type: Object, default: {} }, // { "2026-01-30": ["09:00", "09:30", ...] }
    
//     address: { type: Object, required: true },
//     date: { type: Number, required: true },
// }, { minimize: false });

// const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
// export default doctorModel;





// import mongoose from "mongoose";

// const timeSlotSchema = new mongoose.Schema({
//     startTime: { type: String, required: true }, // "09:00"
//     endTime: { type: String, required: true },   // "12:00"
//     slotDuration: { type: Number, required: true, default: 30 }, // minutes
//     isActive: { type: Boolean, default: true }
// });

// const weeklyAvailabilitySchema = new mongoose.Schema({
//     day: { 
//       type: String, 
//       required: true, 
//       enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
//     },
//     isAvailable: { type: Boolean, default: true },
//     timeSlots: [timeSlotSchema]
// });

// const holidaySchema = new mongoose.Schema({
//     date: { type: String, required: true }, // "2026-01-30"
//     reason: { type: String, default: "" },
//     isFullDay: { type: Boolean, default: true },
//     startTime: { type: String }, // if not full day
//     endTime: { type: String }    // if not full day
// });

// const documentsSchema = new mongoose.Schema({
//     identityProof: { type: String },
//     medicalLicense: { type: String },
//     degreeCertificate: { type: String }
// }, { _id: false });

// const doctorSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     image: { type: String, required: true },
//     speciality: { type: String, required: true },
//     degree: { type: String, required: true },
//     experience: { type: String, required: true },
//     about: { type: String, required: true },
//     available: { type: Boolean, default: true },
//     fees: { type: Number, required: true },
    
//     // ✅ Personal Information
//     gender: { type: String },
//     dob: { type: String },
//     phone: { type: String },
    
//     // ✅ Professional Information
//     medicalLicenseNumber: { type: String },
//     licenseAuthority: { type: String },
//     licenseExpiry: { type: String },
//     hospitalName: { type: String },
//     clinicAddress: { type: String },
    
//     // ✅ Documents
//     documents: { type: documentsSchema, default: {} },
    
//     // ✅ Weekly availability
//     weeklyAvailability: [weeklyAvailabilitySchema],
    
//     // ✅ Holidays
//     holidays: [holidaySchema],
    
//     // Existing slots_booked structure
//     slots_booked: { type: Object, default: {} }, // { "2026-01-30": ["09:00", "09:30", ...] }
    
//     address: { type: Object, required: true },
//     date: { type: Number, required: true },
// }, { minimize: false });

// const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
// export default doctorModel;




import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },   // "12:00"
    slotDuration: { type: Number, required: true, default: 30 }, // minutes
    isActive: { type: Boolean, default: true }
});

const weeklyAvailabilitySchema = new mongoose.Schema({
    day: { 
      type: String, 
      required: true, 
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
    },
    isAvailable: { type: Boolean, default: true },
    timeSlots: [timeSlotSchema]
});

const holidaySchema = new mongoose.Schema({
    date: { type: String, required: true }, // "2026-01-30"
    reason: { type: String, default: "" },
    isFullDay: { type: Boolean, default: true },
    startTime: { type: String }, // if not full day
    endTime: { type: String }    // if not full day
});

const documentsSchema = new mongoose.Schema({
    identityProof: { type: String },
    medicalLicense: { type: String },
    degreeCertificate: { type: String }
}, { _id: false });

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    
    // ✅ Personal Information
    gender: { type: String },
    dob: { type: String },
    phone: { type: String },
    
    // ✅ Professional Information
    medicalLicenseNumber: { type: String },
    licenseAuthority: { type: String },
    licenseExpiry: { type: String },
    hospitalName: { type: String },
    clinicAddress: { type: String },
    
    // ✅ Documents
    documents: { type: documentsSchema, default: {} },
    
    // ✅ NEW: Verification Status
    isVerified: { type: Boolean, default: false },
    verificationStatus: { 
        type: String, 
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    rejectionReason: { type: String },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    verifiedAt: { type: Date },
    
    // ✅ Weekly availability
    weeklyAvailability: [weeklyAvailabilitySchema],
    
    // ✅ Holidays
    holidays: [holidaySchema],
    
    // Existing slots_booked structure
    slots_booked: { type: Object, default: {} }, // { "2026-01-30": ["09:00", "09:30", ...] }
    
    address: { type: Object, required: true },
    date: { type: Number, required: true },
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;