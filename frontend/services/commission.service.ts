import { CommissionRepository } from '@/repositories/commission.repository';

import { CommissionUploadService } from './commissionUpload.service';

import { Commission } from '@/types';

export const CommissionService = {
  async createCommissionDraft(userId: string, draftData: Partial<Commission>): Promise<Commission> {
    return CommissionRepository.createCommission(userId, {
      ...draftData,
      status: 'Draft',
    });
  },

  async updateCommissionDraft(id: string, updates: Partial<Commission>): Promise<Commission> {
    return CommissionRepository.updateCommission(id, {
      ...updates,
      status: 'Draft',
    });
  },

  async submitCommission(
    id: string,
    finalData: Partial<Commission>,
    imageUrls: string[]
  ): Promise<Commission> {
    // 1. Save all details and change status to 'Submitted'
    const updated = await CommissionRepository.updateCommission(id, {
      ...finalData,
      status: 'Submitted',
    });

    // 2. Link reference images to the database
    if (imageUrls && imageUrls.length > 0) {
      const referencePayloads = imageUrls.map((url, index) => ({
        imageUrl: url,
        displayOrder: index,
      }));
      await CommissionRepository.addReferenceImages(id, referencePayloads);
    }

    // 3. Log initial timeline update
    await CommissionRepository.addCommissionUpdate(id, {
      oldStatus: 'Draft',
      newStatus: 'Submitted',
      message: 'Commission inquiry successfully submitted for curation board review.',
    });

    // 4. Retrieve complete details (including references/updates)
    const fullDetails = await CommissionRepository.getCommissionDetails(id);
    if (!fullDetails) return updated;
    return fullDetails;
  },

  async getUserCommissions(userId: string): Promise<Commission[]> {
    return CommissionRepository.getUserCommissions(userId);
  },

  async getCommissionDetails(id: string): Promise<Commission | null> {
    return CommissionRepository.getCommissionDetails(id);
  },

  async deleteCommissionDraft(id: string, imageUrls: string[] = []): Promise<void> {
    // 1. Delete associated images from Supabase storage first
    if (imageUrls && imageUrls.length > 0) {
      await Promise.all(imageUrls.map((url) => CommissionUploadService.deleteReferenceImage(url)));
    }

    // 2. Delete commission record from DB
    await CommissionRepository.deleteCommission(id);
  },

  async removeReferenceImage(id: number, imageUrl: string): Promise<void> {
    // 1. Delete from Supabase storage
    await CommissionUploadService.deleteReferenceImage(imageUrl);

    // 2. Delete from Database
    await CommissionRepository.removeReferenceImage(id);
  },
};
export default CommissionService;
