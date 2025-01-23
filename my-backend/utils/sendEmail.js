const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // you can use any email service
    auth: {
      user: 'your-email@gmail.com', // replace with your email
      pass: 'your-email-password', // replace with your email password
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
