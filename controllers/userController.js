import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import serviceModel from "../models/serviceModel.js";
import reviewModel from "../models/reviewModel.js";
import sendDoctorMail from "../utils/sendDoctorMail.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary'
import razorpay from 'razorpay';
import { sendEmail, emailTemplates } from '../config/emailService.js';
import contactModel from "../models/contactModel.js";
import doctorRegistration from "../models/doctorRegistration.js";

// API to register user
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email" });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser && existingUser.isVerified) {
            return res.json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        const user = await userModel.findOneAndUpdate(
            { email },
            {
                name,
                password: hashedPassword,
                otp,
                otpExpire: Date.now() + 5 * 60 * 1000,
                isVerified: false
            },
            { upsert: true, new: true }
        );

        await sendEmail(email, {
            subject: "Verify Your Email - OTP",
            html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 5 minutes</p>`
        });

        res.json({ success: true, message: "OTP sent to email" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const verifyRegisterOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.otp !== otp || user.otpExpire < Date.now()) {
            return res.json({ success: false, message: "Invalid or Expired OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpire = null;

        await user.save();

        res.json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const sendLoginOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user || !user.isVerified) {
            return res.json({ success: false, message: "User not verified" });
        }

        const otp = generateOTP();

        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000;

        await user.save();

        await sendEmail(email, {
            subject: "Login OTP",
            html: `<h2>Your Login OTP: ${otp}</h2>`
        });

        res.json({ success: true, message: "Login OTP sent" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const loginWithOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.otp !== otp || user.otpExpire < Date.now()) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        user.otp = null;
        user.otpExpire = null;

        await user.save();

        res.json({ success: true, token });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availability 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")
        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // Save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // 🔥 Email sending with proper checks
        const emailConfigured = process.env.MAIL_USER && process.env.MAIL_PASS;

        if (emailConfigured) {
            try {
                const doctorEmail = docData.email
                await sendDoctorMail(doctorEmail, newAppointment)
                console.log('✅ Doctor notification email sent')
            } catch (mailError) {
                console.error("❌ Email failed (but appointment booked):", mailError.message)
            }
        } else {
            console.warn('⚠️ Email not configured - Skipping doctor notification')
        }

        res.json({
            success: true,
            message: 'Appointment Booked',
            emailSent: emailConfigured
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment (simple cancellation without email)
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment by patient with doctor email notification
const cancelAppointmentByPatient = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;

        // ✅ Pehle simple appointment find karo
        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // ✅ Verify appointment user (string comparison)
        if (appointment.userId.toString() !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        // ✅ Status update karo
        appointment.cancelled = true;
        await appointment.save();

        // ✅ Releasing doctor slot
        const { docId, slotDate, slotTime } = appointment;
        const doctorData = await doctorModel.findById(docId);

        if (doctorData) {
            let slots_booked = doctorData.slots_booked;
            if (slots_booked[slotDate]) {
                slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
                await doctorModel.findByIdAndUpdate(docId, { slots_booked });
            }
        }

        // ✅ Doctor ko email notification bhejo
        const emailConfigured = process.env.MAIL_USER && process.env.MAIL_PASS;

        if (emailConfigured && doctorData) {
            try {
                // User aur Doctor data fetch karo for email
                const userData = await userModel.findById(userId);

                const doctorEmailTemplate = emailTemplates.patientCancelledAppointment(
                    doctorData.name,
                    userData.name,
                    slotDate,
                    slotTime
                );

                await sendEmail(doctorData.email, doctorEmailTemplate);
                console.log('✅ Doctor notified about patient cancellation');
            } catch (emailError) {
                console.error('❌ Failed to send email to doctor:', emailError.message);
                // Email fail hone par bhi appointment cancel hogi
            }
        } else {
            console.warn('⚠️ Email not configured - Skipping doctor notification');
        }

        res.json({
            success: true,
            message: 'Appointment cancelled successfully. Doctor has been notified.',
            emailSent: emailConfigured
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get services for user
const getServicesForUser = async (req, res) => {
    try {
        const services = await serviceModel.find({ status: 'Active' });
        res.json({ success: true, services });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Submit Review
const submitReview = async (req, res) => {
    try {
        const { appointmentId, doctorId, rating, review, userId, userName } = req.body;

        // Fetch user data if needed
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Fetch doctor data
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Check if review already exists
        const existingReview = await reviewModel.findOne({ appointmentId });
        if (existingReview) {
            return res.json({ success: false, message: "Review already submitted for this appointment" });
        }

        const reviewData = {
            appointmentId,
            userId,
            doctorId,
            userName: userName || user.name,
            userImage: user.image,
            serviceName: doctor.speciality,
            doctorName: doctor.name,
            doctorImage: doctor.image,
            rating: Number(rating),
            review
        };

        const newReview = new reviewModel(reviewData);
        await newReview.save();

        res.json({ success: true, message: "Review submitted successfully", review: newReview });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// ----------------- GET ALL APPROVED REVIEWS (Public) -----------------
const getAllApprovedReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find({})
            .populate('userId', 'name image')
            .populate('doctorId', 'name speciality image')
            .sort({ createdAt: -1 })
            .limit(20); // Latest 20 reviews

        res.json({ success: true, reviews });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// ----------------- SUBMIT CONTACT (USER) -----------------
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.json({
                success: false,
                message: "Required fields missing"
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid email"
            });
        }

        const newContact = new contactModel({
            name,
            email,
            phone,
            subject,
            message
        });

        await newContact.save();

        res.json({
            success: true,
            message: "Message sent successfully. Admin will contact you soon."
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- SUBMIT DOCTOR REGISTRATION (PUBLIC) -----------------
const submitDoctorRegistration = async (req, res) => {
    try {
        const { 
            fullName, email, phone, profession, specialization, 
            experience, currentWorkplace, city, state, message 
        } = req.body;

        // Validation
        if (!fullName || !email || !phone || !profession || !specialization || !experience || !city || !state) {
            return res.json({
                success: false,
                message: "Required fields missing"
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid email"
            });
        }

        // Create new registration
        const newRegistration = new doctorRegistration({
            fullName,
            email,
            phone,
            profession,
            specialization,
            experience,
            currentWorkplace,
            city,
            state,
            message,
            status: 'pending'
        });

        await newRegistration.save();

        // Send email notification to admin
        const emailConfigured = process.env.MAIL_USER && process.env.MAIL_PASS;

        if (emailConfigured) {
            try {
                const adminEmailTemplate = {
                    subject: '🩺 New Doctor Registration - HealthCrew24x7',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
                                .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
                                .value { color: #333; margin-bottom: 15px; }
                                .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1 style="margin: 0;">🩺 New Doctor Registration</h1>
                                    <p style="margin: 10px 0 0 0;">A new healthcare professional wants to join your platform</p>
                                </div>
                                <div class="content">
                                    <div class="info-box">
                                        <div class="label">Full Name:</div>
                                        <div class="value">${fullName}</div>
                                        
                                        <div class="label">Email:</div>
                                        <div class="value">${email}</div>
                                        
                                        <div class="label">Phone:</div>
                                        <div class="value">${phone}</div>
                                        
                                        <div class="label">Profession:</div>
                                        <div class="value">${profession}</div>
                                        
                                        <div class="label">Specialization:</div>
                                        <div class="value">${specialization}</div>
                                        
                                        <div class="label">Experience:</div>
                                        <div class="value">${experience}</div>
                                        
                                        ${currentWorkplace ? `
                                        <div class="label">Current Workplace:</div>
                                        <div class="value">${currentWorkplace}</div>
                                        ` : ''}
                                        
                                        <div class="label">Location:</div>
                                        <div class="value">${city}, ${state}</div>
                                        
                                        ${message ? `
                                        <div class="label">Message:</div>
                                        <div class="value">${message}</div>
                                        ` : ''}
                                    </div>
                                    
                                    <p style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
                                        <strong>Action Required:</strong> Please review this registration in your admin panel.
                                    </p>
                                </div>
                                <div class="footer">
                                    <p>This is an automated notification from HealthCrew24x7</p>
                                    <p>Registration received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                };

                await sendEmail(process.env.MAIL_USER, adminEmailTemplate);
                console.log('✅ Admin notification email sent');
            } catch (emailError) {
                console.error('❌ Failed to send admin notification email:', emailError.message);
            }
        }

        res.json({
            success: true,
            message: "Registration submitted successfully! Our team will contact you soon."
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    cancelAppointmentByPatient,
    paymentRazorpay,
    getServicesForUser,
    verifyRazorpay,
    submitReview,
    getAllApprovedReviews,
    submitContact,
    submitDoctorRegistration,
    loginWithOTP,
    verifyRegisterOTP,
    sendLoginOTP


}