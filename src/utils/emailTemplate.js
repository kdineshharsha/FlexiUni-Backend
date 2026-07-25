// 1.Student confirmation email
export const applicationSuccessTemplate = (
  studentName,
  jobTitle,
  companyName,
) => {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4f39f6; margin: 0;">FlexiUni</h1>
            </div>
            <h2 style="color: #1e293b; font-size: 20px;">Application Submitted Successfully! 🎉</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.5;">Hi <strong>${studentName}</strong>,</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.5;">
                Great news! Your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been successfully submitted.
            </p>
            <p style="color: #475569; font-size: 16px; line-height: 1.5;">
                The employer will review your profile and get in touch with you if you are a good fit for the role. Best of luck!
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} FlexiUni. All rights reserved.
            </p>
        </div>
    `;
};

// 2. Employer new applicant alert
export const newApplicantAlertTemplate = (
  employerName,
  jobTitle,
  studentName,
) => {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #1e293b; font-size: 20px;">New Application Received! 📄</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.5;">Hi <strong>${employerName}</strong>,</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.5;">
                You just received a new application for your <strong>${jobTitle}</strong> job posting.
            </p>
            <p style="color: #475569; font-size: 16px; line-height: 1.5;">
                <strong>${studentName}</strong> has applied for this role. Log in to your FlexiUni dashboard to review their profile and resume.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #4f39f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">View Application</a>
            </div>
        </div>
    `;
};

// 3. Forgot Password Template
export const forgotPasswordTemplate = (userName, resetLink) => {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #1e293b; font-size: 20px;">Password Reset Request 🔐</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.5;">Hi <strong>${userName}</strong>,</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.5;">
                We received a request to reset the password for your FlexiUni account. Click the button below to choose a new password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #4f39f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #475569; font-size: 14px; line-height: 1.5; background-color: #f8fafc; padding: 15px; border-radius: 8px;">
                <strong>Note:</strong> This link is only valid for 15 minutes. If you did not request a password reset, you can safely ignore this email.
            </p>
        </div>
    `;
};
