import nodemailer from 'nodemailer';

const createTransporterWithPort = (port) => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user) {
    return null;
  }

  const isSecure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000
  });
};

const sendMailWithFallback = async (mailOptions) => {
  // 1. Try Resend HTTP API (HTTPS port 443 - zero firewall timeout risk on Render)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const preferredFrom = process.env.RESEND_FROM || `TNSCON 2027 Secretariat <info@tnscon2027hyd.com>`;
      let res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: preferredFrom,
          to: [mailOptions.to],
          subject: mailOptions.subject,
          html: mailOptions.html
        })
      });
      let data = await res.json();

      // If domain verification is still propagating, gracefully fall back to onboarding@resend.dev
      if (!res.ok && data?.message && data.message.toLowerCase().includes('domain')) {
        res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: `TNSCON 2027 Secretariat <onboarding@resend.dev>`,
            to: [mailOptions.to],
            subject: mailOptions.subject,
            html: mailOptions.html
          })
        });
        data = await res.json();
      }

      if (res.ok && data.id) {
        console.log(`[EMAIL DELIVERED via Resend API] to ${mailOptions.to} (ID: ${data.id})`);
        return { success: true, messageId: data.id };
      }
      console.warn('[Resend API Warning]:', data);
      if (data && data.message) {
        return { success: false, error: data.message };
      }
    } catch (apiErr) {
      console.warn('[Resend API Error]:', apiErr.message);
    }
  }

  // 2. Try Brevo HTTP API if key provided (HTTPS port 443)
  if (process.env.BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: mailOptions.fromName || 'TNSCON 2027 Secretariat', email: process.env.BREVO_FROM || 'info@tnscon2027hyd.com' },
          to: [{ email: mailOptions.to }],
          subject: mailOptions.subject,
          htmlContent: mailOptions.html
        })
      });
      const data = await res.json();
      if (res.ok && (data.messageId || data.id)) {
        console.log(`[EMAIL DELIVERED via Brevo API] to ${mailOptions.to} (ID: ${data.messageId || data.id})`);
        return { success: true, messageId: data.messageId || data.id };
      }
      console.warn('[Brevo API Warning]:', data);
    } catch (apiErr) {
      console.warn('[Brevo API Error]:', apiErr.message);
    }
  }

  // 3. Fallback to direct SMTP (ports 587 & 465)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return { success: false, simulated: true, error: 'SMTP server not configured in server/.env' };
  }

  const configuredPort = parseInt(process.env.SMTP_PORT || '587', 10);
  // Try port 587 first (preferred for cloud hosting like Render to avoid port 465 SSL timeout), then 465
  const portsToTry = configuredPort === 465 ? [587, 465] : [configuredPort, 587, 465].filter((v, i, a) => a.indexOf(v) === i);

  let lastError = null;
  for (const port of portsToTry) {
    try {
      const transporter = createTransporterWithPort(port);
      if (!transporter) continue;
      const info = await transporter.sendMail(mailOptions);
      console.log(`[EMAIL DELIVERED] via port ${port} to ${mailOptions.to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId, port };
    } catch (err) {
      console.warn(`[SMTP ATTEMPT FAILED on port ${port}]: ${err.message}`);
      lastError = err;
    }
  }

  return { success: false, error: lastError?.message || 'SMTP delivery failed' };
};

const getEmailTemplate = (title, preheader, contentHtml) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF5ED; margin: 0; padding: 0; color: #182230; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      .container { max-width: 600px; width: 100%; margin: 20px auto; background-color: #FFFDF9; border-radius: 12px; border: 1px solid #E5DCCB; overflow: hidden; box-shadow: 0 4px 20px rgba(0,51,153,0.08); }
      .header { background: #003399; padding: 26px 20px; text-align: center; border-bottom: 4px solid #D49B00; }
      .header h1 { color: #FFFFFF; font-size: 22px; margin: 0 0 6px 0; letter-spacing: 0.5px; font-weight: bold; }
      .header p { color: #FAF5ED; font-size: 13px; margin: 0; opacity: 0.95; }
      .content { padding: 26px 20px; font-size: 14px; line-height: 1.6; color: #182230; }
      .badge { display: inline-block; background-color: #FFFDF9; color: #003399; border: 1.5px solid #D49B00; padding: 6px 14px; border-radius: 6px; font-weight: bold; font-size: 14px; margin: 8px 0; }
      .card { background: #FAF5ED; border-left: 4px solid #003399; padding: 14px 16px; margin: 16px 0; border-radius: 0 8px 8px 0; border-top: 1px solid #E5DCCB; border-right: 1px solid #E5DCCB; border-bottom: 1px solid #E5DCCB; }
      .footer { background-color: #FAF5ED; border-top: 1px solid #E5DCCB; padding: 20px; text-align: center; font-size: 12px; color: #556070; }
      .footer a { color: #003399; text-decoration: none; font-weight: 600; }
      @media only screen and (max-width: 480px) {
        .container { margin: 0 auto !important; border-radius: 0 !important; width: 100% !important; border-left: none !important; border-right: none !important; }
        .header { padding: 20px 14px !important; }
        .content { padding: 18px 14px !important; }
      }
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
      <p style="margin: 0 0 6px 0;"><strong>Transaction Reference / UTR:</strong> <span style="font-family: monospace; font-weight: bold; word-break: break-all;">${reg.transactionId}</span></p>
      <p style="margin: 0 0 6px 0;"><strong>Amount Paid:</strong> ₹${reg.fee}</p>
      <p style="margin: 0;"><strong>Payment Status:</strong> <span style="color: #D97706; font-weight: 600;">Verification Pending</span></p>
    </div>
    <p>Our organizing secretariat accounts team is verifying your payment reference with the bank statement. You will receive an official verification confirmation email once approved.</p>
    <p>Please preserve this email and your Registration ID for all future correspondence.</p>
    <p style="margin-top: 24px;">Warm regards,<br><strong>Organizing Secretariat</strong><br>TNSCON 2027</p>
    `
  );

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'info@tnscon2027hyd.com';
  const fromName = process.env.SMTP_FROM_NAME || 'TNSCON 2027 Secretariat';

  const mailOptions = {
    from: `"${fromName}" <${fromAddress}>`,
    to: reg.email,
    subject: `[TNSCON 2027] Registration Acknowledged — ${reg.registrationId}`,
    html
  };

  const result = await sendMailWithFallback(mailOptions);
  return { ...result, to: reg.email };
};

export const sendRegistrationApprovedEmail = async (reg) => {
  const fullName = `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim();
  const html = getEmailTemplate(
    'Registration Verified & Payment Successful',
    `TNSCON 2027 Registration Verified & Payment Successful — ${reg.registrationId}`,
    `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #ECFDF5; border: 2px solid #059669; border-radius: 50px; padding: 8px 24px;">
        <span style="color: #065F46; font-size: 15px; font-weight: bold; letter-spacing: 0.5px;">
          ✓ REGISTRATION VERIFIED & PAYMENT SUCCESSFUL
        </span>
      </div>
    </div>

    <p style="font-size: 16px; margin-bottom: 12px;">Dear <strong>${fullName}</strong>,</p>

    <p style="line-height: 1.6; color: #182230;">
      We are pleased to inform you that your registration and payment for <strong>TNSCON 2027 — The 11th Annual Conference of Telangana Neurosciences Society</strong> have been <strong>successfully verified and approved</strong> by the Organizing Secretariat Accounts Team.
    </p>

    <!-- Official Registration & Payment Summary Box -->
    <div style="background-color: #FFFDF9; border: 2px solid #D49B00; border-radius: 12px; padding: 20px 16px; margin: 20px 0; box-shadow: 0 4px 14px rgba(212,155,0,0.12);">
      
      <!-- Registration ID Header -->
      <div style="border-bottom: 1px solid #E5DCCB; padding-bottom: 14px; margin-bottom: 14px; text-align: center;">
        <span style="font-size: 11px; text-transform: uppercase; color: #556070; font-weight: bold; letter-spacing: 1.5px; display: block; margin-bottom: 6px;">
          Confirmed Registration ID
        </span>
        <span style="font-size: 26px; font-weight: 800; color: #003399; letter-spacing: 1.5px; display: inline-block; background: #FAF5ED; padding: 6px 22px; border-radius: 8px; border: 1.5px solid #D49B00;">
          ${reg.registrationId}
        </span>
      </div>

      <!-- Payment & Delegate Details Table (Fully Responsive) -->
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.5;">
        <!-- Status Row -->
        <tr style="border-bottom: 1px solid #F0E8D8;">
          <td style="padding: 10px 0; color: #556070; font-weight: 600; width: 40%; vertical-align: middle;">
            Payment Status:
          </td>
          <td style="padding: 10px 0; text-align: right; vertical-align: middle;">
            <span style="display: inline-block; background: #ECFDF5; border: 1px solid #059669; color: #065F46; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; white-space: nowrap;">
              ✓ Payment Verified
            </span>
          </td>
        </tr>

        <!-- Amount Row -->
        <tr style="border-bottom: 1px solid #F0E8D8;">
          <td style="padding: 10px 0; color: #556070; font-weight: 600; width: 40%; vertical-align: middle;">
            Amount Paid:
          </td>
          <td style="padding: 10px 0; text-align: right; font-weight: 800; color: #003399; font-size: 16px; vertical-align: middle;">
            ₹${reg.fee}
          </td>
        </tr>

        <!-- Delegate Name Row -->
        <tr style="border-bottom: 1px solid #F0E8D8;">
          <td style="padding: 10px 0; color: #556070; font-weight: 600; width: 40%; vertical-align: middle;">
            Delegate Name:
          </td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #182230; font-size: 14px; vertical-align: middle;">
            ${fullName}
          </td>
        </tr>

        <!-- Category Row -->
        <tr style="border-bottom: 1px solid #F0E8D8;">
          <td style="padding: 10px 0; color: #556070; font-weight: 600; width: 40%; vertical-align: middle;">
            Category:
          </td>
          <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #003399; font-size: 13px; vertical-align: middle;">
            ${reg.category}
          </td>
        </tr>

        <!-- UTR Full Block -->
        <tr style="border-bottom: 1px solid #F0E8D8;">
          <td colspan="2" style="padding: 10px 0;">
            <div style="color: #556070; font-size: 12px; font-weight: 600; margin-bottom: 4px;">
              UTR / Transaction Reference:
            </div>
            <div style="font-family: Consolas, Monaco, monospace; font-size: 13px; font-weight: bold; color: #182230; word-break: break-all; background: #FAF5ED; padding: 6px 10px; border-radius: 6px; border: 1px solid #E5DCCB; letter-spacing: 0.5px;">
              ${reg.transactionId}
            </div>
          </td>
        </tr>

        <!-- Institution Full Block -->
        <tr>
          <td colspan="2" style="padding: 10px 0 4px 0;">
            <div style="color: #556070; font-size: 12px; font-weight: 600; margin-bottom: 3px;">
              Institution / Hospital:
            </div>
            <div style="color: #182230; font-size: 13px; font-weight: 600;">
              ${reg.hospital || 'Not Specified'}
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Conference Details -->
    <div style="background-color: #FAF5ED; border-left: 4px solid #003399; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; border-top: 1px solid #E5DCCB; border-right: 1px solid #E5DCCB; border-bottom: 1px solid #E5DCCB;">
      <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Conference Dates:</strong> 12th – 14th March 2027 (Friday to Sunday)</p>
      <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Venue:</strong> Conference Hall, Rajeev Gandhi Terminal, Begumpet Airport, Hyderabad</p>
      <p style="margin: 0; font-size: 13px; color: #556070;">Official Conference Portal: <a href="https://www.tnscon2027hyd.com" style="color: #003399; text-decoration: underline; font-weight: 600;">www.tnscon2027hyd.com</a></p>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #374151;">
      <strong>Instructions for Venue Entry & Delegate Kit Collection:</strong><br>
      Please save this email or keep your <strong>Registration ID (${reg.registrationId})</strong> handy. Presenting this ID at the On-Site Registration Counter at Begumpet Airport will allow instant printing of your official delegate pass, CME certification barcode, and conference kit collection.
    </p>

    <p style="margin-top: 28px; font-size: 14px; line-height: 1.6;">
      Warm regards,<br>
      <strong>Dr. R.T.S. Naik</strong> — Organizing Chairman<br>
      <strong>Dr. Chandrakanth Tapsi</strong> — Organizing Secretary<br>
      <span style="color: #556070; font-size: 13px;">TNSCON 2027 Organizing Secretariat • Telangana Neurosciences Society</span>
    </p>
    `
  );

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'info@tnscon2027hyd.com';
  const fromName = process.env.SMTP_FROM_NAME || 'TNSCON 2027 Secretariat';

  const mailOptions = {
    from: `"${fromName}" <${fromAddress}>`,
    to: reg.email,
    subject: `[CONFIRMED] TNSCON 2027 Registration Verified & Payment Successful — ${reg.registrationId}`,
    html
  };

  const result = await sendMailWithFallback(mailOptions);
  return { ...result, to: reg.email };
};

export const sendAbstractSubmittedEmail = async (abs) => {
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
    <p style="margin-top: 24px;">Warm regards,<br><strong>Scientific Committee</strong><br>Dr. T.V. Ramakrishna Murthy (Neurosurgery)<br>Dr. G. Subbaiah Choudary (Neurology)</p>
    `
  );

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'info@tnscon2027hyd.com';
  const fromName = process.env.SMTP_FROM_NAME || 'TNSCON 2027 Secretariat';

  const mailOptions = {
    from: `"${fromName}" <${fromAddress}>`,
    to: abs.presentingAuthorEmail,
    subject: `[TNSCON 2027] Abstract Received — ${abs.submissionId}`,
    html
  };

  const result = await sendMailWithFallback(mailOptions);
  return { ...result, to: abs.presentingAuthorEmail };
};
