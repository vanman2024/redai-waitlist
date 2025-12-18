'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

export function PhoneInput({ value, onChange, ...props }: PhoneInputProps) {
  const formatPhoneNumber = (input: string): string => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, '');

    // Limit to 11 digits (1 for country code + 10 for number)
    const limited = numbers.slice(0, 11);

    // Format based on length
    if (limited.length === 0) return '';

    // If starts with 1 (North America)
    if (limited.startsWith('1')) {
      if (limited.length <= 1) return '+1';
      if (limited.length <= 4) return `+1 (${limited.slice(1)}`;
      if (limited.length <= 7) return `+1 (${limited.slice(1, 4)}) ${limited.slice(4)}`;
      return `+1 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7, 11)}`;
    }

    // If doesn't start with 1, assume North America and add +1
    if (limited.length <= 3) return `+1 (${limited}`;
    if (limited.length <= 6) return `+1 (${limited.slice(0, 3)}) ${limited.slice(3)}`;
    return `+1 (${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <Input
      {...props}
      type="tel"
      value={value}
      onChange={handleChange}
      placeholder="+1 (555) 123-4567"
    />
  );
}
