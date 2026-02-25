import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getProfile, 
    updateProfile, 
    bookAppointment, 
    listAppointment, 
    cancelAppointment, 
    cancelAppointmentByPatient, 
    paymentRazorpay, 
    verifyRazorpay, 
    getServicesForUser, 
    submitReview,
    getAllApprovedReviews,
    submitContact,
    submitDoctorRegistration ,
    verifyRegisterOTP,
    sendLoginOTP,
    loginWithOTP
} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';
import transporter from '../config/mailer.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.post("/cancel-appointment-patient", authUser, cancelAppointmentByPatient) 
userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)
userRouter.get("/services", getServicesForUser);
userRouter.post('/submit-review', authUser, submitReview);
userRouter.get('/reviews', getAllApprovedReviews);
userRouter.post("/contact", submitContact);
userRouter.post("/verify-register-otp", verifyRegisterOTP);
userRouter.post("/send-login-otp", sendLoginOTP);
userRouter.post("/login-otp", loginWithOTP);
// Doctor Registration (Public - No auth required)
userRouter.post("/doctor-registration", submitDoctorRegistration);


// 🧪 Test email route
userRouter.get('/test-email', async (req, res) => {
    try {
        console.log('Testing email...');
        console.log('MAIL_USER:', process.env.MAIL_USER);
        console.log('MAIL_PASS:', process.env.MAIL_PASS ? '✅ Set' : '❌ Missing');

        const info = await transporter.sendMail({
            from: `"HealthCrew Test" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER,
            subject: '✅ Email Test',
            html: '<h2>Email is working!</h2><p>Configuration is correct.</p>'
        });

        console.log('✅ Email sent:', info.messageId);
        res.json({ success: true, message: 'Email sent', messageId: info.messageId });

    } catch (error) {
        console.error('❌ Email error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default userRouter;