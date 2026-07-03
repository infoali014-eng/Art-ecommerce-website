import { StorageService } from './storage.service';

export const CommissionUploadService = {
  async uploadReferenceImage(userId: string, commissionId: string, file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop() || '';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    const path = `${userId}/${commissionId}/${Date.now()}_${cleanFileName}.${fileExtension}`;

    const uploadedPath = await StorageService.uploadFile('commission-references', path, file);
    return StorageService.getPublicUrl('commission-references', uploadedPath);
  },

  async deleteReferenceImage(imageUrl: string): Promise<void> {
    try {
      const parts = imageUrl.split('/commission-references/');
      if (parts.length < 2) return;
      const path = parts[1];
      await StorageService.deleteFile('commission-references', path);
    } catch (e) {
      console.error('Failed to delete storage file:', e);
    }
  },
};
export default CommissionUploadService;
