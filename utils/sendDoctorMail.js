import transporter from "../config/mailer.js";

const sendDoctorMail = async (doctorEmail, appointment) => {
  try {
    // ✅ Address ko properly format karte hain
    const addressLine1 = appointment.userData.address?.line1 || '';
    const addressLine2 = appointment.userData.address?.line2 || '';
    const fullAddress = [addressLine1, addressLine2].filter(Boolean).join(', ') || 'Not provided';

    console.log('📧 Sending email with address:', fullAddress); // Debug ke liye

    // 🐛 DEBUG: Check karo ki address kya aa raha hai
    console.log('🔍 Full appointment.userData:', JSON.stringify(appointment.userData, null, 2));
    console.log('🔍 Address object:', appointment.userData.address);
    console.log('🔍 Address type:', typeof appointment.userData.address);


    await transporter.sendMail({
      from: `"HealthCrew 24x7" <${process.env.MAIL_USER}>`,
      to: doctorEmail,
      subject: "🩺 New Appointment Booked",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans">
  <div class="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-lg overflow-hidden">
    
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
      <h1 class="text-2xl font-bold flex items-center gap-2">
        🩺 New Appointment Notification
      </h1>
      <p class="text-blue-100 mt-1">HealthCrew 24x7</p>
    </div>

    <!-- Patient Details Section -->
    <div class="p-6 bg-gray-50 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        👤 Patient Details
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <p class="text-sm text-gray-500 mb-1">Name</p>
          <p class="text-gray-800 font-medium">${appointment.userData.name || 'Not provided'}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <p class="text-sm text-gray-500 mb-1">Email</p>
          <p class="text-gray-800 font-medium">${appointment.userData.email || 'Not provided'}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <p class="text-sm text-gray-500 mb-1">Contact</p>
          <p class="text-gray-800 font-medium">${appointment.userData.phone || 'Not provided'}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <p class="text-sm text-gray-500 mb-1">Gender</p>
          <p class="text-gray-800 font-medium">${appointment.userData.gender || 'Not provided'}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <p class="text-sm text-gray-500 mb-1">Date of Birth</p>
          <p class="text-gray-800 font-medium">${appointment.userData.dob || 'Not provided'}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm col-span-1 md:col-span-2">
          <p class="text-sm text-gray-500 mb-1">Address</p>
          <p class="text-gray-800 font-medium">${fullAddress}</p>
        </div>
      </div>
    </div>

    <!-- Appointment Details Section -->
    <div class="p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📋 Appointment Details
      </h2>
      <div class="space-y-3">
        <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
          <span class="text-2xl">📅</span>
          <div>
            <p class="text-sm text-gray-600">Date</p>
            <p class="text-lg font-semibold text-gray-800">${appointment.slotDate || 'Not provided'}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
          <span class="text-2xl">🕐</span>
          <div>
            <p class="text-sm text-gray-600">Time</p>
            <p class="text-lg font-semibold text-gray-800">${appointment.slotTime || 'Not provided'}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
          <span class="text-2xl">💰</span>
          <div>
            <p class="text-sm text-gray-600">Consultation Fees</p>
            <p class="text-lg font-semibold text-gray-800">₹${appointment.amount || '0'}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-gray-50 p-6 border-t border-gray-200 text-center">
      <p class="text-gray-600 mb-3">Please check your dashboard for more details</p>
      <a href="#" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
        View Dashboard
      </a>
      <p class="text-gray-500 text-sm mt-4">
        © 2024 HealthCrew 24x7. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
      `
    });

    console.log('✅ Doctor notification email sent to:', doctorEmail);
  } catch (error) {
    console.error('❌ Failed to send doctor email:', error.message);
    throw error;
  }
};

export default sendDoctorMail;