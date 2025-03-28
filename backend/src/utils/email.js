import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendAppointmentEmail = async (email, data) => {
  let subject, html;

  switch (data.type) {
    case 'new':
      subject = 'New Appointment Request';
      html = `
        <h1>New Appointment Request</h1>
        <p>A new appointment has been scheduled for ${new Date(data.appointmentDate).toLocaleString()}</p>
        <p>Patient: ${data.patientName}</p>
      `;
      break;

    case 'confirmed':
      subject = 'Appointment Confirmed';
      html = `
        <h1>Appointment Confirmed</h1>
        <p>Your appointment with Dr. ${data.doctorName} has been confirmed.</p>
        <p>Date & Time: ${new Date(data.appointmentDate).toLocaleString()}</p>
      `;
      break;

    case 'cancelled':
      subject = 'Appointment Cancelled';
      html = `
        <h1>Appointment Cancelled</h1>
        <p>Your appointment with Dr. ${data.doctorName} has been cancelled.</p>
        <p>Reason: ${data.reason || 'No reason provided'}</p>
      `;
      break;

    case 'rescheduled':
      subject = 'Appointment Rescheduled';
      html = `
        <h1>Appointment Rescheduled</h1>
        <p>Your appointment with Dr. ${data.doctorName} has been rescheduled.</p>
        <p>New Date & Time: ${new Date(data.appointmentDate).toLocaleString()}</p>
      `;
      break;
  }

  const mailOptions = {
    from: `"Hospital Management System" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendPrescriptionEmail = async (email, data) => {
  const mailOptions = {
    from: `"Hospital Management System" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Digital Prescription',
    html: `
      <h1>Digital Prescription</h1>
      <p>Dear Patient,</p>
      <p>Dr. ${data.doctorName} has generated your prescription.</p>
      <p>Consultation Fee: ₹${data.consultationFee}</p>
      <p>Please find your prescription attached below.</p>
      <p>You can also download it from here: <a href="${process.env.BASE_URL}${data.pdfUrl}">Download Prescription</a></p>
    `,
    attachments: [
      {
        filename: 'prescription.pdf',
        path: `.${data.pdfUrl}`
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Prescription email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending prescription email:', error);
    throw error;
  }
};

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Hospital Management System" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset OTP',
    html: `
      <h1>Password Reset OTP</h1>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};