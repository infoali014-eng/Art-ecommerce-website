'use client';

import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score, label: '', color: 'bg-primary/10' };

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const finalScore = pass.length < 8 ? Math.min(score, 1) : Math.max(1, score - 1);

    let label = 'Weak';
    let color = 'bg-red-500';

    if (finalScore === 2) {
      label = 'Fair';
      color = 'bg-amber-500';
    } else if (finalScore === 3) {
      label = 'Good';
      color = 'bg-emerald-500/70';
    } else if (finalScore === 4) {
      label = 'Strong';
      color = 'bg-emerald-600';
    }

    return { score: finalScore, label, color };
  };

  const { score, label, color } = getStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-1.5 pt-1.5 font-sans">
      <div className="flex justify-between items-center text-[10px] text-secondary font-medium uppercase tracking-wider">
        <span>Security Rating</span>
        <span className="font-semibold text-primary">{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-1 h-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full transition-all duration-300 ${
              step <= score ? color : 'bg-primary/5'
            }`}
          />
        ))}
      </div>
      <ul className="text-[9px] text-secondary/70 space-y-0.5 mt-1 list-disc pl-3 leading-relaxed font-light">
        <li className={password.length >= 8 ? 'text-emerald-600' : ''}>Minimum 8 characters</li>
        <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-emerald-600' : ''}>
          Uppercase & Lowercase letters
        </li>
        <li className={/[0-9]/.test(password) ? 'text-emerald-600' : ''}>At least one number</li>
        <li className={/[^A-Za-z0-9]/.test(password) ? 'text-emerald-600' : ''}>
          Special character (e.g., @, $, !, %)
        </li>
      </ul>
    </div>
  );
};
export default PasswordStrength;
