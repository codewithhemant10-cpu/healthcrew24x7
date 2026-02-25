import transporter from './mailer.js';

// 📧 Email Templates with Tailwind CSS
const emailTemplates = {
  // ✅ Appointment Accepted
  appointmentAccepted: (patientName, doctorName, date, time) => ({
    subject: '✅ Appointment Accepted - HealthCrew24x7',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 font-sans">
        <div class="max-w-2xl mx-auto my-8">
          <!-- Header -->
          <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 rounded-t-xl text-center">
            <h1 class="text-3xl font-bold">✅ Appointment Accepted</h1>
            <p class="text-purple-100 mt-2">HealthCrew24x7</p>
          </div>

          <!-- Content -->
          <div class="bg-white p-8 shadow-lg">
            <p class="text-gray-700 text-lg mb-4">Dear <span class="font-semibold text-gray-900">${patientName}</span>,</p>
            <p class="text-gray-600 mb-6">Great news! Your appointment has been confirmed.</p>
            
            <!-- Appointment Details Card -->
            <div class="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl shadow-md mb-6 border border-purple-100">
              <h3 class="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                📋 Appointment Details
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Status:</span>
                  <span class="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">Accepted</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Doctor:</span>
                  <span class="text-gray-900 font-semibold">Dr. ${doctorName}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Date:</span>
                  <span class="text-gray-900 font-semibold">${date}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Time:</span>
                  <span class="text-gray-900 font-semibold">${time}</span>
                </div>
              </div>
            </div>

            <!-- Important Notice -->
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
              <p class="text-yellow-800">
                <span class="font-bold">⚠️ Important:</span> Please arrive 10 minutes before your scheduled time.
              </p>
            </div>

            <p class="text-gray-600 mb-6">If you need to reschedule or cancel, please contact us as soon as possible.</p>
            
            <!-- CTA Button -->
            <div class="text-center">
              <a href="http://localhost:5173/my-appointments" 
                 class="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg">
                View My Appointments
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="bg-gray-50 p-6 rounded-b-xl text-center border-t">
            <p class="text-gray-600 text-sm">© 2026 HealthCrew24x7. All rights reserved.</p>
            <p class="text-gray-500 text-xs mt-1">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // ❌ Appointment Cancelled (Doctor ne cancel kiya)
  appointmentCancelled: (patientName, doctorName, date, time) => ({
    subject: '❌ Appointment Cancelled - HealthCrew24x7',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 font-sans">
        <div class="max-w-2xl mx-auto my-8">
          <!-- Header -->
          <div class="bg-gradient-to-r from-red-600 to-red-800 text-white p-8 rounded-t-xl text-center">
            <h1 class="text-3xl font-bold">❌ Appointment Cancelled</h1>
            <p class="text-red-100 mt-2">HealthCrew24x7</p>
          </div>

          <!-- Content -->
          <div class="bg-white p-8 shadow-lg">
            <p class="text-gray-700 text-lg mb-4">Dear <span class="font-semibold text-gray-900">${patientName}</span>,</p>
            <p class="text-gray-600 mb-6">We regret to inform you that your appointment has been cancelled by the doctor.</p>
            
            <!-- Cancelled Appointment Details Card -->
            <div class="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl shadow-md mb-6 border border-red-100">
              <h3 class="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                📋 Cancelled Appointment Details
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Status:</span>
                  <span class="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">Cancelled</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Doctor:</span>
                  <span class="text-gray-900 font-semibold">Dr. ${doctorName}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Date:</span>
                  <span class="text-gray-900 font-semibold">${date}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Time:</span>
                  <span class="text-gray-900 font-semibold">${time}</span>
                </div>
              </div>
            </div>

            <!-- Next Steps Notice -->
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <p class="text-red-800">
                <span class="font-bold">📌 Next Steps:</span> You can book a new appointment at your convenience.
              </p>
            </div>

            <p class="text-gray-600 mb-6">We apologize for any inconvenience caused.</p>
            
            <!-- CTA Button -->
            <div class="text-center">
              <a href="http://localhost:5173/doctors" 
                 class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
                Book New Appointment
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="bg-gray-50 p-6 rounded-b-xl text-center border-t">
            <p class="text-gray-600 text-sm">© 2026 HealthCrew24x7. All rights reserved.</p>
            <p class="text-gray-500 text-xs mt-1">Need help? Contact us at support@healthcrew24x7.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // 🚫 Patient Cancelled Appointment (Naya template - Patient ne cancel kiya)
  patientCancelledAppointment: (doctorName, patientName, date, time) => ({
    subject: '🚫 Appointment Cancelled by Patient - HealthCrew24x7',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 font-sans">
        <div class="max-w-2xl mx-auto my-8">
          <!-- Header -->
          <div class="bg-gradient-to-r from-orange-600 to-red-700 text-white p-8 rounded-t-xl text-center">
            <h1 class="text-3xl font-bold">🚫 Appointment Cancelled</h1>
            <p class="text-orange-100 mt-2">HealthCrew24x7</p>
          </div>

          <!-- Content -->
          <div class="bg-white p-8 shadow-lg">
            <p class="text-gray-700 text-lg mb-4">Dear Dr. <span class="font-semibold text-gray-900">${doctorName}</span>,</p>
            <p class="text-gray-600 mb-6">A patient has cancelled their appointment with you.</p>
            
            <!-- Cancelled Appointment Details Card -->
            <div class="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl shadow-md mb-6 border border-orange-100">
              <h3 class="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
                📋 Cancelled Appointment Details
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Status:</span>
                  <span class="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">Cancelled by Patient</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Patient Name:</span>
                  <span class="text-gray-900 font-semibold">${patientName}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Date:</span>
                  <span class="text-gray-900 font-semibold">${date}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Time:</span>
                  <span class="text-gray-900 font-semibold">${time}</span>
                </div>
              </div>
            </div>

            <!-- Info Notice -->
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
              <p class="text-blue-800">
                <span class="font-bold">📌 Note:</span> This time slot is now available for other patients.
              </p>
            </div>

            <p class="text-gray-600 mb-6">Please check your dashboard for updated appointment schedule.</p>
            
            <!-- CTA Button -->
            <div class="text-center">
              <a href="http://localhost:5173/doctor-dashboard" 
                 class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                View Dashboard
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="bg-gray-50 p-6 rounded-b-xl text-center border-t">
            <p class="text-gray-600 text-sm">© 2026 HealthCrew24x7. All rights reserved.</p>
            <p class="text-gray-500 text-xs mt-1">This is an automated notification email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // ✔️ Appointment Completed
  appointmentCompleted: (patientName, doctorName, date, time) => ({
    subject: '✔️ Appointment Completed - HealthCrew24x7',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 font-sans">
        <div class="max-w-2xl mx-auto my-8">
          <!-- Header -->
          <div class="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8 rounded-t-xl text-center">
            <h1 class="text-3xl font-bold">✔️ Appointment Completed</h1>
            <p class="text-green-100 mt-2">HealthCrew24x7</p>
          </div>

          <!-- Content -->
          <div class="bg-white p-8 shadow-lg">
            <p class="text-gray-700 text-lg mb-4">Dear <span class="font-semibold text-gray-900">${patientName}</span>,</p>
            <p class="text-gray-600 mb-6">Thank you for visiting us! Your appointment has been successfully completed.</p>
            
            <!-- Appointment Summary Card -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md mb-6 border border-green-100">
              <h3 class="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                📋 Appointment Summary
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Status:</span>
                  <span class="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">Completed</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Doctor:</span>
                  <span class="text-gray-900 font-semibold">Dr. ${doctorName}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Date:</span>
                  <span class="text-gray-900 font-semibold">${date}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Time:</span>
                  <span class="text-gray-900 font-semibold">${time}</span>
                </div>
              </div>
            </div>

            <!-- Feedback Notice -->
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
              <p class="text-blue-800">
                <span class="font-bold">⭐ Feedback:</span> We'd love to hear about your experience!
              </p>
            </div>

            <p class="text-gray-600 mb-6">We hope you had a great experience. Take care and stay healthy!</p>
            
            <!-- CTA Button -->
            <div class="text-center">
              <a href="http://localhost:5173/my-appointments" 
                 class="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
                View Appointments
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="bg-gray-50 p-6 rounded-b-xl text-center border-t">
            <p class="text-gray-600 text-sm">© 2026 HealthCrew24x7. All rights reserved.</p>
            <p class="text-gray-500 text-xs mt-1">Your health is our priority!</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // 📋 Referrer Notification
  referrerNotification: (referrerName, patientName, status, doctorName, date, time) => ({
    subject: `📋 Patient Update: ${status} - HealthCrew24x7`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 font-sans">
        <div class="max-w-2xl mx-auto my-8">
          <!-- Header -->
          <div class="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-8 rounded-t-xl text-center">
            <h1 class="text-3xl font-bold">📋 Referral Update</h1>
            <p class="text-amber-100 mt-2">HealthCrew24x7</p>
          </div>

          <!-- Content -->
          <div class="bg-white p-8 shadow-lg">
            <p class="text-gray-700 text-lg mb-4">Dear Dr. <span class="font-semibold text-gray-900">${referrerName}</span>,</p>
            <p class="text-gray-600 mb-6">This is an update regarding the patient you referred:</p>
            
            <!-- Patient Information Card -->
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-md mb-6 border border-amber-100">
              <h3 class="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
                👤 Patient Information
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Patient Name:</span>
                  <span class="text-gray-900 font-semibold">${patientName}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Referred To:</span>
                  <span class="text-gray-900 font-semibold">Dr. ${doctorName}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Status:</span>
                  <span class="px-4 py-1 rounded-full text-sm font-bold text-white ${
                    status === 'Accepted' ? 'bg-green-500' : 
                    status === 'Cancelled' ? 'bg-red-500' : 
                    'bg-blue-500'
                  }">${status}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Appointment Date:</span>
                  <span class="text-gray-900 font-semibold">${date}</span>
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-gray-600 font-medium">Appointment Time:</span>
                  <span class="text-gray-900 font-semibold">${time}</span>
                </div>
              </div>
            </div>

            <!-- Note -->
            <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-6">
              <p class="text-amber-800">
                <span class="font-bold">📌 Note:</span> This is an automated notification for your referral tracking.
              </p>
            </div>

            <p class="text-gray-600">Thank you for your referral and continued collaboration.</p>
          </div>
          
          <!-- Footer -->
          <div class="bg-gray-50 p-6 rounded-b-xl text-center border-t">
            <p class="text-gray-600 text-sm">© 2026 HealthCrew24x7. All rights reserved.</p>
            <p class="text-gray-500 text-xs mt-1">This is an automated notification email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// 📧 Send Email Function
export const sendEmail = async (to, template) => {
  try {
    console.log(`📧 Sending email to: ${to}`);
    
    const mailOptions = {
      from: `"HealthCrew24x7" <${process.env.MAIL_USER}>`,
      to: to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

export { emailTemplates };