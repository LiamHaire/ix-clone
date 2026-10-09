'use client';

import { useState } from 'react';
import { Check } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UK_COUNTRIES = ['England', 'Northern Ireland', 'Scotland', 'Wales'];

export interface AddressValue {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

const empty: AddressValue = {
  line1: '', line2: '', city: '', county: '', postcode: '', country: 'England',
};

type Errors = Partial<Record<keyof AddressValue, string>>;

function validateField(field: keyof AddressValue, value: string): string | undefined {
  if (field === 'line1' && !value.trim()) return 'Address line 1 is required';
  if (field === 'city'  && !value.trim()) return 'Town or city is required';
  if (field === 'postcode' && !value.trim()) return 'Postcode is required';
  return undefined;
}

interface AddressBlockProps {
  defaultValue?: Partial<AddressValue>;
  onSubmit?: (value: AddressValue) => void | Promise<void>;
  submitLabel?: string;
  hideClear?: boolean;
  className?: string;
}

export function AddressBlock({
  defaultValue,
  onSubmit,
  submitLabel = 'Save',
  hideClear = false,
  className = '',
}: AddressBlockProps) {
  const [form, setForm]         = useState<AddressValue>({ ...empty, ...defaultValue });
  const [errors, setErrors]     = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function set(field: keyof AddressValue, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    // Clear error as soon as the user edits
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  }

  function handleBlur(field: keyof AddressValue) {
    const error = validateField(field, form[field]);
    if (error) setErrors(e => ({ ...e, [field]: error }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate all required fields on submit
    const next: Errors = {
      line1:    validateField('line1',    form.line1),
      city:     validateField('city',     form.city),
      postcode: validateField('postcode', form.postcode),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setSubmitting(true);
    try {
      await onSubmit?.(form);
    } finally {
      setSubmitting(false);
    }
  }

  function handleClear() {
    setForm({ ...empty, ...defaultValue });
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={`flex flex-col gap-4 ${className}`}>

      {/* Address line 1 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="addr-line1" className="text-[13px] font-medium">
          Address line 1
        </Label>
        <Input
          id="addr-line1"
          value={form.line1}
          onChange={e => set('line1', e.target.value)}
          onBlur={() => handleBlur('line1')}
          aria-invalid={!!errors.line1}
          aria-describedby={errors.line1 ? 'addr-line1-error' : undefined}
          className="h-9 text-[13px]"
        />
        {errors.line1 && (
          <p id="addr-line1-error" role="alert" className="text-[12px] text-destructive">{errors.line1}</p>
        )}
      </div>

      {/* Address line 2 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="addr-line2" className="text-[13px] font-medium">
          Address line 2 <span className="text-[12px] font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="addr-line2"
          value={form.line2}
          onChange={e => set('line2', e.target.value)}
          className="h-9 text-[13px]"
        />
      </div>

      {/* Town or city + County — related fields, placed side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="addr-city" className="text-[13px] font-medium">
            Town or city
          </Label>
          <Input
            id="addr-city"
            value={form.city}
            onChange={e => set('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'addr-city-error' : undefined}
            className="h-9 text-[13px]"
          />
          {errors.city && (
            <p id="addr-city-error" role="alert" className="text-[12px] text-destructive">{errors.city}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="addr-county" className="text-[13px] font-medium">
            County <span className="text-[12px] font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="addr-county"
            value={form.county}
            onChange={e => set('county', e.target.value)}
            className="h-9 text-[13px]"
          />
        </div>
      </div>

      {/* Postcode + Country — related fields, placed side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="addr-postcode" className="text-[13px] font-medium">
            Postcode
          </Label>
          <Input
            id="addr-postcode"
            placeholder="e.g. M1 1AE"
            value={form.postcode}
            onChange={e => set('postcode', e.target.value.toUpperCase())}
            onBlur={() => handleBlur('postcode')}
            aria-invalid={!!errors.postcode}
            aria-describedby={errors.postcode ? 'addr-postcode-error' : undefined}
            className="h-9 text-[13px] uppercase"
          />
          {errors.postcode && (
            <p id="addr-postcode-error" role="alert" className="text-[12px] text-destructive">{errors.postcode}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="addr-country" className="text-[13px] font-medium">Country</Label>
          <Select value={form.country} onValueChange={v => set('country', v)}>
            <SelectTrigger id="addr-country" className="data-[size=default]:h-9 w-full text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UK_COUNTRIES.map(c => (
                <SelectItem key={c} value={c} className="text-[13px]">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions — Clear (left) → Save (right) */}
      <div className="flex gap-2 pt-1 justify-start">
        {!hideClear && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-4 text-[13px] rounded-[8px]"
            onClick={handleClear}
            disabled={submitting}
          >
            Clear
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={submitting}
          className="h-9 px-4 text-[13px] rounded-[8px] bg-action hover:bg-action-hover text-action-foreground ml-auto"
        >
          <Check size={14} weight="bold" />
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>

    </form>
  );
}
