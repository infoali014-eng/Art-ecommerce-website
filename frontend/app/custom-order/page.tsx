'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { AlertCircle, Calendar, Check, DollarSign, Trash2, Upload } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import { Button } from '@/components/ui/Button';
import { useCommission } from '@/context/CommissionContext';
import { useAuth } from '@/hooks/useAuth';

export default function CustomOrderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    draft,
    step,
    uploadedImages,
    isUploading,
    isSubmitting,
    validationErrors,
    hasLoadedDraft,
    setStep,
    updateDraft,
    uploadImages,
    removeImage,
    validateStep,
    submitCommissionRequest,
    resetDraft,
  } = useCommission();

  const [agreeToTimeline, setAgreeToTimeline] = useState(false);

  const artworkTypes = [
    {
      value: 'Painting',
      label: 'Painting',
      desc: 'Custom oils, acrylics, or mixed media on canvas.',
    },
    {
      value: 'Calligraphy',
      label: 'Calligraphy',
      desc: 'Sumi ink, classical script, or modern typography.',
    },
    { value: 'Sketch', label: 'Sketch', desc: 'Graphite, charcoal, or pastel works.' },
    {
      value: 'Digital Art',
      label: 'Digital Art',
      desc: 'High-resolution digital illustrations and designs.',
    },
    {
      value: 'Islamic Art',
      label: 'Islamic Art',
      desc: 'Bespoke geometric designs and illumination.',
    },
    { value: 'Portrait', label: 'Portrait', desc: 'Bespoke hand-drawn or painted portraits.' },
    {
      value: 'Landscape',
      label: 'Landscape',
      desc: 'Custom nature, horizon, or cityscape scenes.',
    },
    { value: 'Other', label: 'Other', desc: 'Unique requests, sculptures, or mixed mediums.' },
  ];

  const preferredStyles = [
    'Minimalist',
    'Modern',
    'Luxury',
    'Vintage',
    'Islamic',
    'Ottoman',
    'Watercolor',
    'Oil Painting',
    'Pencil',
    'Hyperrealistic',
    'Abstract',
  ];

  const artworkPurposes = [
    'Home Decoration',
    'Office',
    'Gift',
    'Wedding',
    'Anniversary',
    'Memorial',
    'Mosque',
    'Business',
  ];

  const colorPalettes = [
    'Gold',
    'Black',
    'White',
    'Deep Blue',
    'Emerald Green',
    'Ruby Red',
    'Bronze',
    'Silver',
    'Charcoal',
    'Earth Tones',
  ];

  const orientations = [
    { value: 'portrait', label: 'Portrait (Vertical)' },
    { value: 'landscape', label: 'Landscape (Horizontal)' },
    { value: 'square', label: 'Square (1:1)' },
  ];

  const frameOptions = [
    { value: 'none', label: 'Unframed / Canvas Wrap' },
    { value: 'black', label: 'Classic Black Gallery Wood' },
    { value: 'walnut', label: 'Premium American Walnut' },
    { value: 'gold', label: 'Bespoke Gold Leaf Frame' },
    { value: 'white', label: 'Minimalist Matte White Frame' },
  ];

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleTypeSelect = (type: string) => {
    updateDraft({ artworkType: type });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadImages(e.target.files);
    }
  };

  const handleColorToggle = (color: string) => {
    const currentColors = draft.preferredColors || [];
    const nextColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    updateDraft({ preferredColors: nextColors });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitCommissionRequest(agreeToTimeline);
    if (success) {
      router.push('/profile/commissions');
    }
  };

  if (!hasLoadedDraft) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center font-sans text-xs text-secondary">
          Initializing Commission Workspace...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24 font-sans">
        <Section padding="lg">
          <Container>
            <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-4 text-center">
              AURA CURATION INQUIRY
            </span>
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light text-center tracking-wide mb-12 text-primary">
              Bespoke Art Commission
            </h1>
            <div className="w-12 h-[1px] bg-accent mx-auto mb-12" />

            {!user ? (
              <div className="max-w-md mx-auto text-center border border-primary/5 p-12 bg-white space-y-6">
                <AlertCircle className="w-12 h-12 text-accent/60 mx-auto stroke-[1.2]" />
                <div className="space-y-2">
                  <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide">
                    Authentication Required
                  </h3>
                  <p className="text-xs text-secondary font-light leading-relaxed">
                    To start a custom commission draft, upload reference materials, and receive
                    curate quotes, you must create a collector account or sign in.
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-3">
                  <Button variant="primary" fullWidth onClick={() => router.push('/login')}>
                    Sign In to Account
                  </Button>
                  <Button variant="outline" fullWidth onClick={() => router.push('/register')}>
                    Create Collector Account
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-12">
                {/* Steps Bar */}
                <div className="flex justify-between items-center relative max-w-lg mx-auto">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="flex flex-col items-center relative z-10">
                      <div
                        onClick={() => s < step && setStep(s)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                          s === step
                            ? 'bg-accent text-white shadow-xs'
                            : s < step
                              ? 'bg-primary text-white cursor-pointer'
                              : 'bg-[#FAF7F2] border border-primary/10 text-secondary'
                        }`}
                      >
                        {s < step ? <Check className="w-3.5 h-3.5" /> : s}
                      </div>
                      <span className="text-[9px] uppercase tracking-wider mt-2 font-medium text-secondary/60">
                        {s === 1 && 'Type'}
                        {s === 2 && 'Images'}
                        {s === 3 && 'Details'}
                        {s === 4 && 'Specs'}
                        {s === 5 && 'Confirm'}
                      </span>
                    </div>
                  ))}
                  <div className="absolute top-4 left-0 right-0 h-[1px] bg-primary/5 -z-0" />
                </div>

                {/* Wizard Panel */}
                <div className="bg-white border border-primary/5 p-8 shadow-xs">
                  {/* Step 1: Artwork Type Selection */}
                  {step === 1 && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide">
                          Select Artwork Type (Art ki Type choose karein)
                        </h3>
                        <p className="text-xs text-secondary font-light mt-1">
                          Select what kind of art you want us to create for you. (Aap kis tarah ka
                          art banwana chahte hain?)
                        </p>
                      </div>

                      {validationErrors.artworkType && (
                        <div className="text-red-700 bg-red-50 p-3 text-xs border border-red-100 font-sans">
                          {validationErrors.artworkType}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {artworkTypes.map((type) => (
                          <div
                            key={type.value}
                            onClick={() => handleTypeSelect(type.value)}
                            className={`p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                              draft.artworkType === type.value
                                ? 'border-accent bg-[#FAF7F2]/50'
                                : 'border-primary/10 hover:border-accent/40 bg-white'
                            }`}
                          >
                            <span className="font-cormorant text-xl font-light text-primary block mb-2">
                              {type.label}
                            </span>
                            <span className="text-xs text-secondary font-light leading-relaxed">
                              {type.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Reference Images */}
                  {step === 2 && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide">
                          Reference & Ideas (Sample ya reference pictures)
                        </h3>
                        <p className="text-xs text-secondary font-light mt-1">
                          Upload pictures of designs, wall spaces, or ideas you like. You can upload
                          up to 10 photos. (Sample designs ya deewar ki pictures yahan upload
                          karein)
                        </p>
                      </div>

                      {/* Dropzone */}
                      <label className="border border-dashed border-primary/20 bg-[#FAF7F2]/30 p-12 text-center flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-[#FAF7F2]/60 transition-colors duration-300">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <Upload className="w-8 h-8 text-accent/60 stroke-[1.2]" />
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-primary block">
                            {isUploading
                              ? 'Uploading reference files...'
                              : 'Select or drag files here'}
                          </span>
                          <span className="text-[10px] text-secondary font-light block">
                            Supported: PNG, JPEG, WEBP files up to 10MB
                          </span>
                        </div>
                      </label>

                      {/* Preview Grid */}
                      {uploadedImages.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-[10px] uppercase tracking-wider text-secondary font-semibold">
                            Uploaded Reference Files ({uploadedImages.length}/10)
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {uploadedImages.map((url, idx) => (
                              <div
                                key={idx}
                                className="relative aspect-square border border-primary/5 bg-[#FAF7F2] overflow-hidden group"
                              >
                                <img
                                  src={url}
                                  alt={`Upload ${idx}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(url)}
                                  className="absolute top-1 right-1 bg-white/90 hover:bg-red-500 hover:text-white p-1 rounded-full shadow-sm text-secondary transition-colors duration-300 opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Requirements */}
                  {step === 3 && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide">
                          Artwork Details (Art ki details)
                        </h3>
                        <p className="text-xs text-secondary font-light mt-1">
                          Tell us about your budget, timeline, and design choices. (Apne budget aur
                          design details likhein)
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                        {/* Title */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Request Title (Order ka Name)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Arabic Calligraphy for Foyer Wall"
                            value={draft.title || ''}
                            onChange={(e) => updateDraft({ title: e.target.value })}
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary"
                          />
                          {validationErrors.title && (
                            <span className="text-red-700 text-[10px] block mt-1">
                              {validationErrors.title}
                            </span>
                          )}
                        </div>

                        {/* Customer Budget */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Your Budget in USD (Aapka Budget - $) / Rupees equivalent
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-secondary/60 text-xs">
                              <DollarSign className="w-3.5 h-3.5" />
                            </span>
                            <input
                              type="number"
                              required
                              min="1"
                              placeholder="500"
                              value={draft.customerBudget || ''}
                              onChange={(e) =>
                                updateDraft({ customerBudget: Number(e.target.value) })
                              }
                              className="w-full bg-background border border-primary/10 pl-8 pr-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary"
                            />
                          </div>
                          {validationErrors.customerBudget && (
                            <span className="text-red-700 text-[10px] block mt-1">
                              {validationErrors.customerBudget}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                              Describe what you want (Kaisa design chahiye, detail likhein)
                            </label>
                            <span className="text-[9px] text-secondary/60">
                              {(draft.description || '').length}/1000 characters
                            </span>
                          </div>
                          <textarea
                            rows={4}
                            required
                            placeholder="Please provide details about your subject, desired composition, elements to focus on, etc."
                            value={draft.description || ''}
                            onChange={(e) =>
                              updateDraft({ description: e.target.value.slice(0, 1000) })
                            }
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary resize-none"
                          />
                          {validationErrors.description && (
                            <span className="text-red-700 text-[10px] block mt-1">
                              {validationErrors.description}
                            </span>
                          )}
                        </div>

                        {/* Special Instructions */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Special Instructions (Khas cheez likhwani ho, like Ayah number or
                            signatures - Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Please include Ayah 55:60 in Gold leaf, or Sign the back only"
                            value={draft.specialInstructions || ''}
                            onChange={(e) => updateDraft({ specialInstructions: e.target.value })}
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary"
                          />
                        </div>

                        {/* Target Deadline */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Deliver By / Deadline (Kab tak delivery chahiye)
                          </label>
                          <input
                            type="date"
                            required
                            value={draft.deadline ? draft.deadline.split('T')[0] : ''}
                            onChange={(e) =>
                              updateDraft({ deadline: new Date(e.target.value).toISOString() })
                            }
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary"
                          />
                          {validationErrors.deadline && (
                            <span className="text-red-700 text-[10px] block mt-1">
                              {validationErrors.deadline}
                            </span>
                          )}
                        </div>

                        {/* Preferred Style */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Preferred Style
                          </label>
                          <select
                            value={draft.preferredStyle || ''}
                            onChange={(e) => updateDraft({ preferredStyle: e.target.value })}
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary h-8"
                          >
                            <option value="">Choose Style Preference</option>
                            {preferredStyles.map((style) => (
                              <option key={style} value={style}>
                                {style}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Artwork Purpose */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Artwork Purpose
                          </label>
                          <select
                            value={draft.artworkPurpose || ''}
                            onChange={(e) => updateDraft({ artworkPurpose: e.target.value })}
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary h-8"
                          >
                            <option value="">Choose Purpose</option>
                            {artworkPurposes.map((purpose) => (
                              <option key={purpose} value={purpose}>
                                {purpose}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Preferred Colors */}
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Color Palette Preferences
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {colorPalettes.map((color) => {
                              const selected = (draft.preferredColors || []).includes(color);
                              return (
                                <button
                                  type="button"
                                  key={color}
                                  onClick={() => handleColorToggle(color)}
                                  className={`px-3 py-2 border text-center transition-colors duration-300 ${
                                    selected
                                      ? 'border-accent bg-accent text-white'
                                      : 'border-primary/10 hover:border-accent/40 bg-white text-secondary'
                                  }`}
                                >
                                  {color}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Specifications */}
                  {step === 4 && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide">
                          Artwork Size & Frame (Size aur Frame details)
                        </h3>
                        <p className="text-xs text-secondary font-light mt-1">
                          Please specify sizes in inches and frame options. (Size aur frame ki
                          settings select karein)
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                        {/* Width */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Width in inches (Chorhaye)
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="24"
                            value={draft.width || ''}
                            onChange={(e) => updateDraft({ width: Number(e.target.value) })}
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary"
                          />
                          {validationErrors.width && (
                            <span className="text-red-700 text-[10px] block mt-1">
                              {validationErrors.width}
                            </span>
                          )}
                        </div>

                        {/* Height */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Height in inches (Lambaye)
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="36"
                            value={draft.height || ''}
                            onChange={(e) => updateDraft({ height: Number(e.target.value) })}
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary"
                          />
                          {validationErrors.height && (
                            <span className="text-red-700 text-[10px] block mt-1">
                              {validationErrors.height}
                            </span>
                          )}
                        </div>

                        {/* Orientation */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Orientation (Khara ya Leta hua - Portrait/Landscape)
                          </label>
                          <select
                            value={draft.orientation || ''}
                            onChange={(e) => updateDraft({ orientation: e.target.value })}
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary h-8"
                          >
                            <option value="">Select Orientation</option>
                            {orientations.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                          {validationErrors.orientation && (
                            <span className="text-red-700 text-[10px] block mt-1">
                              {validationErrors.orientation}
                            </span>
                          )}
                        </div>

                        {/* Framing Preference */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Framing Style (Frame kaisa chahiye)
                          </label>
                          <select
                            value={draft.frameOption || ''}
                            onChange={(e) => updateDraft({ frameOption: e.target.value })}
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary h-8"
                          >
                            <option value="">Select Framing Preference</option>
                            {frameOptions.map((f) => (
                              <option key={f.value} value={f.value}>
                                {f.label}
                              </option>
                            ))}
                          </select>
                          {validationErrors.frameOption && (
                            <span className="text-red-700 text-[10px] block mt-1">
                              {validationErrors.frameOption}
                            </span>
                          )}
                        </div>

                        {/* Specific Medium */}
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                            Specific Medium (Kaunse materials use ho, e.g. Canvas, Paper etc.)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Oil on Linen Canvas, 24k Gold Leaf on tea-washed script paper"
                            value={draft.medium || ''}
                            onChange={(e) => updateDraft({ medium: e.target.value })}
                            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary"
                          />
                          {validationErrors.medium && (
                            <span className="text-red-700 text-[10px] block mt-1">
                              {validationErrors.medium}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Review & Submit */}
                  {step === 5 && (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div>
                        <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide">
                          Review Commission Inquiry
                        </h3>
                        <p className="text-xs text-secondary font-light mt-1">
                          Please verify your entries before submitting to our curation panel.
                        </p>
                      </div>

                      {/* Display Info Summary */}
                      <div className="border border-primary/5 bg-[#FAF7F2]/30 p-6 space-y-6 text-xs text-secondary">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-primary block">
                                Category
                              </span>
                              <span className="font-light">{draft.artworkType}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-primary block">
                                Title
                              </span>
                              <span className="font-light">{draft.title}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-primary block">
                                Description
                              </span>
                              <p className="font-light leading-relaxed">{draft.description}</p>
                            </div>
                            {draft.specialInstructions && (
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-primary block">
                                  Special Instructions
                                </span>
                                <span className="font-light">{draft.specialInstructions}</span>
                              </div>
                            )}
                          </div>

                          {/* Right Column */}
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-primary block">
                                  Target Budget
                                </span>
                                <span className="font-light text-accent">
                                  ${draft.customerBudget}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-primary block">
                                  Target Curation
                                </span>
                                <span className="font-light">
                                  {draft.deadline
                                    ? new Date(draft.deadline).toLocaleDateString()
                                    : 'N/A'}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-primary block">
                                  Dimensions
                                </span>
                                <span className="font-light">
                                  {draft.width} x {draft.height} inches
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-primary block">
                                  Orientation
                                </span>
                                <span className="font-light uppercase">{draft.orientation}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-primary block">
                                  Framing Style
                                </span>
                                <span className="font-light">{draft.frameOption}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-primary block">
                                  Medium
                                </span>
                                <span className="font-light">{draft.medium}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-primary block">
                                  Preferred Style
                                </span>
                                <span className="font-light">{draft.preferredStyle || 'None'}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-primary block">
                                  Purpose
                                </span>
                                <span className="font-light">{draft.artworkPurpose || 'None'}</span>
                              </div>
                            </div>
                            {draft.preferredColors && draft.preferredColors.length > 0 && (
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-primary block">
                                  Color Preferences
                                </span>
                                <span className="font-light">
                                  {draft.preferredColors.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Reference Images list */}
                        {uploadedImages.length > 0 && (
                          <div className="border-t border-primary/5 pt-6 space-y-2">
                            <span className="text-[10px] uppercase font-semibold text-primary block">
                              Reference Attachments
                            </span>
                            <div className="flex flex-wrap gap-3">
                              {uploadedImages.map((url, idx) => (
                                <div
                                  key={idx}
                                  className="w-12 h-12 border border-primary/5 rounded-xs overflow-hidden"
                                >
                                  <img
                                    src={url}
                                    alt="thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Timelines Curation Terms */}
                      <div className="flex gap-3 text-xs text-secondary/80 bg-accent/5 border border-accent/10 p-4 font-sans leading-relaxed">
                        <Calendar className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-primary block mb-0.5">
                            Curation Timeline Terms
                          </span>
                          Our curation board will review your requirements, details, and reference
                          attachments. A tailored pricing quote, assigned artist details, and
                          structural proposal timeline will be sent to your account profile within
                          48 hours.
                        </div>
                      </div>

                      {/* Agreement */}
                      <label className="flex items-center gap-3 cursor-pointer text-xs text-primary font-medium select-none">
                        <input
                          type="checkbox"
                          required
                          checked={agreeToTimeline}
                          onChange={(e) => setAgreeToTimeline(e.target.checked)}
                          className="w-4 h-4 accent-accent rounded-xs border-primary/20 focus:outline-none"
                        />
                        <span>
                          I agree to the curation review terms and estimated timeline of AURA.
                        </span>
                      </label>

                      {/* Submit btn */}
                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isSubmitting || !agreeToTimeline}
                          className="w-full md:w-auto md:px-12"
                        >
                          {isSubmitting ? 'Submitting Inquiry...' : 'Submit Curation Inquiry'}
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Wizard Footer Controls */}
                  {step < 5 && (
                    <div className="flex justify-between items-center pt-8 border-t border-primary/5 mt-8">
                      <div>
                        {step > 1 && (
                          <Button variant="outline" size="sm" onClick={handleBack}>
                            Back Step
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={resetDraft}>
                          Reset Draft
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleNext}>
                          Next Step
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}
