import prisma from '../db.js';

export const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const generateSubmissionId = async () => {
  const highest = await prisma.abstractSubmission.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true }
  });
  let nextNum = 101 + (highest ? highest.id : 0);
  while (await prisma.abstractSubmission.findUnique({ where: { submissionId: `ABS-TNS27-${nextNum}` } })) {
    nextNum++;
  }
  return `ABS-TNS27-${nextNum}`;
};

export const createAbstractSubmission = async (data) => {
  const submissionId = await generateSubmissionId();
  const words = countWords(data.fullAbstractText);

  if (words > 250) {
    throw new Error(`Abstract exceeds the 250-word limit (current count: ${words} words).`);
  }

  return prisma.abstractSubmission.create({
    data: {
      submissionId,
      category: data.category,
      specialty: data.specialty,
      subTopic: data.subTopic,
      title: data.title.trim(),
      wordCount: words,
      presentingAuthorTitle: data.presentingAuthorTitle || 'Dr.',
      presentingAuthorName: data.presentingAuthorName.trim(),
      presentingAuthorEmail: data.presentingAuthorEmail.trim().toLowerCase(),
      presentingAuthorPhone: data.presentingAuthorPhone.trim(),
      presentingAuthorDesignation: data.presentingAuthorDesignation || 'Resident / Fellow',
      presentingAuthorInstitution: data.presentingAuthorInstitution.trim(),
      isResident: Boolean(data.isResident),
      coAuthors: data.coAuthors || '',
      introduction: data.introduction || '',
      methods: data.methods || '',
      results: data.results || '',
      conclusion: data.conclusion || '',
      fullAbstractText: data.fullAbstractText.trim(),
      docFilePath: data.docFilePath || null,
      docOriginalName: data.docOriginalName || null,
      bonafideFilePath: data.bonafideFilePath || null,
      status: 'Submitted'
    }
  });
};
