const nodemailer = require("nodemailer");
const emailValidator = require("email-validator");
const dns = require("dns").promises;

exports.sendWelcomeMail = async (email) => {
  try {
    if (!emailValidator.validate(email)) {
      return {
        success: false,
        message: "Invalid email format",
      };
    }

    // Step 2: Check MX records
    const domain = email.split("@")[1];

    try {
      const mxRecords = await dns.resolveMx(domain);

      if (!mxRecords || mxRecords.length === 0) {
        return {
          success: false,
          message:
            "This email address can't receive messages. Please check for typos.",
        };
      }
    } catch (dnsError) {
      console.error("DNS Lookup Error:", dnsError);
      return {
        success: false,
        message:
          "We couldn't verify this email. Please check the address and try again.",
      };
    }
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

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email welcome sent:", info.response);

    return {
      success: true,
      message: "Email sent successfully",
      info: info.response,
    };
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
