import express from 'express'
import {
    addDoctor, updateDoctor, deleteDoctor, adminDashboard, allDoctors,
    appointmentCancel, appointmentsAdmin, loginAdmin, allUsers, deleteUser,
    deleteAppointment, addService, allServices, updateService, deleteService,
    getAllReviews, deleteReview, addReview, updateReview, verifyDoctor, rejectDoctor, unverifyDoctor, getAllContacts,
    deleteContact, getAllDoctorRegistrations, deleteDoctorRegistration, updateRegistrationStatus
} from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

// Authentication
adminRouter.post("/login", loginAdmin)

// Doctor Management
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.put("/update-doctor/:doctorId", authAdmin, updateDoctor)
adminRouter.delete("/delete-doctor/:doctorId", authAdmin, deleteDoctor)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availability", authAdmin, changeAvailability)

// Doctor Verification Routes
adminRouter.post("/verify-doctor/:doctorId", authAdmin, verifyDoctor)
adminRouter.post("/reject-doctor/:doctorId", authAdmin, rejectDoctor)
adminRouter.post("/unverify-doctor/:doctorId", authAdmin, unverifyDoctor)

// User Management
adminRouter.get("/all-users", authAdmin, allUsers)
adminRouter.delete("/delete-user/:userId", authAdmin, deleteUser)

// Appointment Management
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.delete("/delete-appointment/:appointmentId", authAdmin, deleteAppointment)

// Dashboard
adminRouter.get("/dashboard", authAdmin, adminDashboard)

// Service Management
adminRouter.post("/add-service", authAdmin, upload.single('image'), addService)
adminRouter.get("/all-services", authAdmin, allServices)
adminRouter.put("/update-service/:serviceId", authAdmin, upload.single('image'), updateService)
adminRouter.delete("/delete-service/:serviceId", authAdmin, deleteService)

// Review Management
adminRouter.get('/all-reviews', authAdmin, getAllReviews)
adminRouter.post('/add-review', authAdmin, addReview)
adminRouter.put('/update-review/:reviewId', authAdmin, updateReview)
adminRouter.delete('/delete-review/:reviewId', authAdmin, deleteReview)

// CONTACT MANAGEMENT (ADMIN)
adminRouter.get("/contacts", authAdmin, getAllContacts);
adminRouter.delete("/contacts/:contactId", authAdmin, deleteContact);


// DOCTOR REGISTRATION MANAGEMENT (ADMIN)
adminRouter.get("/doctor-registrations", authAdmin, getAllDoctorRegistrations);
adminRouter.delete("/doctor-registrations/:registrationId", authAdmin, deleteDoctorRegistration);
adminRouter.put("/doctor-registrations/:registrationId/status", authAdmin, updateRegistrationStatus);




export default adminRouter;
