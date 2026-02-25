import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import reviewModel from "../models/reviewModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
import serviceModel from "../models/serviceModel.js";
import contactModel from "../models/contactModel.js";
import doctorRegistration from "../models/doctorRegistration.js";
import { sendEmail } from '../config/emailService.js';



// ----------------- ADMIN LOGIN -----------------
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin in DB
        const admin = await adminModel.findOne({ email });
        if (!admin) return res.json({ success: false, message: "Admin not found" });

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- ADD DOCTOR -----------------
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.status(200).json({ success: true, message: "Doctor Added" });

    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        await doctorModel.findByIdAndDelete(doctorId);

        res.json({ success: true, message: "Doctor deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- UPDATE DOCTOR -----------------
const updateDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            available
        } = req.body;

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // ✅ EMAIL UPDATE (optional)
        if (email && email !== doctor.email) {
            if (!validator.isEmail(email)) {
                return res.json({ success: false, message: "Invalid email" });
            }

            const emailExists = await doctorModel.findOne({ email });
            if (emailExists) {
                return res.json({ success: false, message: "Email already exists" });
            }

            doctor.email = email;
        }

        // ✅ PASSWORD UPDATE (optional)
        if (password && password.trim() !== "") {
            if (password.length < 8) {
                return res.json({
                    success: false,
                    message: "Password must be at least 8 characters"
                });
            }

            const salt = await bcrypt.genSalt(10);
            doctor.password = await bcrypt.hash(password, salt);
        }

        // ✅ OTHER FIELDS
        doctor.name = name ?? doctor.name;
        doctor.speciality = speciality ?? doctor.speciality;
        doctor.degree = degree ?? doctor.degree;
        doctor.experience = experience ?? doctor.experience;
        doctor.about = about ?? doctor.about;
        doctor.fees = fees ?? doctor.fees;
        doctor.available = available ?? doctor.available;

        // ✅ ADDRESS SAFE PARSE
        doctor.address = address
            ? typeof address === "string"
                ? JSON.parse(address)
                : address
            : doctor.address;

        await doctor.save();

        res.json({ success: true, message: "Doctor updated successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- CANCEL APPOINTMENT -----------------
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) return res.json({ success: false, message: "Appointment not found" });

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (doctorData && doctorData.slots_booked[slotDate]) {
            doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
        }

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- GET ALL DOCTORS -----------------
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- GET ALL APPOINTMENTS -----------------
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- GET ALL USERS -----------------
const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- DELETE USER -----------------
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        await userModel.findByIdAndDelete(userId);

        res.json({ success: true, message: "User deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- ADMIN DASHBOARD -----------------
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- DELETE APPOINTMENT -----------------
const deleteAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // Free up the doctor's slot
        const { docId, slotDate, slotTime } = appointment;
        const doctorData = await doctorModel.findById(docId);

        if (doctorData && doctorData.slots_booked[slotDate]) {
            doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
        }

        await appointmentModel.findByIdAndDelete(appointmentId);

        res.json({ success: true, message: "Appointment deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// ----------------- ADD SERVICE -----------------
const addService = async (req, res) => {
    try {
        const { title, status } = req.body;
        const imageFile = req.file;

        if (!title || !imageFile) {
            return res.status(400).json({ success: false, message: "Title and image are required" });
        }

        // Upload to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const newService = new serviceModel({
            title,
            image: imageUrl,
            status: status || 'Active',
            date: Date.now()
        });

        await newService.save();
        res.status(200).json({ success: true, message: "Service added successfully", service: newService });

    } catch (error) {
        console.error("Error adding service:", error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// ----------------- GET ALL SERVICES -----------------
const allServices = async (req, res) => {
    try {
        const services = await serviceModel.find({}).sort({ date: -1 });
        res.json({ success: true, services });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- UPDATE SERVICE -----------------
const updateService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { title, status } = req.body;

        const service = await serviceModel.findById(serviceId);
        if (!service) return res.json({ success: false, message: "Service not found" });

        // Update title/status
        service.title = title ?? service.title;
        service.status = status ?? service.status;

        // Update image if provided
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
            service.image = imageUpload.secure_url;
        }

        await service.save();
        res.json({ success: true, message: "Service updated successfully", service });

    } catch (error) {
        console.error("Error updating service:", error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- DELETE SERVICE -----------------
const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const service = await serviceModel.findById(serviceId);
        if (!service) return res.json({ success: false, message: "Service not found" });

        await serviceModel.findByIdAndDelete(serviceId);
        res.json({ success: true, message: "Service deleted successfully" });

    } catch (error) {
        console.error("Error deleting service:", error);
        res.json({ success: false, message: error.message });
    }
};


// Get All Reviews 
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({})
      .populate('userId', 'name email image')      
      .populate('doctorId', 'name speciality image')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- ADD REVIEW (Admin can manually add reviews) -----------------
const addReview = async (req, res) => {
    try {
        const { 
            appointmentId, userId, doctorId, 
            userName, userImage, serviceName, 
            doctorName, doctorImage, rating, review 
        } = req.body;

        // Validation
        if (!appointmentId || !userId || !doctorId || !userName || !serviceName || !doctorName || !rating || !review) {
            return res.status(400).json({ 
                success: false, 
                message: "All required fields must be provided" 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: "Rating must be between 1 and 5" 
            });
        }

        // Create new review
        const newReview = new reviewModel({
            appointmentId,
            userId,
            doctorId,
            userName,
            userImage: userImage || '',
            serviceName,
            doctorName,
            doctorImage: doctorImage || '',
            rating,
            review
        });

        await newReview.save();
        
        res.status(200).json({ 
            success: true, 
            message: "Review added successfully",
            review: newReview 
        });

    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};

// ----------------- UPDATE REVIEW -----------------
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, review: reviewText } = req.body;

        const reviewData = await reviewModel.findById(reviewId);
        if (!reviewData) {
            return res.json({ success: false, message: "Review not found" });
        }

        // Update only rating and review text (admin can modify these)
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.json({ 
                    success: false, 
                    message: "Rating must be between 1 and 5" 
                });
            }
            reviewData.rating = rating;
        }

        if (reviewText !== undefined && reviewText.trim() !== "") {
            reviewData.review = reviewText;
        }

        await reviewData.save();
        
        res.json({ 
            success: true, 
            message: "Review updated successfully",
            review: reviewData 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete Review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        await reviewModel.findByIdAndDelete(reviewId);

        res.json({ success: true, message: "Review deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- VERIFY DOCTOR -----------------
const verifyDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const adminId = req.body.adminId; // Get from auth middleware

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Check if profile is complete (100%)
        const fields = [
            doctor.name, doctor.email, doctor.gender, doctor.dob, doctor.phone,
            doctor.degree, doctor.speciality, doctor.experience, doctor.about,
            doctor.fees, doctor.address?.line1, doctor.address?.line2,
            doctor.medicalLicenseNumber, doctor.licenseAuthority, doctor.licenseExpiry,
            doctor.hospitalName, doctor.clinicAddress,
            doctor.documents?.identityProof, doctor.documents?.medicalLicense,
            doctor.documents?.degreeCertificate
        ];
        
        const filledFields = fields.filter(field => field && field !== '').length;
        const completion = Math.round((filledFields / fields.length) * 100);

        if (completion < 100) {
            return res.json({ 
                success: false, 
                message: `Profile must be 100% complete. Current: ${completion}%` 
            });
        }

        // Update verification status
        doctor.isVerified = true;
        doctor.verificationStatus = 'verified';
        doctor.verifiedBy = adminId;
        doctor.verifiedAt = new Date();
        doctor.rejectionReason = undefined; // Clear any previous rejection reason

        await doctor.save();

        res.json({ success: true, message: "Doctor verified successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- REJECT DOCTOR -----------------
const rejectDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { reason } = req.body;

        if (!reason || reason.trim() === '') {
            return res.json({ success: false, message: "Rejection reason is required" });
        }

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Update verification status
        doctor.isVerified = false;
        doctor.verificationStatus = 'rejected';
        doctor.rejectionReason = reason;
        doctor.verifiedBy = undefined;
        doctor.verifiedAt = undefined;

        await doctor.save();

        res.json({ success: true, message: "Doctor verification rejected" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- UNVERIFY DOCTOR -----------------
const unverifyDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Remove verification
        doctor.isVerified = false;
        doctor.verificationStatus = 'pending';
        doctor.verifiedBy = undefined;
        doctor.verifiedAt = undefined;
        doctor.rejectionReason = undefined;

        await doctor.save();

        res.json({ success: true, message: "Doctor verification removed successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- GET ALL CONTACTS (ADMIN) -----------------
const getAllContacts = async (req, res) => {
    try {
        const contacts = await contactModel
            .find({})
            .sort({ createdAt: -1 });

        res.json({ success: true, contacts });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- DELETE CONTACT (ADMIN) -----------------
const deleteContact = async (req, res) => {
    try {
        const { contactId } = req.params;

        const contact = await contactModel.findById(contactId);
        if (!contact) {
            return res.json({ success: false, message: "Contact not found" });
        }

        await contactModel.findByIdAndDelete(contactId);

        res.json({ success: true, message: "Contact deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// ----------------- GET ALL DOCTOR REGISTRATIONS -----------------
const getAllDoctorRegistrations = async (req, res) => {
    try {
        const registrations = await doctorRegistration
            .find({})
            .sort({ createdAt: -1 });

        res.json({ success: true, registrations });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ----------------- DELETE DOCTOR REGISTRATION -----------------
const deleteDoctorRegistration = async (req, res) => {
    try {
        const { registrationId } = req.params;

        const registration = await doctorRegistration.findById(registrationId);
        if (!registration) {
            return res.json({ success: false, message: "Registration not found" });
        }

        await doctorRegistration.findByIdAndDelete(registrationId);

        res.json({ success: true, message: "Registration deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Helper function to generate status email templates
const getStatusEmailTemplate = (status, registration) => {
    const statusMessages = {
        pending: {
            subject: '⏳ Registration Status: Under Review - HealthCrew24x7',
            title: 'Registration Under Review',
            message: 'Your doctor registration has been marked as pending. Our team is currently reviewing your application.',
            color: '#f59e0b',
            icon: '⏳'
        },
        reviewed: {
            subject: '👀 Registration Status: Reviewed - HealthCrew24x7',
            title: 'Application Reviewed',
            message: 'Your doctor registration has been reviewed by our team. We will update you with the final decision soon.',
            color: '#3b82f6',
            icon: '👀'
        },
        approved: {
            subject: '🎉 Registration Approved - Welcome to HealthCrew24x7!',
            title: 'Congratulations! Registration Approved',
            message: 'We are pleased to inform you that your doctor registration has been approved! Our team will contact you shortly with the next steps to get you onboarded.',
            color: '#10b981',
            icon: '✅'
        },
        rejected: {
            subject: '❌ Registration Status: Not Approved - HealthCrew24x7',
            title: 'Registration Not Approved',
            message: 'Unfortunately, we are unable to approve your registration at this time. If you have any questions, please feel free to contact us.',
            color: '#ef4444',
            icon: '❌'
        }
    };

    const statusInfo = statusMessages[status];

    return {
        subject: statusInfo.subject,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                    .header { background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%); color: white; padding: 40px 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; }
                    .header .icon { font-size: 48px; margin-bottom: 10px; }
                    .content { padding: 40px 30px; background: #f9fafb; }
                    .message-box { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 5px solid ${statusInfo.color}; }
                    .message-box h2 { color: ${statusInfo.color}; margin-top: 0; }
                    .message-box p { font-size: 16px; line-height: 1.8; color: #555; }
                    .info-section { background: white; padding: 25px; margin-top: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                    .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
                    .info-row:last-child { border-bottom: none; }
                    .info-label { font-weight: bold; color: #6b7280; width: 140px; }
                    .info-value { color: #111827; flex: 1; }
                    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; background: ${statusInfo.color}; color: white; font-weight: bold; text-transform: uppercase; font-size: 12px; margin: 20px 0; }
                    .footer { padding: 30px; text-align: center; background: #f9fafb; border-top: 1px solid #e5e7eb; }
                    .footer p { margin: 5px 0; color: #6b7280; font-size: 14px; }
                    .contact-info { background: #eff6ff; padding: 20px; border-radius: 8px; margin-top: 20px; }
                    .contact-info p { margin: 8px 0; color: #1e40af; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="icon">${statusInfo.icon}</div>
                        <h1>${statusInfo.title}</h1>
                    </div>
                    
                    <div class="content">
                        <div class="message-box">
                            <h2>Dear ${registration.fullName},</h2>
                            <p>${statusInfo.message}</p>
                            <span class="status-badge">Status: ${status.toUpperCase()}</span>
                        </div>

                        <div class="info-section">
                            <h3 style="margin-top: 0; color: #111827;">Your Registration Details</h3>
                            <div class="info-row">
                                <span class="info-label">Full Name:</span>
                                <span class="info-value">${registration.fullName}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">${registration.email}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span class="info-value">${registration.phone}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Profession:</span>
                                <span class="info-value" style="text-transform: capitalize;">${registration.profession}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Specialization:</span>
                                <span class="info-value">${registration.specialization}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Experience:</span>
                                <span class="info-value">${registration.experience}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Location:</span>
                                <span class="info-value">${registration.city}, ${registration.state}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Submitted On:</span>
                                <span class="info-value">${new Date(registration.createdAt).toLocaleDateString('en-IN', { 
                                    day: '2-digit', 
                                    month: 'short', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                        </div>

                        <div class="contact-info">
                            <p><strong>📧 Need Help?</strong></p>
                            <p>If you have any questions, please contact us at <strong>${process.env.MAIL_USER}</strong></p>
                            <p>We're here to help you!</p>
                        </div>
                    </div>

                    <div class="footer">
                        <p><strong>HealthCrew24x7</strong></p>
                        <p>Your trusted healthcare partner</p>
                        <p style="font-size: 12px; margin-top: 15px;">This is an automated email. Please do not reply directly to this message.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
};

// ----------------- UPDATE REGISTRATION STATUS (WITH EMAIL NOTIFICATION) -----------------
const updateRegistrationStatus = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const { status } = req.body;

        if (!['pending', 'reviewed', 'approved', 'rejected'].includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        const registration = await doctorRegistration.findById(registrationId);
        if (!registration) {
            return res.json({ success: false, message: "Registration not found" });
        }

        const oldStatus = registration.status;
        registration.status = status;
        await registration.save();

        // Send email notification to applicant
        const emailConfigured = process.env.MAIL_USER && process.env.MAIL_PASS;

        if (emailConfigured && oldStatus !== status) {
            try {
                const statusEmailTemplate = getStatusEmailTemplate(status, registration);
                await sendEmail(registration.email, statusEmailTemplate);
                console.log(`✅ Status update email sent to ${registration.email} (Status: ${status})`);
            } catch (emailError) {
                console.error('❌ Failed to send status update email:', emailError.message);
                // Email fail hone par bhi status update successful rahega
            }
        }

        res.json({ 
            success: true, 
            message: "Status updated successfully",
            emailSent: emailConfigured && oldStatus !== status 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



export {
    loginAdmin, addDoctor, updateDoctor, deleteDoctor, allDoctors,
    appointmentsAdmin, appointmentCancel, adminDashboard, allUsers, deleteUser,
    deleteAppointment, addService, allServices, updateService, deleteService, 
    getAllReviews, addReview, updateReview, deleteReview, verifyDoctor, rejectDoctor, unverifyDoctor, getAllContacts, deleteContact, getAllDoctorRegistrations, 
    deleteDoctorRegistration, updateRegistrationStatus
};


