// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import doctorModel from "../models/doctorModel.js";
// import appointmentModel from "../models/appointmentModel.js";
// import reviewModel from "../models/reviewModel.js";

// // Doctor login
// const loginDoctor = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await doctorModel.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     res.json({ success: true, token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get doctor's appointments
// const appointmentsDoctor = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const appointments = await appointmentModel.find({ docId });
//     res.json({ success: true, appointments });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Cancel appointment
// const appointmentCancel = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { appointmentId } = req.body;

//     const appointment = await appointmentModel.findById(appointmentId);
//     if (!appointment || appointment.docId.toString() !== docId) {
//       return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
//     }

//     await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
//     res.json({ success: true, message: "Appointment Cancelled" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Complete appointment
// const appointmentComplete = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { appointmentId } = req.body;

//     const appointment = await appointmentModel.findById(appointmentId);
//     if (!appointment || appointment.docId.toString() !== docId) {
//       return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
//     }

//     await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
//     res.json({ success: true, message: "Appointment Completed" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get all doctors (for frontend list)
// const doctorList = async (req, res) => {
//   try {
//     const doctors = await doctorModel.find({}).select("-password -email");
//     res.json({ success: true, doctors });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Toggle doctor's availability
// const changeAvailability = async (req, res) => {
//   try {
//     const { docId } = req.body;

//     if (!docId) {
//       return res.status(400).json({ success: false, message: "Doctor ID missing" });
//     }

//     const doctor = await doctorModel.findById(docId);

//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     doctor.available = !doctor.available;
//     await doctor.save();

//     res.json({ success: true, message: "Availability changed successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get doctor's profile
// const doctorProfile = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const profile = await doctorModel.findById(docId).select("-password");
//     res.json({ success: true, profileData: profile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Update doctor's profile
// const updateDoctorProfile = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { fees, address, available, about } = req.body;

//     await doctorModel.findByIdAndUpdate(docId, {
//       fees,
//       address,
//       available,
//       about,
//     });

//     res.json({ success: true, message: "Profile Updated" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get dashboard data
// const doctorDashboard = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const appointments = await appointmentModel.find({ docId });

//     let earnings = 0;
//     const patientSet = new Set();

//     appointments.forEach((a) => {
//       if (a.isCompleted || a.payment) earnings += a.amount;
//       patientSet.add(a.userId.toString());
//     });

//     const dashData = {
//       earnings,
//       appointments: appointments.length,
//       patients: patientSet.size,
//       latestAppointments: appointments.reverse().slice(0, 5),
//     };

//     res.json({ success: true, dashData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get Doctor Reviews
// const getDoctorReviews = async (req, res) => {
//   try {
//     const doctorId = req.user.id;

//     const reviews = await reviewModel
//       .find({ doctorId })
//       .populate('userId', 'name email image')
//       .sort({ createdAt: -1 });

//     res.json({ success: true, reviews });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Accept appointment
// const acceptAppointment = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { appointmentId } = req.body;

//     if (!appointmentId) {
//       return res.status(400).json({ success: false, message: "Appointment ID is required" });
//     }

//     const appointment = await appointmentModel.findById(appointmentId);

//     if (!appointment || appointment.docId.toString() !== docId) {
//       return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
//     }

//     if (appointment.cancelled) {
//       return res.status(400).json({ success: false, message: "Cannot accept a cancelled appointment" });
//     }

//     appointment.isAccepted = true;
//     await appointment.save();

//     res.status(200).json({ success: true, message: "Appointment accepted", appointment });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Save Weekly Availability
// const saveWeeklyAvailability = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { weeklyAvailability } = req.body;

//     if (!weeklyAvailability || !Array.isArray(weeklyAvailability)) {
//       return res.status(400).json({ success: false, message: "Invalid availability data" });
//     }

//     const doctor = await doctorModel.findById(docId);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     doctor.weeklyAvailability = weeklyAvailability;
//     await doctor.save();

//     res.json({ success: true, message: "Weekly availability saved successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Get Weekly Availability
// const getWeeklyAvailability = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const doctor = await doctorModel.findById(docId).select("weeklyAvailability");

//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     res.json({ success: true, weeklyAvailability: doctor.weeklyAvailability || [] });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Add Holiday
// const addHoliday = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { date, reason, isFullDay, startTime, endTime } = req.body;

//     if (!date) {
//       return res.status(400).json({ success: false, message: "Date is required" });
//     }

//     const doctor = await doctorModel.findById(docId);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     // Check if holiday already exists
//     const existingHoliday = doctor.holidays.find(h => h.date === date);
//     if (existingHoliday) {
//       return res.status(400).json({ success: false, message: "Holiday already exists for this date" });
//     }

//     doctor.holidays.push({
//       date,
//       reason: reason || "",
//       isFullDay: isFullDay !== false,
//       startTime: startTime || null,
//       endTime: endTime || null
//     });

//     await doctor.save();

//     res.json({ success: true, message: "Holiday added successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Get Holidays
// const getHolidays = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const doctor = await doctorModel.findById(docId).select("holidays");

//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     res.json({ success: true, holidays: doctor.holidays || [] });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Delete Holiday
// const deleteHoliday = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { holidayId } = req.body;

//     if (!holidayId) {
//       return res.status(400).json({ success: false, message: "Holiday ID is required" });
//     }

//     const doctor = await doctorModel.findById(docId);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     doctor.holidays = doctor.holidays.filter(h => h._id.toString() !== holidayId);
//     await doctor.save();

//     res.json({ success: true, message: "Holiday deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Get Available Slots for a Specific Date (For User Booking)
// const getAvailableSlots = async (req, res) => {
//   try {
//     const { docId, date } = req.query;

//     if (!docId || !date) {
//       return res.status(400).json({ success: false, message: "Doctor ID and date are required" });
//     }

//     const doctor = await doctorModel.findById(docId);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     if (!doctor.available) {
//       return res.json({ success: true, availableSlots: [], message: "Doctor is not available" });
//     }

//     // Check if date is a holiday
//     const holiday = doctor.holidays.find(h => h.date === date);
//     if (holiday && holiday.isFullDay) {
//       return res.json({ success: true, availableSlots: [], message: "Doctor is on holiday" });
//     }

//     // Get day of week
//     const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
//     const dayAvailability = doctor.weeklyAvailability.find(d => d.day === dayOfWeek);

//     if (!dayAvailability || !dayAvailability.isAvailable || dayAvailability.timeSlots.length === 0) {
//       return res.json({ success: true, availableSlots: [], message: "Doctor is not available on this day" });
//     }

//     // Generate all possible slots
//     const allSlots = [];
//     dayAvailability.timeSlots.forEach(slot => {
//       if (slot.isActive) {
//         const slots = generateTimeSlots(slot.startTime, slot.endTime, slot.slotDuration);
//         allSlots.push(...slots);
//       }
//     });

//     // Filter out booked slots
//     const bookedSlots = doctor.slots_booked[date] || [];
//     const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

//     res.json({ success: true, availableSlots });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Helper function to generate time slots
// function generateTimeSlots(startTime, endTime, duration) {
//   const slots = [];
//   const start = timeToMinutes(startTime);
//   const end = timeToMinutes(endTime);

//   for (let time = start; time < end; time += duration) {
//     slots.push(minutesToTime(time));
//   }

//   return slots;
// }

// function timeToMinutes(time) {
//   const [hours, minutes] = time.split(':').map(Number);
//   return hours * 60 + minutes;
// }

// function minutesToTime(minutes) {
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
// }

// export {
//   loginDoctor,
//   appointmentsDoctor,
//   appointmentCancel,
//   appointmentComplete,
//   doctorList,
//   changeAvailability,
//   doctorProfile,
//   updateDoctorProfile,
//   doctorDashboard,
//   getDoctorReviews,
//   acceptAppointment,
//   // ✅ NEW exports
//   saveWeeklyAvailability,
//   getWeeklyAvailability,
//   addHoliday,
//   getHolidays,
//   deleteHoliday,
//   getAvailableSlots
// };






// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import doctorModel from "../models/doctorModel.js";
// import appointmentModel from "../models/appointmentModel.js";
// import reviewModel from "../models/reviewModel.js";
// import { v2 as cloudinary } from 'cloudinary';

// // Doctor login
// const loginDoctor = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await doctorModel.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     res.json({ success: true, token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get doctor's appointments
// const appointmentsDoctor = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const appointments = await appointmentModel.find({ docId });
//     res.json({ success: true, appointments });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Cancel appointment
// const appointmentCancel = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { appointmentId } = req.body;

//     const appointment = await appointmentModel.findById(appointmentId);
//     if (!appointment || appointment.docId.toString() !== docId) {
//       return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
//     }

//     await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
//     res.json({ success: true, message: "Appointment Cancelled" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Complete appointment
// const appointmentComplete = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { appointmentId } = req.body;

//     const appointment = await appointmentModel.findById(appointmentId);
//     if (!appointment || appointment.docId.toString() !== docId) {
//       return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
//     }

//     await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
//     res.json({ success: true, message: "Appointment Completed" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get all doctors (for frontend list)
// const doctorList = async (req, res) => {
//   try {
//     const doctors = await doctorModel.find({}).select("-password -email");
//     res.json({ success: true, doctors });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Toggle doctor's availability
// const changeAvailability = async (req, res) => {
//   try {
//     const { docId } = req.body;

//     if (!docId) {
//       return res.status(400).json({ success: false, message: "Doctor ID missing" });
//     }

//     const doctor = await doctorModel.findById(docId);

//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     doctor.available = !doctor.available;
//     await doctor.save();

//     res.json({ success: true, message: "Availability changed successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get doctor's profile
// const doctorProfile = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const profile = await doctorModel.findById(docId).select("-password");
//     res.json({ success: true, profileData: profile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ UPDATED: Update doctor's profile with file uploads
// const updateDoctorProfile = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { 
//       fees, 
//       address, 
//       available, 
//       about,
//       gender,
//       dob,
//       phone,
//       medicalLicenseNumber,
//       licenseAuthority,
//       licenseExpiry,
//       hospitalName,
//       clinicAddress
//     } = req.body;

//     const updateData = {
//       fees,
//       address: JSON.parse(address),
//       available: available === 'true',
//       about,
//       gender,
//       dob,
//       phone,
//       medicalLicenseNumber,
//       licenseAuthority,
//       licenseExpiry,
//       hospitalName,
//       clinicAddress
//     };

//     // Handle profile image upload
//     if (req.files?.profileImage) {
//       const imageFile = req.files.profileImage[0];
//       const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
//         resource_type: "image"
//       });
//       updateData.image = imageUpload.secure_url;
//     }

//     // Handle document uploads
//     if (!updateData.documents) {
//       const doctor = await doctorModel.findById(docId);
//       updateData.documents = doctor.documents || {};
//     }

//     if (req.files?.identityProof) {
//       const file = req.files.identityProof[0];
//       const upload = await cloudinary.uploader.upload(file.path, {
//         resource_type: "auto"
//       });
//       updateData.documents.identityProof = upload.secure_url;
//     }

//     if (req.files?.medicalLicense) {
//       const file = req.files.medicalLicense[0];
//       const upload = await cloudinary.uploader.upload(file.path, {
//         resource_type: "auto"
//       });
//       updateData.documents.medicalLicense = upload.secure_url;
//     }

//     if (req.files?.degreeCertificate) {
//       const file = req.files.degreeCertificate[0];
//       const upload = await cloudinary.uploader.upload(file.path, {
//         resource_type: "auto"
//       });
//       updateData.documents.degreeCertificate = upload.secure_url;
//     }

//     await doctorModel.findByIdAndUpdate(docId, updateData);

//     res.json({ success: true, message: "Profile Updated" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get dashboard data
// const doctorDashboard = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const appointments = await appointmentModel.find({ docId });

//     let earnings = 0;
//     const patientSet = new Set();

//     appointments.forEach((a) => {
//       if (a.isCompleted || a.payment) earnings += a.amount;
//       patientSet.add(a.userId.toString());
//     });

//     const dashData = {
//       earnings,
//       appointments: appointments.length,
//       patients: patientSet.size,
//       latestAppointments: appointments.reverse().slice(0, 5),
//     };

//     res.json({ success: true, dashData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get Doctor Reviews
// const getDoctorReviews = async (req, res) => {
//   try {
//     const doctorId = req.user.id;

//     const reviews = await reviewModel
//       .find({ doctorId })
//       .populate('userId', 'name email image')
//       .sort({ createdAt: -1 });

//     res.json({ success: true, reviews });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Accept appointment
// const acceptAppointment = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { appointmentId } = req.body;

//     if (!appointmentId) {
//       return res.status(400).json({ success: false, message: "Appointment ID is required" });
//     }

//     const appointment = await appointmentModel.findById(appointmentId);

//     if (!appointment || appointment.docId.toString() !== docId) {
//       return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
//     }

//     if (appointment.cancelled) {
//       return res.status(400).json({ success: false, message: "Cannot accept a cancelled appointment" });
//     }

//     appointment.isAccepted = true;
//     await appointment.save();

//     res.status(200).json({ success: true, message: "Appointment accepted", appointment });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Save Weekly Availability
// const saveWeeklyAvailability = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { weeklyAvailability } = req.body;

//     if (!weeklyAvailability || !Array.isArray(weeklyAvailability)) {
//       return res.status(400).json({ success: false, message: "Invalid availability data" });
//     }

//     const doctor = await doctorModel.findById(docId);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     doctor.weeklyAvailability = weeklyAvailability;
//     await doctor.save();

//     res.json({ success: true, message: "Weekly availability saved successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Get Weekly Availability
// const getWeeklyAvailability = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const doctor = await doctorModel.findById(docId).select("weeklyAvailability");

//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     res.json({ success: true, weeklyAvailability: doctor.weeklyAvailability || [] });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Add Holiday
// const addHoliday = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { date, reason, isFullDay, startTime, endTime } = req.body;

//     if (!date) {
//       return res.status(400).json({ success: false, message: "Date is required" });
//     }

//     const doctor = await doctorModel.findById(docId);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     // Check if holiday already exists
//     const existingHoliday = doctor.holidays.find(h => h.date === date);
//     if (existingHoliday) {
//       return res.status(400).json({ success: false, message: "Holiday already exists for this date" });
//     }

//     doctor.holidays.push({
//       date,
//       reason: reason || "",
//       isFullDay: isFullDay !== false,
//       startTime: startTime || null,
//       endTime: endTime || null
//     });

//     await doctor.save();

//     res.json({ success: true, message: "Holiday added successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Get Holidays
// const getHolidays = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const doctor = await doctorModel.findById(docId).select("holidays");

//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     res.json({ success: true, holidays: doctor.holidays || [] });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Delete Holiday
// const deleteHoliday = async (req, res) => {
//   try {
//     const docId = req.user.id;
//     const { holidayId } = req.body;

//     if (!holidayId) {
//       return res.status(400).json({ success: false, message: "Holiday ID is required" });
//     }

//     const doctor = await doctorModel.findById(docId);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     doctor.holidays = doctor.holidays.filter(h => h._id.toString() !== holidayId);
//     await doctor.save();

//     res.json({ success: true, message: "Holiday deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ NEW: Get Available Slots for a Specific Date (For User Booking)
// const getAvailableSlots = async (req, res) => {
//   try {
//     const { docId, date } = req.query;

//     if (!docId || !date) {
//       return res.status(400).json({ success: false, message: "Doctor ID and date are required" });
//     }

//     const doctor = await doctorModel.findById(docId);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     if (!doctor.available) {
//       return res.json({ success: true, availableSlots: [], message: "Doctor is not available" });
//     }

//     // Check if date is a holiday
//     const holiday = doctor.holidays.find(h => h.date === date);
//     if (holiday && holiday.isFullDay) {
//       return res.json({ success: true, availableSlots: [], message: "Doctor is on holiday" });
//     }

//     // Get day of week
//     const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
//     const dayAvailability = doctor.weeklyAvailability.find(d => d.day === dayOfWeek);

//     if (!dayAvailability || !dayAvailability.isAvailable || dayAvailability.timeSlots.length === 0) {
//       return res.json({ success: true, availableSlots: [], message: "Doctor is not available on this day" });
//     }

//     // Generate all possible slots
//     const allSlots = [];
//     dayAvailability.timeSlots.forEach(slot => {
//       if (slot.isActive) {
//         const slots = generateTimeSlots(slot.startTime, slot.endTime, slot.slotDuration);
//         allSlots.push(...slots);
//       }
//     });

//     // Filter out booked slots
//     const bookedSlots = doctor.slots_booked[date] || [];
//     const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

//     res.json({ success: true, availableSlots });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Helper function to generate time slots
// function generateTimeSlots(startTime, endTime, duration) {
//   const slots = [];
//   const start = timeToMinutes(startTime);
//   const end = timeToMinutes(endTime);

//   for (let time = start; time < end; time += duration) {
//     slots.push(minutesToTime(time));
//   }

//   return slots;
// }

// function timeToMinutes(time) {
//   const [hours, minutes] = time.split(':').map(Number);
//   return hours * 60 + minutes;
// }

// function minutesToTime(minutes) {
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
// }

// export {
//   loginDoctor,
//   appointmentsDoctor,
//   appointmentCancel,
//   appointmentComplete,
//   doctorList,
//   changeAvailability,
//   doctorProfile,
//   updateDoctorProfile,
//   doctorDashboard,
//   getDoctorReviews,
//   acceptAppointment,
//   // ✅ NEW exports
//   saveWeeklyAvailability,
//   getWeeklyAvailability,
//   addHoliday,
//   getHolidays,
//   deleteHoliday,
//   getAvailableSlots
// };







import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import reviewModel from "../models/reviewModel.js";
import { v2 as cloudinary } from 'cloudinary';
import { sendEmail, emailTemplates } from '../config/emailService.js';
import userModel from '../models/userModel.js';

// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await doctorModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.user.id;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Cancel Appointment WITH EMAIL
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.user.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
    }

    // Update appointment
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // 📧 Send Emails
    try {
      const doctor = await doctorModel.findById(docId);
      const formattedDate = appointment.slotDate.replace(/_/g, '/');

      // 1️⃣ Send email to PATIENT
      const patientEmail = emailTemplates.appointmentCancelled(
        appointment.userData.name,
        doctor.name,
        formattedDate,
        appointment.slotTime
      );
      await sendEmail(appointment.userData.email, patientEmail);
      console.log(`✅ Patient cancellation email sent to: ${appointment.userData.email}`);

      // 2️⃣ Send email to REFERRER (if exists)
      if (appointment.referrerId) {
        const referrer = await doctorModel.findById(appointment.referrerId);
        if (referrer && referrer.email) {
          const referrerEmail = emailTemplates.referrerNotification(
            referrer.name,
            appointment.userData.name,
            'Cancelled',
            doctor.name,
            formattedDate,
            appointment.slotTime
          );
          await sendEmail(referrer.email, referrerEmail);
          console.log(`✅ Referrer cancellation email sent to: ${referrer.email}`);
        }
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError.message);
    }

    res.json({ success: true, message: "Appointment Cancelled and notifications sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Complete Appointment WITH EMAIL
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.user.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
    }

    // Update appointment
    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

    // 📧 Send Emails
    try {
      const doctor = await doctorModel.findById(docId);
      const formattedDate = appointment.slotDate.replace(/_/g, '/');

      // 1️⃣ Send email to PATIENT
      const patientEmail = emailTemplates.appointmentCompleted(
        appointment.userData.name,
        doctor.name,
        formattedDate,
        appointment.slotTime
      );
      await sendEmail(appointment.userData.email, patientEmail);
      console.log(`✅ Patient completion email sent to: ${appointment.userData.email}`);

      // 2️⃣ Send email to REFERRER (if exists)
      if (appointment.referrerId) {
        const referrer = await doctorModel.findById(appointment.referrerId);
        if (referrer && referrer.email) {
          const referrerEmail = emailTemplates.referrerNotification(
            referrer.name,
            appointment.userData.name,
            'Completed',
            doctor.name,
            formattedDate,
            appointment.slotTime
          );
          await sendEmail(referrer.email, referrerEmail);
          console.log(`✅ Referrer completion email sent to: ${referrer.email}`);
        }
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError.message);
    }

    res.json({ success: true, message: "Appointment Completed and notifications sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all doctors (for frontend list)
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle doctor's availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID missing" });
    }

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({ success: true, message: "Availability changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's profile
const doctorProfile = async (req, res) => {
  try {
    const docId = req.user.id;
    const profile = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, profileData: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATED: Update doctor's profile with file uploads
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.user.id;
    const { 
      fees, 
      address, 
      available, 
      about,
      gender,
      dob,
      phone,
      medicalLicenseNumber,
      licenseAuthority,
      licenseExpiry,
      hospitalName,
      clinicAddress
    } = req.body;

    const updateData = {
      fees,
      address: JSON.parse(address),
      available: available === 'true',
      about,
      gender,
      dob,
      phone,
      medicalLicenseNumber,
      licenseAuthority,
      licenseExpiry,
      hospitalName,
      clinicAddress
    };

    // Handle profile image upload
    if (req.files?.profileImage) {
      const imageFile = req.files.profileImage[0];
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      });
      updateData.image = imageUpload.secure_url;
    }

    // Handle document uploads
    if (!updateData.documents) {
      const doctor = await doctorModel.findById(docId);
      updateData.documents = doctor.documents || {};
    }

    if (req.files?.identityProof) {
      const file = req.files.identityProof[0];
      const upload = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto"
      });
      updateData.documents.identityProof = upload.secure_url;
    }

    if (req.files?.medicalLicense) {
      const file = req.files.medicalLicense[0];
      const upload = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto"
      });
      updateData.documents.medicalLicense = upload.secure_url;
    }

    if (req.files?.degreeCertificate) {
      const file = req.files.degreeCertificate[0];
      const upload = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto"
      });
      updateData.documents.degreeCertificate = upload.secure_url;
    }

    await doctorModel.findByIdAndUpdate(docId, updateData);

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard data
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.user.id;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    const patientSet = new Set();

    appointments.forEach((a) => {
      if (a.isCompleted || a.payment) earnings += a.amount;
      patientSet.add(a.userId.toString());
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Doctor Reviews
const getDoctorReviews = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const reviews = await reviewModel
      .find({ doctorId })
      .populate('userId', 'name email image')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Accept Appointment WITH EMAIL
const acceptAppointment = async (req, res) => {
  try {
    const docId = req.user.id;
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID is required" });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
    }

    if (appointment.cancelled) {
      return res.status(400).json({ success: false, message: "Cannot accept a cancelled appointment" });
    }

    // Update appointment
    appointment.isAccepted = true;
    await appointment.save();

    // 📧 Send Emails
    try {
      // Get doctor details
      const doctor = await doctorModel.findById(docId);
      const formattedDate = appointment.slotDate.replace(/_/g, '/');

      // 1️⃣ Send email to PATIENT
      const patientEmail = emailTemplates.appointmentAccepted(
        appointment.userData.name,
        doctor.name,
        formattedDate,
        appointment.slotTime
      );
      await sendEmail(appointment.userData.email, patientEmail);
      console.log(`✅ Patient email sent to: ${appointment.userData.email}`);

      // 2️⃣ Send email to REFERRER (if exists)
      if (appointment.referrerId) {
        const referrer = await doctorModel.findById(appointment.referrerId);
        if (referrer && referrer.email) {
          const referrerEmail = emailTemplates.referrerNotification(
            referrer.name,
            appointment.userData.name,
            'Accepted',
            doctor.name,
            formattedDate,
            appointment.slotTime
          );
          await sendEmail(referrer.email, referrerEmail);
          console.log(`✅ Referrer email sent to: ${referrer.email}`);
        }
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError.message);
      // Don't fail the request if email fails
    }

    res.status(200).json({ 
      success: true, 
      message: "Appointment accepted and notifications sent", 
      appointment 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Save Weekly Availability
const saveWeeklyAvailability = async (req, res) => {
  try {
    const docId = req.user.id;
    const { weeklyAvailability } = req.body;

    if (!weeklyAvailability || !Array.isArray(weeklyAvailability)) {
      return res.status(400).json({ success: false, message: "Invalid availability data" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.weeklyAvailability = weeklyAvailability;
    await doctor.save();

    res.json({ success: true, message: "Weekly availability saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Get Weekly Availability
const getWeeklyAvailability = async (req, res) => {
  try {
    const docId = req.user.id;
    const doctor = await doctorModel.findById(docId).select("weeklyAvailability");

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, weeklyAvailability: doctor.weeklyAvailability || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Add Holiday
const addHoliday = async (req, res) => {
  try {
    const docId = req.user.id;
    const { date, reason, isFullDay, startTime, endTime } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Check if holiday already exists
    const existingHoliday = doctor.holidays.find(h => h.date === date);
    if (existingHoliday) {
      return res.status(400).json({ success: false, message: "Holiday already exists for this date" });
    }

    doctor.holidays.push({
      date,
      reason: reason || "",
      isFullDay: isFullDay !== false,
      startTime: startTime || null,
      endTime: endTime || null
    });

    await doctor.save();

    res.json({ success: true, message: "Holiday added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Get Holidays
const getHolidays = async (req, res) => {
  try {
    const docId = req.user.id;
    const doctor = await doctorModel.findById(docId).select("holidays");

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, holidays: doctor.holidays || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Delete Holiday
const deleteHoliday = async (req, res) => {
  try {
    const docId = req.user.id;
    const { holidayId } = req.body;

    if (!holidayId) {
      return res.status(400).json({ success: false, message: "Holiday ID is required" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.holidays = doctor.holidays.filter(h => h._id.toString() !== holidayId);
    await doctor.save();

    res.json({ success: true, message: "Holiday deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Get Available Slots for a Specific Date (For User Booking)
const getAvailableSlots = async (req, res) => {
  try {
    const { docId, date } = req.query;

    if (!docId || !date) {
      return res.status(400).json({ success: false, message: "Doctor ID and date are required" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if (!doctor.available) {
      return res.json({ success: true, availableSlots: [], message: "Doctor is not available" });
    }

    // Check if date is a holiday
    const holiday = doctor.holidays.find(h => h.date === date);
    if (holiday && holiday.isFullDay) {
      return res.json({ success: true, availableSlots: [], message: "Doctor is on holiday" });
    }

    // Get day of week
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = doctor.weeklyAvailability.find(d => d.day === dayOfWeek);

    if (!dayAvailability || !dayAvailability.isAvailable || dayAvailability.timeSlots.length === 0) {
      return res.json({ success: true, availableSlots: [], message: "Doctor is not available on this day" });
    }

    // Generate all possible slots
    const allSlots = [];
    dayAvailability.timeSlots.forEach(slot => {
      if (slot.isActive) {
        const slots = generateTimeSlots(slot.startTime, slot.endTime, slot.slotDuration);
        allSlots.push(...slots);
      }
    });

    // Filter out booked slots
    const bookedSlots = doctor.slots_booked[date] || [];
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({ success: true, availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, duration) {
  const slots = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  for (let time = start; time < end; time += duration) {
    slots.push(minutesToTime(time));
  }

  return slots;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorList,
  changeAvailability,
  doctorProfile,
  updateDoctorProfile,
  doctorDashboard,
  getDoctorReviews,
  acceptAppointment,
  // ✅ NEW exports
  saveWeeklyAvailability,
  getWeeklyAvailability,
  addHoliday,
  getHolidays,
  deleteHoliday,
  getAvailableSlots
};