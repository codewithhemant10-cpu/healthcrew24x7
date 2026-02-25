// import express from 'express';
// import { 
//   loginDoctor, 
//   appointmentsDoctor, 
//   appointmentCancel, 
//   doctorList, 
//   appointmentComplete, 
//   doctorDashboard, 
//   doctorProfile, 
//   updateDoctorProfile, 
//   acceptAppointment, 
//   changeAvailability, 
//   getDoctorReviews,
//   // ✅ NEW imports
//   saveWeeklyAvailability,
//   getWeeklyAvailability,
//   addHoliday,
//   getHolidays,
//   deleteHoliday,
//   getAvailableSlots
// } from '../controllers/doctorController.js';
// import authDoctor from '../middlewares/authDoctor.js';

// const doctorRouter = express.Router();

// // Existing routes
// doctorRouter.post("/login", loginDoctor);
// doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
// doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
// doctorRouter.get("/list", doctorList);
// doctorRouter.post("/change-availability", authDoctor, changeAvailability);
// doctorRouter.post("/accept-appointment", authDoctor, acceptAppointment);
// doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
// doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
// doctorRouter.get("/profile", authDoctor, doctorProfile);
// doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
// doctorRouter.get('/reviews', authDoctor, getDoctorReviews);

// // ✅ NEW routes for availability management
// doctorRouter.post("/save-weekly-availability", authDoctor, saveWeeklyAvailability);
// doctorRouter.get("/weekly-availability", authDoctor, getWeeklyAvailability);
// doctorRouter.post("/add-holiday", authDoctor, addHoliday);
// doctorRouter.get("/holidays", authDoctor, getHolidays);
// doctorRouter.post("/delete-holiday", authDoctor, deleteHoliday);

// // ✅ For user frontend (no auth needed)
// doctorRouter.get("/available-slots", getAvailableSlots);

// export default doctorRouter;




import express from 'express';
import multer from 'multer';
import { 
  loginDoctor, 
  appointmentsDoctor, 
  appointmentCancel, 
  doctorList, 
  appointmentComplete, 
  doctorDashboard, 
  doctorProfile, 
  updateDoctorProfile, 
  acceptAppointment, 
  changeAvailability, 
  getDoctorReviews,
  // ✅ NEW imports
  saveWeeklyAvailability,
  getWeeklyAvailability,
  addHoliday,
  getHolidays,
  deleteHoliday,
  getAvailableSlots
} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

// ✅ Multer configuration for file uploads
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Existing routes
doctorRouter.post("/login", loginDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.get("/list", doctorList);
doctorRouter.post("/change-availability", authDoctor, changeAvailability);
doctorRouter.post("/accept-appointment", authDoctor, acceptAppointment);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);

// ✅ UPDATED: Profile update with file upload support
doctorRouter.post("/update-profile", authDoctor, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'identityProof', maxCount: 1 },
  { name: 'medicalLicense', maxCount: 1 },
  { name: 'degreeCertificate', maxCount: 1 }
]), updateDoctorProfile);

doctorRouter.get('/reviews', authDoctor, getDoctorReviews);

// ✅ NEW routes for availability management
doctorRouter.post("/save-weekly-availability", authDoctor, saveWeeklyAvailability);
doctorRouter.get("/weekly-availability", authDoctor, getWeeklyAvailability);
doctorRouter.post("/add-holiday", authDoctor, addHoliday);
doctorRouter.get("/holidays", authDoctor, getHolidays);
doctorRouter.post("/delete-holiday", authDoctor, deleteHoliday);

// ✅ For user frontend (no auth needed)
doctorRouter.get("/available-slots", getAvailableSlots);

export default doctorRouter;