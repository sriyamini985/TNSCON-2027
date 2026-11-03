import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const getEmailTemplate = (title, preheader, contentHtml) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF5ED; margin: 0; padding: 0; color: #182230; }
      .container { max-width: 620px; margin: 30px auto; background-color: #FFFDF9; border-radius: 12px; border: 1px solid #E5DCCB; overflow: hidden; box-shadow: 0 4px 20px rgba(0,51,153,0.08); }
      .header { background: #003399; padding: 32px 28px; text-align: center; border-bottom: 4px solid #D49B00; }
      .header h1 { color: #FFFFFF; font-size: 24px; margin: 0 0 6px 0; letter-spacing: 0.5px; }
      .header p { color: #FAF5ED; font-size: 13px; margin: 0; opacity: 0.95; }
      .content { padding: 36px 32px; font-size: 15px; line-height: 1.6; color: #182230; }
      .badge { display: inline-block; background-color: #FFFDF9; color: #003399; border: 1px solid #D49B00; padding: 6px 14px; border-radius: 6px; font-weight: bold; font-size: 14px; margin: 12px 0; }
      .card { background: #FAF5ED; border-left: 4px solid #003399; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; border-top: 1px solid #E5DCCB; border-right: 1px solid #E5DCCB; border-bottom: 1px solid #E5DCCB; }
      .footer { background-color: #FAF5ED; border-top: 1px solid #E5DCCB; padding: 24px; text-align: center; font-size: 12px; color: #556070; }
      .footer a { color: #003399; text-decoration: none; font-weight: 600; }
    </style>
  </head>
  <body>
    <div style="display:none;font-size:1px;color:#fff;max-height:0;overflow:hidden;">${preheader}</div>
    <div class="container">
      <div class="header">
        <h1>TNSCON 2027</h1>
        <p>11th Annual Conference of Telangana Neurosciences Society</p>
        <p style="margin-top: 4px; font-size: 12px; color: #D49B00;">12–14 March 2027 • Begumpet Airport, Hyderabad</p>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p><strong>Telangana Neurosciences Society Secretariat</strong></p>
        <p>Conference Hall, Rajeev Gandhi Terminal, Begumpet Airport, Hyderabad, Telangana</p>
        <p><a href="https://www.tnscon2027hyd.com">www.tnscon2027hyd.com</a> • Official Conference Portal</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export const sendRegistrationSubmittedEmail = async (reg) => {
  const transporter = createTransporter();
  const fullName = `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim();
  const html = getEmailTemplate(
    'Registration Received',
    `TNSCON 2027 Registration Received - ${reg.registrationId}`,
    `
    <p>Dear ${fullName},</p>
    <p>Thank you for registering for <strong>TNSCON 2027 — The 11th Annual Conference of Telangana Neurosciences Society</strong>.</p>
    <div class="card">
      <p style="margin: 0 0 6px 0;"><strong>Registration ID:</strong> <span class="badge">${reg.registrationId}</span></p>
      <p style="margin: 0 0 6px 0;"><strong>Category:</strong> ${reg.category}</p>
      <p style="margin: 0 0 6px 0;"><strong>Transaction Reference / UTR:</strong> ${reg.transactionId}</p>
      <p style="margin: 0 0 6px 0;"><strong>Amount Paid:</strong> ₹${reg.fee}</p>
      <p style="margin: 0;"><strong>Payment Status:</strong> <span style="color: #D97706; font-weight: 600;">Verification Pending</span></p>
    </div>
    <p>Our organizing secretariat accounts team is verifying your payment reference with the bank statement. You will receive an official verification confirmation email once approved.</p>
    <p>Please preserve this email and your Registration ID for all future correspondence.</p>
    <p style="margin-top: 24px;">Warm regards,<br><strong>Organizing Secretariat</strong><br>TNSCON 2027</p>
    `
  );

  if (!transporter) {
    console.log(`[EMAIL SIMULATED] Registration submitted sent to: ${reg.email} (ID: ${reg.registrationId})`);
    return { simulated: true, to: reg.email };
  }

  return transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'TNSCON 2027 Secretariat'}" <${process.env.SMTP_FROM}>`,
    to: reg.email,
    subject: `[TNSCON 2027] Registration Acknowledged — ${reg.registrationId}`,
    html
  });
};

export const sendRegistrationApprovedEmail = async (reg) => {
  const transporter = createTransporter();
  const fullName = `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim();
  const html = getEmailTemplate(
    'Registration Verified & Confirmed',
    `Your TNSCON 2027 Registration is Confirmed - ${reg.registrationId}`,
    `
    <p>Dear ${fullName},</p>
    <p style="color: #059669; font-weight: 600; font-size: 16px;">We are pleased to inform you that your registration and payment for TNSCON 2027 have been successfully verified!</p>
    <div class="card" style="border-left-color: #059669;">
      <p style="margin: 0 0 6px 0;"><strong>Confirmed Registration ID:</strong> <span class="badge" style="background:#ECFDF5; border-color:#059669; color:#065F46;">${reg.registrationId}</span></p>
      <p style="margin: 0 0 6px 0;"><strong>Delegate Category:</strong> ${reg.category}</p>
      <p style="margin: 0 0 6px 0;"><strong>Institution:</strong> ${reg.hospital}</p>
      <p style="margin: 0 0 6px 0;"><strong>Conference Dates:</strong> 12th – 14th March 2027</p>
      <p style="margin: 0;"><strong>Venue:</strong> Conference Hall, Rajeev Gandhi Terminal, Begumpet Airport, Hyderabad</p>
    </div>
    <p>Your official delegate badge and conference kit can be collected directly from the on-site registration desk at the venue using this Registration ID.</p>
    <p style="margin-top: 24px;">We look forward to welcoming you to Hyderabad!</p>
    <p>Warm regards,<br><strong>Dr. R T S Naik</strong> (Organizing Chairman)<br><strong>Dr. Chandrakanth Tapsi</strong> (Organizing Secretary)</p>
    `
  );

  if (!transporter) {
    console.log(`[EMAIL SIMULATED] Registration approved sent to: ${reg.email} (ID: ${reg.registrationId})`);
    return { simulated: true, to: reg.email };
  }

  return transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'TNSCON 2027 Secretariat'}" <${process.env.SMTP_FROM}>`,
    to: reg.email,
    subject: `[CONFIRMED] TNSCON 2027 Delegate Pass — ${reg.registrationId}`,
    html
  });
};

export const sendAbstractSubmittedEmail = async (abs) => {
  const transporter = createTransporter();
  const html = getEmailTemplate(
    'Abstract Submission Received',
    `TNSCON 2027 Abstract Acknowledged - ${abs.submissionId}`,
    `
    <p>Dear ${abs.presentingAuthorTitle || ''} ${abs.presentingAuthorName},</p>
    <p>Your abstract submission for <strong>TNSCON 2027</strong> has been successfully received by the Scientific Committee.</p>
    <div class="card">
      <p style="margin: 0 0 6px 0;"><strong>Submission ID:</strong> <span class="badge">${abs.submissionId}</span></p>
      <p style="margin: 0 0 6px 0;"><strong>Category:</strong> ${abs.category}</p>
      <p style="margin: 0 0 6px 0;"><strong>Specialty & Topic:</strong> ${abs.specialty} — ${abs.subTopic}</p>
      <p style="margin: 0 0 6px 0;"><strong>Abstract Title:</strong> <em>"${abs.title}"</em></p>
      <p style="margin: 0;"><strong>Current Status:</strong> <span style="color: #2563EB; font-weight: 600;">Under Scientific Review</span></p>
    </div>
    <p><strong>Important Reminder:</strong> As per conference guidelines, all presenting authors must complete delegate registration by <strong>31st January 2027</strong>. Scientific committee review notifications will be communicated via email.</p>
    <p style="margin-top: 24px;">Warm regards,<br><strong>Scientific Committee</strong><br>Dr. N Pratap Kumar (Neurosurgery)<br>Dr. Subbaiah Choudary (Neurology)</p>
    `
  );

  if (!transporter) {
    console.log(`[EMAIL SIMULATED] Abstract submission email sent to: ${abs.presentingAuthorEmail} (ID: ${abs.submissionId})`);
    return { simulated: true, to: abs.presentingAuthorEmail };
  }

  return transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'TNSCON 2027 Secretariat'}" <${process.env.SMTP_FROM}>`,
    to: abs.presentingAuthorEmail,
    subject: `[TNSCON 2027] Abstract Received — ${abs.submissionId}`,
    html
  });
};
