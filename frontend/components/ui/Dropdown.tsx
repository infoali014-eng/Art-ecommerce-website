'use client';

import React, { useEffect, useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select option',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div ref={dropdownRef} className={`relative w-full font-sans ${className}`}>
      {label && (
        <label className="block text-[10px] uppercase tracking-wider text-secondary mb-1.5 font-medium">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-primary/10 px-4 py-3 text-sm flex items-center justify-between focus:outline-none focus:border-accent transition-colors duration-300 text-left cursor-pointer"
      >
        <span className={selectedOption ? 'text-primary' : 'text-secondary'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-primary/10 shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-background transition-colors duration-200 cursor-pointer ${
                option.value === selectedValue
                  ? 'bg-background text-accent font-medium'
                  : 'text-primary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
