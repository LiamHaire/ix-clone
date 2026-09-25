export interface AppointmentContext {
  patientName: string;
  patientNameDisplay: string;
  dateOfBirth: string;
  patientId: string;
  sex: string;
  minutesUntil: number;
  time: string;
  appointmentType: string;
  location: string;
  clinician: string;
  followUpText: string;
  suggestions: string[];
}

export const APPOINTMENT_POOL: AppointmentContext[] = [
  {
    patientName: 'Margaret Ellison',
    patientNameDisplay: 'ELLISON, Margaret (Ms)',
    dateOfBirth: '03 Sep 1951',
    patientId: '030951 8762',
    sex: 'Female',
    minutesUntil: 12,
    time: '10:15',
    appointmentType: 'GP Annual Review',
    location: 'Room 4, Main Surgery',
    clinician: 'Dr Helen Murray',
    followUpText: 'Mrs Ellison is attending for her annual review. She has a history of COPD, Type 2 Diabetes, and Hypertension. Her last HbA1c was borderline at 7.4% and a COPD exacerbation was managed in April. She has an outstanding medication review and a physiotherapy referral following a fall in September.',
    suggestions: [
      'View full patient summary for Margaret Ellison?',
      'Show outstanding tasks for this patient?',
      'Review current medications before the appointment?',
    ],
  },
  {
    patientName: 'James Whitmore',
    patientNameDisplay: 'WHITMORE, James (Mr)',
    dateOfBirth: '17 Mar 1968',
    patientId: 'PT-10002',
    sex: 'Male',
    minutesUntil: 28,
    time: '10:45',
    appointmentType: 'Chronic Disease Review',
    location: 'Room 2, Main Surgery',
    clinician: 'Dr Rebecca Collins',
    followUpText: 'Mr Whitmore is attending for a chronic disease review. He has a history of Hypertension and Type 2 Diabetes. His blood pressure has been well controlled on ramipril. A medication review was completed in September and no changes were made at that time.',
    suggestions: [
      'View full patient summary for James Whitmore?',
      'Check recent blood pressure readings?',
      'Review repeat prescription requests?',
    ],
  },
];

export function pickRandomAppointment(): AppointmentContext {
  const base = APPOINTMENT_POOL[0];
  const apptDate = new Date(Date.now() + 7 * 60 * 1000);
  const time = apptDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return { ...base, minutesUntil: 7, time };
}
