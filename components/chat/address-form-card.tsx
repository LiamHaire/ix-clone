'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AddressBlock, type AddressValue } from '@/components/blocks/address-block';

interface AddressFormCardProps {
  className?: string;
}

export function AddressFormCard({ className = '' }: AddressFormCardProps) {
  const [submitted, setSubmitted] = useState<AddressValue | null>(null);

  if (submitted) {
    return (
      <Card className={`w-full max-w-[560px] ${className}`}>
        <CardContent className="px-5 py-5 flex flex-col gap-1.5">
          <p className="text-[14px] font-semibold text-foreground">Address updated</p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {[submitted.line1, submitted.line2, submitted.city, submitted.county, submitted.postcode, submitted.country]
              .filter(Boolean).join(', ')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-[560px] ${className}`}>
      <CardHeader className="px-5 pt-5 pb-0">
        <CardTitle className="text-[14px] font-semibold text-foreground">Change address</CardTitle>
        <p className="text-[13px] text-muted-foreground mt-0.5">Update the registered address for this patient</p>
      </CardHeader>
      <Separator className="mt-4" />
      <CardContent className="px-5 pt-4 pb-5">
        <AddressBlock onSubmit={setSubmitted} />
      </CardContent>
    </Card>
  );
}
