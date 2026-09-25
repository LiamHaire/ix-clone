// Synthetic longitudinal patient dataset — for prototype use only.
// All records are fictional and must never be interpreted as real patient information.

export type ActivityEventType = 'viewed' | 'work-item' | 'filed' | 'appointment' | 'task';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  actor: { initials: string; color: string };
  datetime: string;
  meta?: { label: string; value: string };
}

export interface Patient {
  id: string;
  demographics: {
    name: string;
    displayName: string;
    age: number;
    sex: string;
    dateOfBirth: string;
    height: string;
    weight: string;
    bmi: string;
    occupation?: string;
    maritalStatus?: string;
    smokingStatus: string;
    smokingHistory?: string;
    alcohol: string;
    exercise?: string;
    livingSituation?: string;
    mobility?: string;
    nhsRegion?: string;
    patientId: string;
    patientIdType?: 'CHI' | 'NHS';
    allergies: string;
  };
  lifestyleAndRiskFactors: Record<string, string>;
  problemsDiagnoses: Array<{
    condition: string;
    status: string;
    diagnosed: string;
    priority?: 1 | 2 | 3;
    notes?: string;
    reviewedBy?: string;
    reviewedDate?: string;
  }>;
  allergies: Array<{
    substance: string;
    reaction: string;
    type?: string;
    recordedDate?: string;
    severity?: string;
    status?: string;
    recordedBy?: string;
    drugForm?: string;
    strength?: string;
    source?: string;
  }>;
  currentMedications: Array<{
    name: string;
    dose: string;
    frequency: string;
    prescriber: string;
    prescribedDate: string;
    prescriptionType?: string;
    drugForm?: string;
    strength?: string;
  }>;
  encounters: Array<{
    date: string;
    time: string;
    clinician: string;
    location?: string;
    type: string;
    observations?: Record<string, string | number>;
    presentingComplaint?: string;
    summaryNotes: string;
    diagnosis?: string[];
    outcome: string[];
    treatmentPlan: string[];
    source?: string;
  }>;
  observations: {
    bloodPressure?: Array<{ date: string; value: string }>;
    weight?: Array<{ date: string; value: string }>;
  };
  metricHistory?: Record<string, Array<{ date: string; value: string }>>;
  lifestyleMetrics?: Array<{
    label: string;
    value: string;
    unit: string;
    date: string;
    trend: 'up' | 'down' | 'neutral';
  }>;
  lifestyleEntries?: {
    occupation?: { date: string; term: string; value: string };
    smoking?: { date: string; term: string; status: string; consumption?: string };
    alcohol?: { date: string; term: string; consumption: string };
    exercise?: { date: string; term: string; type: string };
    contraception?: { date: string; term: string; iucdFitted?: string };
    diet?: { date: string; term: string; habit: string; type?: string };
    residence?: { date: string; term: string; type: string };
  };
  examinationEntries?: {
    weight?: { date: string; term: string; value: string; bmi?: string };
    bloodPressure?: { date: string; term: string; systolic: string; diastolic: string };
    waistCircumference?: { date: string; systolic: string; diastolic: string };
    pulse?: { date: string; term: string; value: string };
    oxygenSaturation?: { date: string; term: string; value: string; unit: string };
    temperature?: { date: string; term: string; value: string; unit: string; qualifier?: string };
  };
  investigations: Array<{
    test: string;
    result: string;
    flag?: string;
    date?: string;
    category?: string;
    requestGroup?: string;
    requestContext?: string;
    source?: string;
  }>;
  carePlans?: Array<{ area: string; plan: string }>;
  recentActivityFeed?: ActivityEvent[];
  aiSummary: {
    complexity: 'Low' | 'Moderate' | 'High';
    risk: 'Low' | 'Moderate' | 'High';
    keyThemes: string[];
    recentActivity: string;
    longitudinalSummary: string;
    sections: Array<{ heading: string; bullets: string[] }>;
  };
  patientTracker?: {
    outstandingTasks: number;
    openReferrals: number;
    medicationReviewsDue: number;
    nextAppointment: string | null;
    lastAppointment: string | null;
  };
  specialNotes?: Array<{
    id: string;
    category: string;
    note: string;
    recordedDate: string;
    recordedBy: string;
    source?: string;
  }>;
  immunisations?: Array<{
    vaccine: string;
    date: string;
    dose?: string;
    site?: string;
    batchNumber?: string;
    administeredBy: string;
    source?: string;
  }>;
  problems?: Array<{
    groupTitle: string;
    source?: string;
    items: Array<{
      condition: string;
      status: string;
      onset: string;
      notes?: string;
      source?: string;
    }>;
  }>;
  outboundReferrals?: Array<{
    id: string;
    referralDate: string;
    referredTo: string;
    specialty: string;
    reason: string;
    status: string;
    urgency: string;
    referredBy: string;
    source?: string;
  }>;
}

// ─── PT-10002: Margaret Ellison — High Complexity ────────────────────────────

export const PATIENT_ELLISON: Patient = {
  id: 'PT-10002',
  demographics: {
    name: 'Margaret Ellison',
    displayName: 'ELLISON, Margaret (Ms)',
    age: 74,
    sex: 'Female',
    dateOfBirth: '03 Sep 1951',
    height: '159 cm',
    weight: '71 kg',
    bmi: '28.1',
    smokingStatus: 'Ex-smoker',
    smokingHistory: '40 pack-year history',
    alcohol: 'Rare',
    livingSituation: 'Lives alone',
    mobility: 'Uses walking stick',
    patientId: '030951 8762',
    patientIdType: 'CHI',
    allergies: 'Penicillin — Rash',
  },
  lifestyleAndRiskFactors: {
    'Falls Risk': 'Moderate',
    Diet: 'Poor appetite during COPD flare-ups',
    'Social Isolation': 'Reports loneliness',
    'Cognitive Screening': 'Mild short-term memory concerns',
    'Exercise Tolerance': 'Breathless after short distances',
  },
  problemsDiagnoses: [
    { condition: 'COPD', status: 'Active', diagnosed: '2016', priority: 1, notes: 'Moderate severity (MRC Grade 3). Recent exacerbation requiring hospital admission Feb 2025. On maximum inhaled therapy. Pulmonology review recommended.', reviewedBy: 'Dr Helen Murray', reviewedDate: '11 Feb 2025' },
    { condition: 'Chronic Kidney Disease Stage 2', status: 'Active', diagnosed: '2022', priority: 1, notes: 'eGFR stable at 68 ml/min. Requires 6-monthly renal function monitoring given concurrent ramipril and metformin use. Nephrology involvement not yet required.', reviewedBy: 'Dr Helen Murray', reviewedDate: '11 Feb 2025' },
    { condition: 'Type 2 Diabetes', status: 'Active', diagnosed: '2018', priority: 1, notes: 'HbA1c 58 mmol/mol at last check — borderline controlled. Annual diabetic review overdue. Metformin dose at maximum tolerated. Consider SGLT2 inhibitor given CKD and cardiovascular risk profile.', reviewedBy: 'Dr Helen Murray', reviewedDate: '11 Feb 2025' },
    { condition: 'Hypertension', status: 'Active', diagnosed: '2012', priority: 2, notes: 'BP well controlled on ramipril 10mg. Last reading 132/78 mmHg.' },
    { condition: 'Osteoarthritis', status: 'Active', diagnosed: '2014', priority: 2, notes: 'Primarily affecting knees and hips. Managed with paracetamol PRN. Physio referral considered.' },
  ],
  allergies: [
    { substance: 'Penicillin', reaction: 'Rash', type: 'Drug', recordedDate: '14 Feb 2024', severity: 'Mild', status: 'Active', recordedBy: 'Dr Amelia Foster', drugForm: 'Tablet', strength: '500 mg' },
  ],
  currentMedications: [
    { name: 'Salbutamol Inhaler', dose: '100 mcg', frequency: 'PRN', prescriber: 'Dr Helen Murray', prescribedDate: '11 Feb 2025', prescriptionType: 'Repeat', drugForm: 'Inhaler', strength: '100 mcg/actuation' },
    { name: 'Tiotropium', dose: '18 mcg', frequency: 'Daily', prescriber: 'Dr Helen Murray', prescribedDate: '11 Feb 2025', prescriptionType: 'Repeat', drugForm: 'Inhaler (capsule)', strength: '18 mcg' },
    { name: 'Ramipril', dose: '5 mg', frequency: 'Daily', prescriber: 'Dr Rebecca Collins', prescribedDate: '01 Sep 2025', prescriptionType: 'Repeat', drugForm: 'Capsule', strength: '5 mg' },
    { name: 'Metformin', dose: '500 mg', frequency: 'Twice daily', prescriber: 'Dr Helen Murray', prescribedDate: '14 Jun 2025', prescriptionType: 'Repeat', drugForm: 'Tablet', strength: '500 mg' },
    { name: 'Atorvastatin', dose: '20 mg', frequency: 'Nightly', prescriber: 'Dr Marcus Allen', prescribedDate: '26 Apr 2025', prescriptionType: 'Repeat', drugForm: 'Tablet', strength: '20 mg' },
    { name: 'Paracetamol', dose: '1 g', frequency: 'PRN', prescriber: 'Dr Rebecca Collins', prescribedDate: '01 Sep 2025', prescriptionType: 'Acute', drugForm: 'Tablet', strength: '500 mg' },
  ],
  encounters: [
    {
      date: '11 Feb 2025', time: '10:00', clinician: 'Dr Helen Murray', location: 'In practice',
      type: 'GP Annual COPD Review',
      observations: { BP: '142/86', SpO2: '93%', Weight: '73 kg' },
      summaryNotes: 'Patient attended annual COPD review reporting worsening breathlessness on exertion over previous six months. Increasing difficulty walking longer distances and climbing stairs. Intermittent productive cough without haemoptysis. Appetite reduced during recent flare periods. Respiratory examination demonstrated reduced air entry bilaterally with scattered expiratory wheeze. Spirometry consistent with moderate obstructive disease progression.',
      diagnosis: ['COPD — moderate, progressive'],
      outcome: ['COPD symptoms progressing gradually', 'Functional exercise tolerance reduced', 'Pulmonary rehabilitation referral initiated'],
      treatmentPlan: ['Continue tiotropium and salbutamol inhalers', 'Pulmonary rehabilitation referral', 'Safety-net advice regarding exacerbation symptoms'],
    },
    {
      date: '26 Apr 2025', time: '02:15', clinician: 'Dr Marcus Allen', location: 'Emergency department',
      type: 'A&E Admission',
      observations: { Presentation: 'Acute COPD exacerbation', CXR: 'No pneumonia', 'Length of Stay': '3 days' },
      summaryNotes: 'Patient admitted via emergency department following worsening shortness of breath, productive cough, and wheeze over five days. Oxygen saturations reduced on presentation with increased work of breathing. Chest X-ray excluded focal pneumonia. Treated with nebulised bronchodilators, oral steroids, and antibiotics with gradual symptomatic improvement over admission.',
      diagnosis: ['Acute exacerbation of COPD'],
      outcome: ['Acute COPD exacerbation managed successfully', 'No invasive respiratory support required', 'Discharged following clinical stabilisation'],
      treatmentPlan: ['Complete oral steroid course', 'Community respiratory follow-up arranged', 'Continue inhaler regimen', 'Return precautions discussed thoroughly'],
    },
    {
      date: '14 Jun 2025', time: '14:30', clinician: 'Dr Helen Murray', location: 'In practice',
      type: 'GP Diabetes Review',
      observations: { HbA1c: '7.4%' },
      summaryNotes: 'Routine diabetic monitoring appointment. Patient reports variable appetite and reduced activity levels since recent respiratory admission. Mild numbness affecting left foot reported intermittently over previous months. Foot examination demonstrated mildly reduced sensation over plantar surface of left forefoot. No ulceration or skin breakdown identified.',
      diagnosis: ['Type 2 diabetes mellitus — suboptimal control', 'Suspected early diabetic peripheral neuropathy'],
      outcome: ['Diabetes control moderately suboptimal', 'Early peripheral neuropathic changes suspected', 'No acute diabetic complications identified'],
      treatmentPlan: ['Continue metformin therapy', 'Dietary review referral arranged', 'Reinforce diabetic foot care education', 'Repeat HbA1c monitoring in 3–4 months'],
    },
    {
      date: '01 Sep 2025', time: '15:20', clinician: 'Dr Rebecca Collins', location: 'Home visit',
      type: 'GP Falls Assessment',
      summaryNotes: 'Patient reviewed following fall at home while mobilising between kitchen and hallway. Sustained minor bruising to left wrist without fracture symptoms. Reports increasing unsteadiness and reduced confidence mobilising outdoors over previous several months. Mobility assessment demonstrated poor balance and lower limb deconditioning. No syncope or acute neurological symptoms reported.',
      diagnosis: ['Mechanical fall — frailty and lower limb deconditioning', 'Increased falls risk'],
      outcome: ['Mechanical fall likely related to frailty and deconditioning', 'Increased falls risk identified', 'Community support escalation recommended'],
      treatmentPlan: ['Physiotherapy referral arranged', 'Home safety assessment requested', 'Encourage supervised mobility exercises', 'Falls prevention advice discussed'],
    },
  ],
  observations: {
    bloodPressure: [
      { date: 'Jan 2025', value: '146/88' },
      { date: 'Feb 2025', value: '142/86' },
      { date: 'Jun 2025', value: '138/82' },
      { date: 'Sep 2025', value: '150/90' },
    ],
    weight: [
      { date: 'Jan 2025', value: '74 kg' },
      { date: 'Apr 2025', value: '71 kg' },
      { date: 'Sep 2025', value: '70 kg' },
    ],
  },
  lifestyleEntries: {
    occupation: { date: '11 Feb 2025', term: 'Occupation',          value: 'Retired' },
    smoking:    { date: '11 Feb 2025', term: 'Smoking status',      status: 'Ex-smoker', consumption: '40 pack-year history' },
    alcohol:    { date: '11 Feb 2025', term: 'Alcohol consumption', consumption: 'Rare' },
    diet:       { date: '11 Feb 2025', term: 'Diet',                habit: 'Poor appetite during COPD flare-ups', type: 'Reduced oral intake' },
    residence:  { date: '11 Feb 2025', term: 'Residence',           type: 'Lives alone' },
  },
  examinationEntries: {
    weight:           { date: '01 Sep 2025', term: 'Weight',            value: '70 kg', bmi: '28.1 kg/m²' },
    bloodPressure:    { date: '01 Sep 2025', term: 'Blood pressure',    systolic: '150', diastolic: '90' },
    pulse:            { date: '01 Sep 2025', term: 'Pulse',             value: '88 bpm' },
    oxygenSaturation: { date: '11 Feb 2025', term: 'Oxygen saturation', value: '93', unit: '%' },
  },
  lifestyleMetrics: [
    { label: 'Weight',           value: '70',    unit: 'kg',    date: '01 Sep 2025', trend: 'down'    },
    { label: 'Height',           value: '159',   unit: 'cm',    date: '11 Feb 2025', trend: 'neutral' },
    { label: 'BMI',              value: '28.1',  unit: 'kg/m²', date: '11 Feb 2025', trend: 'down'    },
    { label: 'BP',               value: '150/90',unit: 'mmHg',  date: '01 Sep 2025', trend: 'up'      },
    { label: 'Pulse',            value: '88',    unit: 'bpm',   date: '01 Sep 2025', trend: 'up'      },
    { label: 'SpO₂',             value: '93',    unit: '%',     date: '11 Feb 2025', trend: 'down'    },
    { label: 'Respiratory rate', value: '22',    unit: 'brpm',  date: '11 Feb 2025', trend: 'up'      },
    { label: 'Peak flow',        value: '210',   unit: 'L/min', date: '11 Feb 2025', trend: 'down'    },
    { label: 'Postural drop',    value: '18/10', unit: 'mmHg',  date: '01 Sep 2025', trend: 'neutral' },
    { label: 'Smoking status',   value: 'Ex-smoker', unit: '', date: '11 Feb 2025', trend: 'neutral' },
    { label: 'Alcohol',          value: 'Rare',  unit: '',      date: '11 Feb 2025', trend: 'neutral' },
  ],
  metricHistory: {
    'BP':               [{ date: 'Jan 2026', value: '148/90' }, { date: 'Feb 2026', value: '152/92' }, { date: 'Mar 2026', value: '144/88' }, { date: 'Apr 2026', value: '146/86' }, { date: 'May 2026', value: '150/90' }, { date: 'Jun 2026', value: '150/90' }],
    'Weight':           [{ date: 'Jan 2026', value: '70' }, { date: 'Feb 2026', value: '69' }, { date: 'Mar 2026', value: '69' }, { date: 'Apr 2026', value: '68' }, { date: 'May 2026', value: '68' }, { date: 'Jun 2026', value: '68' }],
    'BMI':              [{ date: 'Jan 2026', value: '27.7' }, { date: 'Feb 2026', value: '27.3' }, { date: 'Mar 2026', value: '27.3' }, { date: 'Apr 2026', value: '26.9' }, { date: 'May 2026', value: '26.9' }, { date: 'Jun 2026', value: '26.9' }],
    'Pulse':            [{ date: 'Jan 2026', value: '90' }, { date: 'Feb 2026', value: '86' }, { date: 'Mar 2026', value: '88' }, { date: 'Apr 2026', value: '84' }, { date: 'May 2026', value: '87' }, { date: 'Jun 2026', value: '88' }],
    'SpO₂':             [{ date: 'Jan 2026', value: '93' }, { date: 'Feb 2026', value: '92' }, { date: 'Mar 2026', value: '94' }, { date: 'Apr 2026', value: '93' }, { date: 'May 2026', value: '91' }, { date: 'Jun 2026', value: '93' }],
    'Peak flow':        [{ date: 'Jan 2026', value: '215' }, { date: 'Feb 2026', value: '205' }, { date: 'Mar 2026', value: '220' }, { date: 'Apr 2026', value: '210' }, { date: 'May 2026', value: '200' }, { date: 'Jun 2026', value: '210' }],
    'Respiratory rate': [{ date: 'Jan 2026', value: '21' }, { date: 'Feb 2026', value: '23' }, { date: 'Mar 2026', value: '20' }, { date: 'Apr 2026', value: '22' }, { date: 'May 2026', value: '24' }, { date: 'Jun 2026', value: '22' }],
  },
  investigations: [
    { test: 'FBC',               result: 'Normal',                               flag: 'Normal',          date: '11 Feb 2025', category: 'Blood',       requestGroup: '11 Feb 2025', requestContext: 'Annual COPD Review — Bloods' },
    { test: 'U&Es',              result: 'Na 140, K 4.3, Cr 98 µmol/L',         flag: 'Normal',          date: '11 Feb 2025', category: 'Blood',       requestGroup: '11 Feb 2025', requestContext: 'Annual COPD Review — Bloods' },
    { test: 'ECG',               result: 'Sinus rhythm',                         flag: 'Normal',          date: '11 Feb 2025', category: 'Imaging',     requestGroup: '11 Feb 2025', requestContext: 'Annual COPD Review — Bloods' },
    { test: 'Spirometry',        result: 'FEV1/FVC 0.58 — moderate obstruction', flag: 'Abnormal',        date: '11 Feb 2025', category: 'Respiratory', requestGroup: '11 Feb 2025', requestContext: 'Annual COPD Review — Bloods' },
    { test: 'CRP',               result: 'Mildly elevated',                      flag: 'Abnormal',        date: '26 Apr 2025', category: 'Blood',       requestGroup: '26 Apr 2025', requestContext: 'A&E Admission — Bloods' },
    { test: 'FBC',               result: 'WBC 11.2 — mildly raised',             flag: 'Abnormal',        date: '26 Apr 2025', category: 'Blood',       requestGroup: '26 Apr 2025', requestContext: 'A&E Admission — Bloods' },
    { test: 'Chest X-ray',       result: 'Hyperinflation consistent with COPD',  flag: 'Abnormal',        date: '26 Apr 2025', category: 'Imaging',     requestGroup: '26 Apr 2025', requestContext: 'A&E Admission — Bloods' },
    { test: 'HbA1c',             result: '7.4%',                                 flag: 'Borderline high', date: '14 Jun 2025', category: 'Blood',       requestGroup: '14 Jun 2025', requestContext: 'Diabetes Review — Bloods' },
    { test: 'Total cholesterol', result: '5.1 mmol/L',                           flag: 'Borderline high', date: '14 Jun 2025', category: 'Blood',       requestGroup: '14 Jun 2025', requestContext: 'Diabetes Review — Bloods' },
    { test: 'eGFR',              result: '68 mL/min/1.73m²',                     flag: 'Normal',          date: '14 Jun 2025', category: 'Blood',       requestGroup: '14 Jun 2025', requestContext: 'Diabetes Review — Bloods' },
    { test: 'Urine dipstick',    result: 'Trace protein',                        flag: 'Abnormal',        date: '14 Jun 2025', category: 'Urine',       requestGroup: '14 Jun 2025', requestContext: 'Diabetes Review — Bloods' },
    { test: 'Urine ACR',         result: '3.2 mg/mmol',                          flag: 'Normal',          date: '14 Jun 2025', category: 'Urine',       requestGroup: '14 Jun 2025', requestContext: 'Diabetes Review — Bloods' },
  ],
  carePlans: [
    { area: 'Respiratory',    plan: 'Pulmonary rehabilitation referral' },
    { area: 'Falls Prevention', plan: 'Home safety assessment' },
    { area: 'Diabetes',       plan: 'Dietary intervention and repeat HbA1c' },
    { area: 'Social',         plan: 'Community wellbeing referral' },
  ],
  recentActivityFeed: [
    { id: 'e1', type: 'viewed',      actor: { initials: 'RC', color: '#B24E45' }, datetime: '01 Sep 2025, 15:20' },
    { id: 'e2', type: 'work-item',   actor: { initials: 'RC', color: '#B24E45' }, datetime: '01 Sep 2025, 15:22', meta: { label: 'Work item', value: 'Physiotherapy Referral' } },
    { id: 'e3', type: 'filed',       actor: { initials: 'HM', color: '#5E7F5C' }, datetime: '14 Jun 2025, 14:35', meta: { label: 'Filed to', value: 'Diabetes Review' } },
    { id: 'e4', type: 'filed',       actor: { initials: 'MA', color: '#724E91' }, datetime: '26 Apr 2025, 02:20', meta: { label: 'Filed to', value: 'COPD Exacerbation' } },
    { id: 'e5', type: 'appointment', actor: { initials: 'HM', color: '#5E7F5C' }, datetime: '11 Feb 2025, 10:00', meta: { label: 'Appointment', value: 'Annual COPD Review' } },
  ],
  aiSummary: {
    complexity: 'High',
    risk: 'Moderate',
    keyThemes: [
      'COPD, hypertension, type 2 diabetes, osteoarthritis, and CKD Stage 2',
      'Progressive respiratory decline with recent hospital admission',
      'Increasing falls risk and lower limb deconditioning',
      'Moderate frailty indicators with rising healthcare dependency',
    ],
    recentActivity: 'Over the past year the patient has required four clinical contacts relating to respiratory symptoms, diabetes monitoring, and functional decline. A COPD exacerbation resulted in a three-day hospital admission requiring nebuliser therapy, steroids, and antibiotics. Follow-up assessments demonstrate persistent breathlessness, suboptimal glycaemic control with early peripheral sensory changes, and a mechanical fall at home indicating progressive deconditioning.',
    longitudinalSummary: 'The clinical record reflects progressive multi-morbidity with increasing frailty indicators and rising healthcare dependency. Respiratory disease remains the dominant driver of clinical risk, with ongoing focus on exacerbation prevention, falls reduction, rehabilitation support, and optimisation of long-term condition management.',
    sections: [
      {
        heading: 'Medical History',
        bullets: [
          'COPD — moderate severity, progressive with recent acute exacerbation (April 2025)',
          'Type 2 Diabetes — suboptimal glycaemic control (HbA1c 7.4%), early peripheral neuropathy suspected',
          'Hypertension — well controlled on ramipril',
          'CKD Stage 2 — eGFR stable at 68 ml/min, 6-monthly monitoring required',
          'Osteoarthritis — knees and hips, managed conservatively',
        ],
      },
      {
        heading: 'Medications',
        bullets: [
          'Salbutamol 100 mcg inhaler PRN',
          'Tiotropium 18 mcg inhaler daily',
          'Ramipril 5 mg daily',
          'Metformin 500 mg twice daily',
          'Atorvastatin 20 mg nightly',
          'Paracetamol 1 g PRN',
        ],
      },
      {
        heading: 'Clinical Summary',
        bullets: [
          'Four clinical contacts in the past year covering respiratory, diabetes, and falls assessment',
          'COPD exacerbation managed with three-day hospital admission in April 2025',
          'Suboptimal diabetes control with early neuropathic changes — medication review outstanding',
          'Mechanical fall in September 2025; physiotherapy and home safety assessment arranged',
          'Management focused on exacerbation prevention, falls reduction, and long-term condition optimisation',
        ],
      },
    ],
  },
  patientTracker: {
    outstandingTasks: 3,
    openReferrals: 2,
    medicationReviewsDue: 1,
    nextAppointment: '22 Oct 2025',
    lastAppointment: '01 Sep 2025',
  },
};

export const ACTIVE_PATIENT = PATIENT_ELLISON;
