/**
 * TNSCON 2027 — Conference Content & Source of Truth
 * 11th Annual Conference of Telangana Neurosciences Society
 * 12–14 March 2027 | Begumpet Airport, Hyderabad
 *
 * NOTE: Placeholders that require final confirmation from the Secretariat
 * are explicitly marked with `// TODO:` comments below.
 */

export interface NavLinkItem {
  label: string;
  path: string;
}

export interface StatItem {
  value: string;
  label: string;
  description: string;
  isPlaceholder?: boolean;
}

export interface FocusAreaItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: 'Brain' | 'Activity' | 'Layers' | 'Sparkles';
  highlights: string[];
}

export interface TimelineDateItem {
  date: string;
  isoDate?: string;
  title: string;
  description: string;
  status: 'Open' | 'Confirmed' | 'Upcoming' | 'Placeholder';
  isImportant?: boolean;
}

export const siteContent = {
  conference: {
    name: 'TNSCON 2027',
    fullName: '11th Annual Conference of Telangana Neurosciences Society',
    edition: '11th Annual Conference',
    society: 'Telangana Neurosciences Society',
    dates: '12–14 March 2027',
    startDateISO: '2027-03-12T09:00:00+05:30', // Asia/Kolkata timezone (09:00 AM IST)
    endDateISO: '2027-03-14T18:00:00+05:30',
    location: 'Hyderabad, Telangana',
    venue: 'Conference Hall, Rajiv Gandhi Terminal, Begumpet Airport, Hyderabad',
    venueShort: 'Rajiv Gandhi Terminal, Begumpet Airport',
    officialDomain: 'tnscon2027hyd.com',
    societyWebsite: 'https://www.telangananeuro.com/',
    tagline: 'The Neural Atlas — Mapping the Future of Neuroscience',
    heroDescription:
      "Three days of scientific sessions, live neurosurgery discussions, and hands-on workshops bringing together India's leading neurologists, neurosurgeons and researchers.",
    abstractUrgency: 'Abstract submissions close 31 January 2027',
  },

  // 6 Navbar Links (Committee replaces Speakers)
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Committee', path: '/committee' },
    { label: 'Registration', path: '/registration' },
    { label: 'Venue', path: '/venue' },
    { label: 'Contact', path: '/contact' },
  ] as NavLinkItem[],

  // Primary Navbar CTA
  navbarCta: {
    label: 'Submit Abstract',
    path: '/abstract-submission',
  },

  // Hero Floating Stat Chips (clean pill badges on visual side)
  heroChips: [
    {
      label: '3 Days',
      detail: 'Intensive Didactic Curriculum',
    },
    {
      // TODO: Replace with confirmed national & international faculty count when finalized by Scientific Committee
      label: 'Expert Faculty',
      detail: 'Neurosurgery & Neurology Leaders',
    },
    {
      // TODO: Replace with finalized workshop titles when confirmed
      label: 'Live Workshops',
      detail: 'Surgical & Electrodiagnostic Modules',
    },
  ],

  // Section B: Highlight Strip (4 Stats on white row with dividers)
  statsStrip: [
    {
      value: '3',
      label: 'Conference Days',
      description: '12–14 March 2027 at Begumpet Airport',
      isPlaceholder: false,
    },
    {
      // TODO: Replace placeholder '24+' with exact scientific session count once program schedule is locked
      value: '24+',
      label: 'Scientific Sessions',
      description: 'Plenaries, award papers & symposiums',
      isPlaceholder: true,
    },
    {
      // TODO: Replace placeholder '12+' with confirmed hands-on workshop count
      value: '12+',
      label: 'Live Workshops',
      description: 'Skull base, endoscopy & stroke simulation',
      isPlaceholder: true,
    },
    {
      // TODO: Replace placeholder '60+' with confirmed faculty speaker count
      value: '60+',
      label: 'Expert Faculty',
      description: 'Leading clinicians from across India',
      isPlaceholder: true,
    },
  ] as StatItem[],

  // Section C: Scientific Focus Areas (4-card grid)
  focusAreas: [
    {
      id: 'skull-base',
      title: 'Skull Base & Cranial Corridors',
      subtitle: 'Microsurgical & Endoscopic Frontiers',
      description:
        'Advanced operative masterclasses focusing on endoscopic endonasal access, transorbital corridors, vestibular schwannoma resections, and complex anterior and posterior skull base vascular lesions.',
      iconName: 'Brain',
      highlights: ['Operative Video Masterclasses', 'Endoscopic Transnasal Approaches', 'Microvascular Decompressions'],
    },
    {
      id: 'stroke',
      title: 'Hyperacute Stroke Interventions',
      subtitle: 'Time-Critical Revascularization',
      description:
        'State-of-the-art updates on tenecteplase therapeutic windows, modern aspiration versus stent-retriever mechanical thrombectomy trials, telestroke network protocols, and neuro-intensive care.',
      iconName: 'Activity',
      highlights: ['Mechanical Thrombectomy Windows', 'Telestroke Regional Hubs', 'Hemorrhagic Stroke Management'],
    },
    {
      id: 'spine',
      title: 'Complex Spine & MIS Stabilization',
      subtitle: 'Biomechanical Precision & Corridors',
      description:
        'Biomechanics of craniovertebral junction re-alignment, robotic-assisted pedicle screw placement, minimally invasive tubular lumbar decompressions, and intraoperative neuromonitoring standards.',
      iconName: 'Layers',
      highlights: ['CVJ Realignment & Instrumentation', 'MIS Tubular Corridor Surgery', 'Intraoperative Neuromonitoring'],
    },
    {
      id: 'epilepsy',
      title: 'Refractory Epilepsy & Neuromodulation',
      subtitle: 'Mapping & Therapeutics',
      description:
        'Multi-modality presurgical epileptogenic zone localization, Stereo-EEG (SEEG) robotic implantation trajectories, vagus nerve stimulation (VNS), and curative resective surgical outcomes.',
      iconName: 'Sparkles',
      highlights: ['Stereo-EEG Implantation Planning', 'Responsive Neurostimulation (RNS)', 'Pediatric Epilepsy Surgery'],
    },
  ] as FocusAreaItem[],

  // Section D: Important Dates Timeline
  importantDates: [
    {
      // TODO: Confirm exact portal launch date with Secretariat if different from 05 Nov 2026
      date: '05 Nov 2026',
      title: 'Abstract Submission Opens',
      description: 'Call for Award Papers, Free Oral Papers, and E-Posters portal opens online.',
      status: 'Open',
      isImportant: false,
    },
    {
      date: '31 Jan 2027',
      title: 'Abstract Submission Deadline',
      description: 'Strict 250-word cut-off for peer-review scoring by Scientific Committee.',
      status: 'Confirmed',
      isImportant: true,
    },
    {
      date: '15 Jan 2027',
      title: 'Early-Bird Registration Closes',
      description: 'Preferential tariff deadline: Delegate ₹5,940, Resident ₹4,125, Accompany Person ₹3,520.',
      status: 'Open',
      isImportant: true,
    },
    {
      date: '25 Feb 2027',
      title: 'Regular Registration Closes',
      description: 'Regular tariff cut-off before on-site spot registration commences.',
      status: 'Upcoming',
      isImportant: false,
    },
    {
      date: '12–14 Mar 2027',
      title: 'TNSCON 2027 Conference',
      description: 'Three days of neuroscience conclave at Conference Hall, Begumpet Airport, Hyderabad.',
      status: 'Confirmed',
      isImportant: true,
    },
  ] as TimelineDateItem[],

  // Section E: Call-to-Action Banner
  ctaBanner: {
    heading: 'Be Part of TNSCON 2027',
    subheading:
      'Join India’s foremost neurosurgeons, neurologists, fellows, and clinical researchers in Hyderabad for three days of rigorous academic dialogue and surgical innovation.',
    primaryButton: {
      label: 'Register as Delegate',
      path: '/registration',
    },
    secondaryButton: {
      label: 'Submit Abstract',
      path: '/abstract-submission',
    },
  },

  // Section F: Footer Details
  footer: {
    societyBlurb:
      'The Telangana Neurosciences Society is dedicated to academic prestige, surgical mastery, advanced neurological care, and scientific collaboration across India.',
    leadership: {
      organizingChairman: 'Dr. R T S Naik',
      organizingSecretary: 'Dr. Chandrakanth Tapsi',
      scientificNeurosurgery: 'Dr. N Pratap Kumar',
      scientificNeurology: 'Dr. Subbaiah Choudary',
    },
    venueDetails: {
      hall: 'Conference Hall, Rajiv Gandhi Terminal',
      location: 'Begumpet Airport, Hyderabad – 500016, Telangana, India',
    },
    secretariat: {
      title: 'SECRETARIAT',
      subtitle: 'CORRESPONDING ADDRESS',
      contactPerson: 'Dr. Chandrakanth Tapsi',
      organization: 'Telangana Neurosciences Society',
      addressLine1: '# 3-4-1, 3rd Floor, SKS Neuro, Chapel Road',
      addressLine2: 'Hyderabad, Telangana – 500001, India',
      phone: '+91-94927 59745',
      email: 'secretariat@tnscon2027hyd.com',
    },
    conferenceManager: {
      title: 'CONFERENCE MANAGER',
      companyName: 'CMC - CONFERENCE MANAGEMENT COMPANY',
      contactPerson: 'Mr. Kiran Kumar Lella',
      role: 'Conference Manager',
      phone: '+91-96765 41985',
      phoneRaw: '+919676541985',
      email: 'kiran@cmchyd.com',
      logoUrl: '/assets/images/cmc_logo.png',
    },
    contactEmail: 'secretariat@tnscon2027hyd.com',
    domain: 'tnscon2027hyd.com',
    copyright: '© 2027 Telangana Neurosciences Society. All rights reserved.',
  },

  // Organizing Committee Hierarchy (Source of truth: Official TNS Letterhead & Reference Structure)
  organizingCommittee: {
    // Starting Core Organizing Committee Members (with Photo Holder)
    coreLeadership: [
      {
        name: 'Dr. R.T.S. Naik',
        role: 'Organising Chairman',
        designation: '',
        societyRole: 'President',
        initials: 'RN',
        specialty: '',
        department: '',
        bio: 'Senior academic clinician with decades of operative leadership in complex surgical corridors and postgraduate mentorship across Telangana.',
        photo: '/assets/images/committee/dr_rts_naik.png',
        photoPlaceholder: false,
      },
      {
        name: 'Dr. Chandrakanth Tapsi',
        role: 'Organising Secretary',
        designation: '',
        societyRole: 'Treasurer',
        initials: 'CT',
        specialty: '',
        department: '',
        bio: 'Consultant clinician leading acute care pathways, scientific coordination, and organizational excellence for the 11th Annual State Conference.',
        photo: '/assets/images/committee/dr_chandrakanth_tapsi.jpg',
        photoPlaceholder: false,
      },
      {
        name: 'Dr. G. Venu Gopal',
        role: 'Joint Organising Secretary',
        designation: '',
        societyRole: 'Joint Organising Secretary',
        initials: 'VG',
        specialty: '',
        department: 'Organising Secretariat',
        bio: 'Joint Organising Secretary coordinating conference operations, academic scheduling, venue logistics, and delegate facilitation for TNSCON 2027.',
        photo: '/assets/images/committee/dr_g_venugopal.jpg',
        photoPlaceholder: false,
      },
      {
        name: 'Dr. T.V. Ramakrishna Murthy',
        role: 'Scientific Chair',
        designation: '',
        societyRole: 'Scientific Committee Chair',
        initials: 'RM',
        specialty: '',
        department: '',
        bio: 'Leading the scientific curriculum, operative masterclass selection, research papers, and academic peer review for TNSCON 2027.',
        photo: '/assets/images/committee/dr_tv_ramakrishna_murthy.png',
        photoPlaceholder: false,
      },
      {
        name: 'Dr. G. Subbaiah Choudary',
        role: 'Scientific Chair',
        designation: '',
        societyRole: 'Scientific Committee Chair',
        initials: 'SC',
        specialty: '',
        department: '',
        bio: 'Overseeing didactic symposia, clinical intervention masterclasses, academic evaluations, and award paper colloquia.',
        photo: '/assets/images/committee/dr_g_subbaiah_choudary.png',
        photoPlaceholder: false,
      },
    ],

    // Patrons & Founder Members (from official letterhead)
    founderMembers: [
      { name: 'Prof. D. Raja Reddy', designation: 'Founder Member' },
      { name: 'Prof. K. Satyanarayana', designation: 'Founder Member', photo: '/assets/images/committee/prof_k_satyanarayana.jpg' },
      { name: 'Prof. P. Dhairyawan', designation: 'Founder Member', photo: '/assets/images/committee/prof_p_dhairyawan.jpg' },
      { name: 'Prof. P. Govardhan Reddy', designation: 'Founder Member', photo: '/assets/images/committee/prof_p_govardhan_reddy.png' },
      { name: 'Prof. G. Prakash Rao', designation: 'Founder Member', photo: '/assets/images/committee/dr_g_prakash_rao.png' },
    ],

    // Advisors & Immediate Past Leadership (from official letterhead)
    advisors: [
      { name: 'Dr. G. Satyanarayana', designation: 'Immediate Past President', photo: '/assets/images/committee/dr_g_sathyanarayana.jpg' },
      { name: 'Dr. M.K. Singh', designation: 'Advisor', photo: '/assets/images/committee/dr_mk_singh.jpg' },
      { name: 'Dr. Alok Ranjan', designation: 'Advisor', photo: '/assets/images/committee/dr_alok_ranjan.jpg' },
    ],

    // Executive Office Bearers (from official letterhead)
    officeBearers: [
      { name: 'Dr. Srikanth Jawalkar', role: 'Vice President', photo: '/assets/images/committee/dr_srikanth_jawalkar.jpg' },
      { name: 'Dr. C. Rajesh Reddy', role: 'Joint Secretary', photo: '/assets/images/committee/dr_c_rajesh_reddy.jpg' },
      { name: 'Prof. M. Vijaya Saradhi', role: 'Ex-Officio Member', photo: '/assets/images/committee/dr_vijaya_saradhi.png' },
      { name: 'Dr. T.V. Ramakrishna Murthy', role: 'Ex-Officio Member', photo: '/assets/images/committee/dr_tv_ramakrishna_murthy.png' },
      { name: 'Prof. G. Sree Ranga Lakshmi', role: 'Ex-Officio Member' },
    ],

    // Executive Council Members (from official letterhead)
    executiveMembers: [
      { name: 'Dr. N. Veena', designation: 'Executive Member' },
      { name: 'Dr. G. Venugopal', designation: 'Executive Member', photo: '/assets/images/committee/dr_g_venugopal.jpg' },
      { name: 'Dr. Sanjay Thumati', designation: 'Executive Member', photo: '/assets/images/committee/dr_t_sanjay.png' },
      { name: 'Dr. P.V.K. Kishore', designation: 'Executive Member', photo: '/assets/images/committee/dr_pvk_kishore.jpg' },
      { name: 'Dr. Dasari Srinivas', designation: 'Executive Member', photo: '/assets/images/committee/dr_dasari_srinivas.jpg' },
      { name: 'Dr. P. Ranjith', designation: 'Executive Member', photo: '/assets/images/committee/dr_p_ranjith.jpg' },
      { name: 'Dr. G. Rajashekar Reddy', designation: 'Executive Member', photo: '/assets/images/committee/dr_g_rajashekar_reddy.jpg' },
      { name: 'Prof. M. Vijaya Saradhi', designation: 'Ex-Officio Member', photo: '/assets/images/committee/dr_vijaya_saradhi.png' },
    ],

    // Conference Working Sub-Committees (modeled after reference page structure)
    subCommittees: [
      {
        committeeName: 'Scientific Committee',
        chairpersons: ['Dr. N. Pratap Kumar', 'Dr. G.V. Subbaiah Choudary'],
        coChairpersons: ['Prof. M. Vijaya Saradhi', 'Dr. Sanjay Thumati'],
        members: ['Dr. Dasari Srinivas', 'Dr. N. Veena'],
      },
      {
        committeeName: 'Venue & Audiovisual Management',
        chairpersons: ['Dr. Srikanth Jawalkar', 'Dr. C. Rajesh Reddy'],
        coChairpersons: ['Dr. P. Ranjith'],
        members: ['Dr. G. Rajashekar Reddy', 'Dr. P.V.K. Kishore'],
      },
      {
        committeeName: 'Registration & Delegate Credentials',
        chairpersons: ['Dr. Chandrakanth Tapsi', 'Dr. N. Veena'],
        coChairpersons: ['Dr. G. Venugopal'],
        members: ['Dr. P.V.K. Kishore', 'Dr. Sanjay Thumati'],
      },
      {
        committeeName: 'Trade, Exhibition & Industry Relations',
        chairpersons: ['Dr. T.V. Ramakrishna Murthy', 'Prof. G. Sree Ranga Lakshmi'],
        coChairpersons: ['Dr. Alok Ranjan'],
        members: ['Dr. M.K. Singh', 'Dr. G. Satyanarayana'],
      },
    ],
  },
};
