import { jsPDF } from 'jspdf';
import { RegistrationFormData } from '../types/types';

export const generateRegistrationReceiptPDF = (data: {
  registrationId: string;
  formData: RegistrationFormData;
  submittedAt?: string;
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const logoBlue: [number, number, number] = [0, 51, 153];       // #003399 (Official TNSCON Logo Blue)
  const logoGold: [number, number, number] = [212, 155, 0];      // #D49B00 (Official TNSCON Logo Gold)
  const softBg: [number, number, number] = [250, 245, 237];      // #FAF5ED (Universal Warm Ivory)
  const textDark: [number, number, number] = [24, 34, 48];       // #182230 (Deep Charcoal)
  const mutedText: [number, number, number] = [85, 96, 112];     // #556070 (Muted Charcoal)

  // Top Official Logo Blue Header Banner
  doc.setFillColor(...logoBlue);
  doc.rect(0, 0, 210, 48, 'F');

  // Conference Gold Accent Bar
  doc.setFillColor(...logoGold);
  doc.rect(0, 48, 210, 3, 'F');

  // Header Typography
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('TNSCON 2027', 20, 20);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(250, 245, 237);
  doc.text('11th Annual Conference of Telangana Neurosciences Society', 20, 28);
  doc.text('12–14 March 2027 | Begumpet Airport, Hyderabad, Telangana', 20, 35);
  doc.setFontSize(9);
  doc.text('Official Website: www.tnscon2027hyd.com', 20, 42);

  // Status Badge on Top Right in Conference Gold
  doc.setFillColor(...logoGold);
  doc.roundedRect(138, 14, 52, 22, 2, 2, 'F');
  doc.setTextColor(...logoBlue);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PROVISIONAL RECEIPT', 142, 21);
  doc.setFontSize(10.5);
  doc.text(data.registrationId, 142, 30);

  // Document Title
  doc.setTextColor(...textDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('DELEGATE REGISTRATION ACKNOWLEDGEMENT', 20, 64);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...mutedText);
  const issuedDate = data.submittedAt 
    ? new Date(data.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.text(`Generated on: ${issuedDate}`, 20, 71);

  // Delegate Information Box
  doc.setFillColor(255, 253, 249);
  doc.setDrawColor(229, 220, 203);
  doc.roundedRect(20, 78, 170, 78, 3, 3, 'FD');

  doc.setTextColor(...logoBlue);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DELEGATE INFORMATION', 26, 88);

  const fullName = `${data.formData.title || ''} ${data.formData.firstName} ${data.formData.lastName || ''}`.trim();
  
  const fields = [
    { label: 'Full Name:', value: fullName },
    { label: 'Category & Speciality:', value: `${data.formData.category} — ${data.formData.speciality || 'Neurosurgery'}` },
    { label: 'Institution / Hospital:', value: data.formData.hospital },
    { label: 'Designation / Qualification:', value: `${data.formData.designation || 'Consultant'} ${data.formData.qualification ? '(' + data.formData.qualification + ')' : ''}` },
    { label: 'Medical Council Reg. No:', value: data.formData.medicalCouncilNo || 'Provided on File' },
    { label: 'Contact Mobile:', value: data.formData.mobile },
    { label: 'Registered Email:', value: data.formData.email },
    { label: 'City & State:', value: `${data.formData.city || ''}${data.formData.state ? ', ' + data.formData.state : ''}` }
  ];

  let yPos = 97;
  fields.forEach(field => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...mutedText);
    doc.text(field.label, 26, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    doc.text(field.value || 'N/A', 80, yPos);
    yPos += 7;
  });

  // Payment Details Box
  doc.setFillColor(...softBg);
  doc.setDrawColor(...logoGold);
  doc.roundedRect(20, 160, 170, 56, 3, 3, 'FD');

  doc.setTextColor(...logoBlue);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PAYMENT & TRANSACTION PARTICULARS', 26, 169);

  const baseFee = data.formData.baseFee || (data.formData.category === 'Resident' ? 4500 : data.formData.category === 'Accompanying Person' ? 4000 : 6500);
  const workshopFee = data.formData.includeWorkshop ? (data.formData.workshopFee || 6000) : 0;
  const subtotal = data.formData.subtotalFee || (baseFee + workshopFee);
  const gst = data.formData.gstFee || Math.round(subtotal * 0.18);
  const totalFee = data.formData.fee || (subtotal + gst);

  const paymentFields = [
    { label: 'Registration Category Fee:', value: `INR ${baseFee.toLocaleString('en-IN')}/-` },
    ...(data.formData.includeWorkshop ? [{ label: 'Pre-Conference Workshop:', value: `INR ${workshopFee.toLocaleString('en-IN')}/- (Hands-on Neurosurgery)` }] : []),
    { label: 'Subtotal (Excl. GST):', value: `INR ${subtotal.toLocaleString('en-IN')}/-` },
    { label: 'Goods & Services Tax (18%):', value: `INR ${gst.toLocaleString('en-IN')}/-` },
    { label: 'Total Amount Remitted:', value: `INR ${totalFee.toLocaleString('en-IN')}/-` },
    { label: 'Transaction Reference / UTR:', value: data.formData.transactionId },
    { label: 'Current Status:', value: 'Pending Accounts Bank Reconciliation' }
  ];

  let pyPos = 176;
  paymentFields.forEach(field => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(field.label === 'Current Status:' ? logoBlue[0] : mutedText[0], field.label === 'Current Status:' ? logoBlue[1] : mutedText[1], field.label === 'Current Status:' ? logoBlue[2] : mutedText[2]);
    doc.text(field.label, 26, pyPos);

    doc.setFont('helvetica', field.label === 'Current Status:' ? 'bold' : 'normal');
    if (field.label === 'Current Status:') {
      doc.setTextColor(212, 155, 0); // #D49B00 gold
    } else if (field.label === 'Total Amount Remitted:') {
      doc.setTextColor(...logoBlue);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(...textDark);
    }
    doc.text(field.value, 80, pyPos);
    pyPos += 5.8;
  });

  // Venue & Important Instructions
  doc.setTextColor(...logoBlue);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('IMPORTANT CONFERENCE INFORMATION', 20, 224);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  const instructions = [
    '• Venue: Conference Hall, Rajeev Gandhi Terminal, Begumpet Airport, Hyderabad, Telangana.',
    '• Dates: 12th to 14th March 2027. Reporting time 08:00 AM on Day 1 for registration kit collection.',
    '• Please present this provisional receipt along with government/institutional photo ID at the badge counter.',
    '• Presenting authors must submit verified final slides at the conference preview room on or before their assigned slot.',
    '• For queries or assistance, contact: secretariat@tnscon2027hyd.com | +91 40 2345 6789.'
  ];

  let iyPos = 230;
  instructions.forEach(inst => {
    doc.text(inst, 20, iyPos);
    iyPos += 5.5;
  });

  // Organizing Committee Sign-offs
  doc.setDrawColor(229, 220, 203);
  doc.line(20, 262, 190, 262);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...logoBlue);
  doc.text('Dr. R T S Naik', 30, 271);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedText);
  doc.text('Organizing Chairman, TNSCON 2027', 30, 276);
  doc.text('Consultant Neurosurgeon', 30, 280);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...logoBlue);
  doc.text('Dr. Chandrakanth Tapsi', 130, 271);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedText);
  doc.text('Organizing Secretary, TNSCON 2027', 130, 276);
  doc.text('Consultant Neurophysician', 130, 280);

  // Download PDF
  const filename = `TNSCON_2027_Receipt_${data.registrationId}.pdf`;
  doc.save(filename);
};
