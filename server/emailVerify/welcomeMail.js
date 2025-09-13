const nodemailer = require("nodemailer");

exports.sendWelcomeMail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Welcome to Reproot!",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <div style="text-align: center;">
      <img src="https://i.ibb.co/nQXkG7P/reproot-logo.png" alt="Reproot Logo" style="max-width: 150px; margin-bottom: 20px;" />
    </div>
    <h1 style="color: #2c3e50;">Welcome to <span style="color: #3498db;">Reproot</span>!</h1>
    <p style="font-size: 16px; color: #555;">
      Hi there 👋,
    </p>
    <p style="font-size: 16px; color: #555;">
      RepRoot is the ultimate platform where you can find your dream job and connect with top employers. We're <strong>excited</strong> to have you on board!
    </p>
    <p style="font-size: 16px; color: #555;">
      To get started, log in to your dashboard and complete your profile. The more complete your profile, the better your chances of getting noticed by top companies.
    </p>
    <p style="font-size: 16px; color: #555;">
      Need help? Reach out to our support team anytime.
    </p>
    
    </div>
    <p style="font-size: 14px; color: #888;">
      Best regards,<br/>
      The RepRoot Team
    </p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
    <p style="font-size: 12px; color: #aaa; text-align: center;">
      © ${new Date().getFullYear()} Reproot. All rights reserved.
    </p>
  </div>
`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
