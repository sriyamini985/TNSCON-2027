import XLSX from 'xlsx';

/**
 * Standard Conference Registration Excel Export
 */
export const exportToExcel = (registrations) => {
  const data = registrations.map(reg => {
    const fullName = `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim();
    return {
      'Registration ID': reg.registrationId,
      'Name': fullName,
      'Designation': reg.designation || 'Consultant',
      'Medical Council No': reg.medicalCouncilNo || 'N/A',
      'Institution / Hospital': reg.hospital,
      'Phone / Mobile': reg.mobile,
      'Email': reg.email,
      'Category': reg.category,
      'Registration Fee (INR)': reg.fee,
      'Transaction ID / UTR': reg.transactionId,
      'Payment Status': reg.paymentStatus,
      'Registration Status': reg.registrationStatus,
      'City': reg.city || '',
      'State': reg.state || '',
      'Verified At': reg.verifiedAt ? new Date(reg.verifiedAt).toLocaleString() : 'Pending',
      'Verified By': reg.verifiedBy || 'Pending',
      'Registered Date': new Date(reg.createdAt).toLocaleDateString('en-IN')
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'TNSCON_2027_Registrations');
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

/**
 * Standard CSV Export
 */
export const exportToCSV = (registrations) => {
  const data = registrations.map(reg => {
    const fullName = `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim();
    return {
      'Registration ID': reg.registrationId,
      'Name': fullName,
      'Phone': reg.mobile,
      'Email': reg.email,
      'Hospital': reg.hospital,
      'Category': reg.category,
      'Amount': reg.fee,
      'Transaction ID': reg.transactionId,
      'Payment Status': reg.paymentStatus,
      'Registration Status': reg.registrationStatus,
      'Registration Date': new Date(reg.createdAt).toLocaleDateString('en-IN')
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  return Buffer.from(csvContent, 'utf-8');
};

/**
 * Regxperts Compatible Spot Registration / Scan Roster Export
 * Matches the official Regxperts format (RegID, Name, Email, Phone, Category, KitbagCollected, FoodLogs)
 */
export const exportToRegxperts = (registrations) => {
  const data = registrations.map(reg => {
    const fullName = `${reg.title ? reg.title.toUpperCase() + ' ' : ''}${reg.firstName} ${reg.lastName || ''}`.trim().toUpperCase();
    return {
      'RegID': reg.registrationId,
      'Name': fullName,
      'Email': reg.email,
      'Phone': reg.mobile,
      'Category': reg.category,
      'KitbagCollected': reg.registrationStatus === 'Verified' ? 'NO' : 'HOLD',
      'FoodLogs': ''
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  return Buffer.from(csvContent, 'utf-8');
};

/**
 * Scientific Committee Abstract Export
 */
export const exportAbstractsToExcel = (abstracts) => {
  const data = abstracts.map(abs => ({
    'Submission ID': abs.submissionId,
    'Category': abs.category,
    'Specialty': abs.specialty,
    'Sub-Topic': abs.subTopic,
    'Title': abs.title,
    'Word Count': abs.wordCount,
    'Presenting Author': `${abs.presentingAuthorTitle || ''} ${abs.presentingAuthorName}`.trim(),
    'Designation': abs.presentingAuthorDesignation || '',
    'Institution': abs.presentingAuthorInstitution,
    'Email': abs.presentingAuthorEmail,
    'Phone': abs.presentingAuthorPhone,
    'Resident Presenter': abs.isResident ? 'Yes (Letter Attached)' : 'No',
    'Co-Authors': abs.coAuthors || '',
    'Status': abs.status,
    'Reviewer Notes': abs.reviewerNotes || '',
    'Submitted On': new Date(abs.createdAt).toLocaleString('en-IN')
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Abstract_Submissions');
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};
