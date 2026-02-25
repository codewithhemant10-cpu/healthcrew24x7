// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/mongodb.js'
// import connectCloudinary from './config/cloudinary.js'
// import adminRouter from './routes/adminRoute.js'
// import doctorRouter from './routes/doctorRoute.js'
// import userRouter from './routes/userRoute.js'

// // app config
// const app = express()
// const port = process.env.PORT || 4000

// // Connect to database (CALL THE FUNCTION)
// connectDB()
// connectCloudinary()

// // middlewares
// app.use(express.json())
// app.use(cors())

// // api endpoints
// app.use('/api/admin', adminRouter)
// app.use('/api/doctor', doctorRouter)
// app.use("/api/user", userRouter)


// app.get("/", (req, res) => {
//   res.send("API Working")
// });

// app.get('/test-db', (req, res) => {
//   const state = mongoose.connection.readyState;
//   if (state === 1) {
//     res.send('Database is connected');
//   } else {
//     res.status(500).send('Database is NOT connected');
//   }
// });


// app.listen(port, () => console.log(`Server started on PORT:${port}`))


import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import transporter from './config/mailer.js'


// app config
const app = express()
const port = process.env.PORT || 4000

// Connect to database (CALL THE FUNCTION)
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use("/api/user", userRouter)

// Basic route
app.get("/", (req, res) => {
  res.send("API Working")
});

// Database test route
app.get('/test-db', (req, res) => {
  const state = mongoose.connection.readyState;
  if (state === 1) {
    res.send('Database is connected');
  } else {
    res.status(500).send('Database is NOT connected');
  }
});

// 📧 Email Configuration Test Route
app.get('/test-email', async (req, res) => {
  try {
    console.log('\n🔍 Testing Email Configuration...');
    console.log('MAIL_USER:', process.env.MAIL_USER);
    console.log('MAIL_PASS:', process.env.MAIL_PASS ? 'EXISTS ✅' : 'MISSING ❌');

    // Check if credentials exist
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: '❌ Email credentials missing in .env file',
        debug: {
          MAIL_USER: process.env.MAIL_USER || 'Not Set',
          MAIL_PASS: process.env.MAIL_PASS ? 'Set' : 'Not Set'
        }
      });
    }

    // Try to send test email
    const info = await transporter.sendMail({
      from: `"HealthCrew Test" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER, // Send to yourself
      subject: '✅ Email Configuration Test - HealthCrew24x7',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">✅ Email Working Successfully!</h2>
          <p>Your email configuration is correct.</p>
          <hr>
          <p><strong>Server:</strong> smtp.hostinger.com</p>
          <p><strong>From:</strong> ${process.env.MAIL_USER}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);

    res.json({
      success: true,
      message: '✅ Email sent successfully',
      data: {
        messageId: info.messageId,
        from: process.env.MAIL_USER,
        to: process.env.MAIL_USER,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Email Test Failed:', error);
    
    res.status(500).json({
      success: false,
      message: '❌ Email test failed',
      error: error.message,
      debug: {
        errorCode: error.code,
        command: error.command,
        MAIL_USER: process.env.MAIL_USER || 'Not Set'
      }
    });
  }
});

// 🔍 Environment Variables Debug Route
app.get('/debug-env', (req, res) => {
  res.json({
    environment: {
      PORT: process.env.PORT || 'Not Set',
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
      MAIL_USER: process.env.MAIL_USER || '❌ Missing',
      MAIL_PASS: process.env.MAIL_PASS ? '✅ Set (hidden)' : '❌ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME ? '✅ Set' : '❌ Missing',
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing',
    },
    message: 'Check if all required variables are set'
  });
});

app.listen(port, () => {
  console.log(`\n🚀 Server started on PORT: ${port}`);
  console.log(`📧 Test email: http://localhost:${port}/test-email`);
  console.log(`🔍 Debug env: http://localhost:${port}/debug-env\n`);
});