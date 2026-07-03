'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { CommissionService } from '@/services/commission.service';
import { CommissionUploadService } from '@/services/commissionUpload.service';

import { CommissionDraft, CommissionStatus } from '@/types';

interface CommissionContextType {
  draft: CommissionDraft;
  step: number;
  uploadedImages: string[];
  isUploading: boolean;
  isSubmitting: boolean;
  validationErrors: Record<string, string>;
  hasLoadedDraft: boolean;
  setStep: (step: number) => void;
  updateDraft: (fields: Partial<CommissionDraft>) => void;
  uploadImages: (files: FileList) => Promise<void>;
  removeImage: (url: string) => Promise<void>;
  validateStep: (stepNumber: number) => boolean;
  submitCommissionRequest: (agreeToTimeline: boolean) => Promise<boolean>;
  resetDraft: () => Promise<void>;
}

const CommissionContext = createContext<CommissionContextType | undefined>(undefined);

export function CommissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [step, setStepState] = useState<number>(1);
  const [draft, setDraft] = useState<CommissionDraft>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasLoadedDraft, setHasLoadedDraft] = useState<boolean>(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const draftRef = useRef<CommissionDraft>(draft);
  const userRef = useRef<ReturnType<typeof useAuth>['user']>(user);

  // Helper helper to resolve values
  const dbCommValue = <T,>(dbVal: T | null | undefined, localVal: T): T => {
    if (dbVal !== undefined && dbVal !== null && dbVal !== ('' as unknown as T)) return dbVal;
    return localVal;
  };

  // Maintain refs to avoid dependency loop in auto-save effect
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Set step state and update localStorage
  const setStep = (nextStep: number) => {
    setStepState(nextStep);
    localStorage.setItem('aura_commission_step', String(nextStep));
  };

  // Load draft on mount / user change
  useEffect(() => {
    const loadDraft = async () => {
      let localDraft: CommissionDraft = {};
      const savedLocal = localStorage.getItem('aura_commission_draft');
      const savedStep = localStorage.getItem('aura_commission_step');
      const savedImages = localStorage.getItem('aura_commission_images');

      if (savedLocal) {
        try {
          localDraft = JSON.parse(savedLocal);
        } catch (e) {
          console.error('Error parsing local draft:', e);
        }
      }

      if (savedStep) {
        setStepState(Number(savedStep));
      }

      if (savedImages) {
        try {
          setUploadedImages(JSON.parse(savedImages));
        } catch (e) {
          console.error('Error parsing local images:', e);
        }
      }

      if (user) {
        try {
          // Check for active Draft in database
          const list = await CommissionService.getUserCommissions(user.id);
          const dbDraft = list.find((c) => c.status === 'Draft');

          if (dbDraft) {
            // Restore from database draft (merge with local edits if db draft is older)
            const restoredDraft: CommissionDraft = {
              id: dbDraft.id,
              artworkType: dbDraft.artworkType || localDraft.artworkType,
              title: dbDraft.title || localDraft.title,
              description: dbDraft.description || localDraft.description,
              specialInstructions: dbCommValue(
                dbDraft.specialInstructions,
                localDraft.specialInstructions
              ),
              customerBudget: dbCommValue(dbDraft.customerBudget, localDraft.customerBudget),
              deadline: dbCommValue(dbDraft.deadline, localDraft.deadline),
              width: dbCommValue(dbDraft.width, localDraft.width),
              height: dbCommValue(dbDraft.height, localDraft.height),
              orientation: dbCommValue(dbDraft.orientation, localDraft.orientation),
              frameOption: dbCommValue(dbDraft.frameOption, localDraft.frameOption),
              preferredStyle: dbCommValue(dbDraft.preferredStyle, localDraft.preferredStyle),
              preferredColors: dbCommValue(dbDraft.preferredColors, localDraft.preferredColors),
              artworkPurpose: dbCommValue(dbDraft.artworkPurpose, localDraft.artworkPurpose),
            };

            setDraft(restoredDraft);

            // Re-fetch references if they exist
            const details = await CommissionService.getCommissionDetails(dbDraft.id);
            if (details?.referenceImages) {
              const urls = details.referenceImages.map((img) => img.imageUrl);
              setUploadedImages(urls);
              localStorage.setItem('aura_commission_images', JSON.stringify(urls));
            }

            setHasLoadedDraft(true);
            return;
          }
        } catch (e) {
          console.error('Failed to load DB draft:', e);
        }
      }

      // If not authenticated or no DB draft found, fallback to local state
      setDraft(localDraft);
      setHasLoadedDraft(true);
    };

    loadDraft();
  }, [user]);

  // helper to resolve values moved to top

  // Helper to update fields
  const updateDraft = (fields: Partial<CommissionDraft>) => {
    setDraft((prev) => {
      const nextDraft = { ...prev, ...fields };
      localStorage.setItem('aura_commission_draft', JSON.stringify(nextDraft));

      // Auto-save debouncing
      if (userRef.current) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
          saveDraftToDb(nextDraft);
        }, 1500); // 1.5 seconds debounce
      }

      return nextDraft;
    });
  };

  // Save/Update draft in Supabase DB
  const saveDraftToDb = async (currentDraft: CommissionDraft) => {
    if (!userRef.current) return;
    try {
      const payload = {
        title: currentDraft.title || '',
        artworkType: currentDraft.artworkType || '',
        description: currentDraft.description || '',
        specialInstructions: currentDraft.specialInstructions || '',
        customerBudget: currentDraft.customerBudget || 0,
        width: currentDraft.width !== undefined ? currentDraft.width : undefined,
        height: currentDraft.height !== undefined ? currentDraft.height : undefined,
        orientation: currentDraft.orientation || '',
        frameOption: currentDraft.frameOption || '',
        preferredStyle: currentDraft.preferredStyle || '',
        preferredColors: currentDraft.preferredColors || [],
        artworkPurpose: currentDraft.artworkPurpose || '',
        deadline: currentDraft.deadline !== undefined ? currentDraft.deadline : undefined,
        status: 'Draft' as CommissionStatus,
      };

      if (currentDraft.id) {
        await CommissionService.updateCommissionDraft(currentDraft.id, payload);
      } else {
        const created = await CommissionService.createCommissionDraft(userRef.current.id, payload);
        setDraft((prev) => {
          const nextWithId = { ...prev, id: created.id };
          localStorage.setItem('aura_commission_draft', JSON.stringify(nextWithId));
          return nextWithId;
        });
      }
      addToast('Draft auto-saved.', 'info');
    } catch (e) {
      console.error('Failed to auto-save draft to Supabase:', e);
    }
  };

  // Validate fields for each step
  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};
    const d = draftRef.current;

    if (stepNumber === 1) {
      if (!d.artworkType) {
        errors.artworkType = 'Please select an artwork type.';
      }
    }

    if (stepNumber === 3) {
      if (!d.title || !d.title.trim()) {
        errors.title = 'Title is required.';
      }
      if (!d.description || !d.description.trim()) {
        errors.description = 'Please describe your request.';
      } else if (d.description.length > 1000) {
        errors.description = 'Description cannot exceed 1000 characters.';
      }
      if (!d.customerBudget || d.customerBudget <= 0) {
        errors.customerBudget = 'Please enter a valid positive budget.';
      }
      if (!d.deadline) {
        errors.deadline = 'Please select a deadline date.';
      } else {
        const deadlineDate = new Date(d.deadline);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (deadlineDate < tomorrow) {
          errors.deadline = 'Deadline must be a future date.';
        }
      }
    }

    if (stepNumber === 4) {
      if (!d.width || d.width <= 0) {
        errors.width = 'Please enter a valid positive width.';
      }
      if (!d.height || d.height <= 0) {
        errors.height = 'Please enter a valid positive height.';
      }
      if (!d.orientation) {
        errors.orientation = 'Please select an orientation.';
      }
      if (!d.frameOption) {
        errors.frameOption = 'Please select a framing preference.';
      }
      if (!d.medium) {
        errors.medium = 'Please specify the medium.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Image Upload Handling
  const uploadImages = async (files: FileList) => {
    if (!user) {
      addToast('You must be signed in to upload reference images.', 'error');
      return;
    }

    const currentCount = uploadedImages.length;
    const incomingCount = files.length;
    if (currentCount + incomingCount > 10) {
      addToast('You can upload a maximum of 10 reference images.', 'info');
      return;
    }

    // Ensure we have a DB draft first to bind reference images correctly
    let activeDraftId = draft.id;
    if (!activeDraftId) {
      try {
        const created = await CommissionService.createCommissionDraft(user.id, {
          artworkType: draft.artworkType || '',
          status: 'Draft',
        });
        activeDraftId = created.id;
        setDraft((prev) => {
          const nextWithId = { ...prev, id: created.id };
          localStorage.setItem('aura_commission_draft', JSON.stringify(nextWithId));
          return nextWithId;
        });
      } catch (e) {
        console.error('Failed to initialize draft prior to image upload:', e);
        addToast('Failed to initialize draft. Please try again.', 'error');
        return;
      }
    }

    setIsUploading(true);
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!validFormats.includes(file.type)) {
          throw new Error(
            `Format of ${file.name} is not supported. Please upload JPG, PNG, or WEBP.`
          );
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds the 10MB size limit.`);
        }
        return CommissionUploadService.uploadReferenceImage(user.id, activeDraftId!, file);
      });

      const urls = await Promise.all(uploadPromises);
      const nextUrls = [...uploadedImages, ...urls];
      setUploadedImages(nextUrls);
      localStorage.setItem('aura_commission_images', JSON.stringify(nextUrls));
      addToast('Images uploaded successfully.', 'success');
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Image upload failed.';
      addToast(errorMsg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Image Removal Handling
  const removeImage = async (url: string) => {
    try {
      await CommissionUploadService.deleteReferenceImage(url);
      const nextUrls = uploadedImages.filter((imgUrl) => imgUrl !== url);
      setUploadedImages(nextUrls);
      localStorage.setItem('aura_commission_images', JSON.stringify(nextUrls));
      addToast('Image removed.', 'info');
    } catch (e) {
      console.error(e);
      addToast('Failed to remove image.', 'error');
    }
  };

  // Submit Final Commission Request
  const submitCommissionRequest = async (agreeToTimeline: boolean): Promise<boolean> => {
    if (!user) {
      addToast('You must be signed in to submit a commission.', 'error');
      return false;
    }

    if (!draft.id) {
      addToast('Draft session expired. Please refresh and try again.', 'error');
      return false;
    }

    if (!agreeToTimeline) {
      addToast('Please agree to the curation timeline terms.', 'info');
      return false;
    }

    setIsSubmitting(true);
    try {
      const finalPayload = {
        title: draft.title || 'Untitled Request',
        artworkType: draft.artworkType || 'Other',
        description: draft.description || '',
        specialInstructions: draft.specialInstructions || '',
        customerBudget: draft.customerBudget || 0,
        width: draft.width || 0,
        height: draft.height || 0,
        sizeUnit: draft.sizeUnit || 'in',
        orientation: draft.orientation || 'square',
        frameOption: draft.frameOption || 'none',
        preferredStyle: draft.preferredStyle || '',
        preferredColors: draft.preferredColors || [],
        artworkPurpose: draft.artworkPurpose || '',
        deadline: draft.deadline !== undefined ? draft.deadline : undefined,
        medium: draft.medium || '',
      };

      await CommissionService.submitCommission(draft.id, finalPayload, uploadedImages);

      // Reset Context & LocalStorage
      addToast('Commission request submitted successfully!', 'success');
      localStorage.removeItem('aura_commission_draft');
      localStorage.removeItem('aura_commission_step');
      localStorage.removeItem('aura_commission_images');
      setDraft({});
      setUploadedImages([]);
      setStepState(1);

      return true;
    } catch (e) {
      console.error(e);
      addToast('Commission submission failed. Please try again.', 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset/Delete draft session
  const resetDraft = async () => {
    if (draft.id) {
      try {
        await CommissionService.deleteCommissionDraft(draft.id, uploadedImages);
      } catch (e) {
        console.error('Failed to delete draft from DB:', e);
      }
    }
    localStorage.removeItem('aura_commission_draft');
    localStorage.removeItem('aura_commission_step');
    localStorage.removeItem('aura_commission_images');
    setDraft({});
    setUploadedImages([]);
    setStepState(1);
    addToast('Draft cleared.', 'info');
  };

  return (
    <CommissionContext.Provider
      value={{
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
      }}
    >
      {children}
    </CommissionContext.Provider>
  );
}

export function useCommission() {
  const context = useContext(CommissionContext);
  if (context === undefined) {
    throw new Error('useCommission must be used within a CommissionProvider');
  }
  return context;
}
