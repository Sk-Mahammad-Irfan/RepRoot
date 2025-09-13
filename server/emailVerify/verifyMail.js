const nodemailer = require("nodemailer");

// Function to send email verification link
exports.verifyMail = async (token, email) => {
  try {
    // Create a reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER, // Sender's email
        pass: process.env.MAIL_PASS, // Sender's email password
      },
    });

    // Define the email configuration with HTML content
    const mailOptions = {
      from: process.env.MAIL_USER, // Sender's email address
      to: email, // Recipient's email address
      subject: "Email Verification", // Email subject
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; color: #333;">
          <h2 style="color: #4CAF50;">Welcome to RepRoot!</h2>
          <p style="font-size: 16px;">Thank you for registering with RepRoot. Please verify your email address to complete your registration.</p>
          
          <p style="font-size: 16px;">Click the button below to verify your email:</p>

          <a href="${process.env.CLIENT_URL}/verify/${token}" 
             style="display: inline-block; padding: 12px 25px; margin-top: 20px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
             Verify Email
          </a>
          
          <p style="font-size: 14px; margin-top: 20px;">If you did not register for RepRoot, please ignore this email.</p>
          
          <p style="font-size: 12px; color: #777; margin-top: 50px;">Best regards,<br>The RepRoot Team</p>
        </div>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("❌ Could not send email:", error.message);
      } else {
        console.log("✅ Email sent successfully:", info.response);
      }
    });
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
  }
};
