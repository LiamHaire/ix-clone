'use client';

import { UserCircle, ArrowRight } from '@phosphor-icons/react';
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import type { AppointmentContext } from '@/lib/appointmentData';

interface PatientAppointmentItemProps {
  appointment: AppointmentContext;
  onView?: () => void;
}

export function PatientAppointmentItem({ appointment, onView }: PatientAppointmentItemProps) {
  const { patientNameDisplay, dateOfBirth, patientId, sex, appointmentType, time, location } = appointment;

  return (
    <Item variant="outline">
      <ItemMedia variant="icon" className="self-center">
        <div className="flex size-8 items-center justify-center rounded-[10px] border border-border">
          <UserCircle size={16} className="text-muted-foreground" />
        </div>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{patientNameDisplay}</ItemTitle>
        <ItemDescription>
          {`Born: ${dateOfBirth} · ${patientId} · ${sex}`}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm" className="rounded-[10px] h-8 px-4 text-[13px] gap-1.5" onClick={onView}>
          View <ArrowRight size={13} />
        </Button>
      </ItemActions>
    </Item>
  );
}
