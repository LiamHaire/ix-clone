'use client';

import { NotchItem } from '@/components/ui/notch-item';
import type { AppointmentContext } from '@/lib/appointmentData';

interface PatientAppointmentItemProps {
  appointment: AppointmentContext;
  onView?: () => void;
}

export function PatientAppointmentItem({ appointment, onView }: PatientAppointmentItemProps) {
  const { patientNameDisplay, dateOfBirth, patientId, sex } = appointment;

  return (
    <NotchItem
      type="patient"
      bordered
      title={patientNameDisplay}
      description={`Born: ${dateOfBirth} · ${patientId} · ${sex}`}
      actions={[{ label: 'View', onClick: onView }]}
    />
  );
}
