/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/client';

import { Commission, CommissionReference, CommissionUpdate } from '@/types';

const supabase = createClient();

export function mapDbReferenceToUi(dbRef: any): CommissionReference {
  return {
    id: Number(dbRef.id),
    commissionId: dbRef.commission_id,
    imageUrl: dbRef.image_url,
    displayOrder: dbRef.display_order,
    createdAt: dbRef.created_at,
  };
}

export function mapDbUpdateToUi(dbUpdate: any): CommissionUpdate {
  return {
    id: Number(dbUpdate.id),
    commissionId: dbUpdate.commission_id,
    oldStatus: dbUpdate.old_status || undefined,
    newStatus: dbUpdate.new_status,
    message: dbUpdate.message || undefined,
    createdBy: dbUpdate.created_by || undefined,
    createdAt: dbUpdate.created_at,
  };
}

export function mapDbCommissionToUi(dbComm: any): Commission {
  return {
    id: dbComm.id,
    userId: dbComm.user_id,
    title: dbComm.title || '',
    artworkType: dbComm.artwork_type || '',
    description: dbComm.description || '',
    specialInstructions: dbComm.special_instructions || undefined,
    customerBudget: Number(dbComm.customer_budget || 0),
    quotedPrice: dbComm.quoted_price ? Number(dbComm.quoted_price) : undefined,
    width: dbComm.width ? Number(dbComm.width) : undefined,
    height: dbComm.height ? Number(dbComm.height) : undefined,
    sizeUnit: dbComm.size_unit,
    orientation: dbComm.orientation || undefined,
    frameOption: dbComm.frame_option || undefined,
    preferredStyle: dbComm.preferred_style || undefined,
    preferredColors: dbComm.preferred_colors || undefined,
    artworkPurpose: dbComm.artwork_purpose || undefined,
    deadline: dbComm.deadline || undefined,
    status: dbComm.status as any,
    paymentStatus: dbComm.payment_status,
    assignedArtistId: dbComm.assigned_artist_id || undefined,
    estimatedCompletion: dbComm.estimated_completion || undefined,
    adminNotes: dbComm.admin_notes || undefined,
    internalNotes: dbComm.internal_notes || undefined,
    quotationNotes: dbComm.quotation_notes || undefined,
    priority: dbComm.priority,
    completionPercentage: Number(dbComm.completion_percentage || 0),
    createdAt: dbComm.created_at,
    updatedAt: dbComm.updated_at,
    referenceImages: dbComm.commission_reference_images
      ? dbComm.commission_reference_images.map(mapDbReferenceToUi)
      : undefined,
    updates: dbComm.commission_updates ? dbComm.commission_updates.map(mapDbUpdateToUi) : undefined,
  };
}

export const CommissionRepository = {
  async createCommission(userId: string, commission: Partial<Commission>): Promise<Commission> {
    const dbPayload: any = {
      user_id: userId,
      title: commission.title || null,
      artwork_type: commission.artworkType || null,
      description: commission.description || null,
      special_instructions: commission.specialInstructions || null,
      customer_budget: commission.customerBudget || null,
      quoted_price: commission.quotedPrice || null,
      width: commission.width || null,
      height: commission.height || null,
      size_unit: commission.sizeUnit || 'in',
      orientation: commission.orientation || null,
      frame_option: commission.frameOption || null,
      preferred_style: commission.preferredStyle || null,
      preferred_colors: commission.preferredColors || null,
      artwork_purpose: commission.artworkPurpose || null,
      deadline: commission.deadline || null,
      status: commission.status || 'Draft',
      payment_status: commission.paymentStatus || 'Unpaid',
      assigned_artist_id: commission.assignedArtistId || null,
      estimated_completion: commission.estimatedCompletion || null,
      admin_notes: commission.adminNotes || null,
      internal_notes: commission.internalNotes || null,
      quotation_notes: commission.quotationNotes || null,
      priority: commission.priority || 'medium',
      completion_percentage: commission.completionPercentage || 0,
    };

    const { data, error } = await (supabase as any)
      .from('commissions')
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;
    return mapDbCommissionToUi(data);
  },

  async updateCommission(id: string, updates: Partial<Commission>): Promise<Commission> {
    const dbPayload: any = {};
    if (updates.title !== undefined) dbPayload.title = updates.title;
    if (updates.artworkType !== undefined) dbPayload.artwork_type = updates.artworkType;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    if (updates.specialInstructions !== undefined)
      dbPayload.special_instructions = updates.specialInstructions;
    if (updates.customerBudget !== undefined) dbPayload.customer_budget = updates.customerBudget;
    if (updates.quotedPrice !== undefined) dbPayload.quoted_price = updates.quotedPrice;
    if (updates.width !== undefined) dbPayload.width = updates.width;
    if (updates.height !== undefined) dbPayload.height = updates.height;
    if (updates.sizeUnit !== undefined) dbPayload.size_unit = updates.sizeUnit;
    if (updates.orientation !== undefined) dbPayload.orientation = updates.orientation;
    if (updates.frameOption !== undefined) dbPayload.frame_option = updates.frameOption;
    if (updates.preferredStyle !== undefined) dbPayload.preferred_style = updates.preferredStyle;
    if (updates.preferredColors !== undefined) dbPayload.preferred_colors = updates.preferredColors;
    if (updates.artworkPurpose !== undefined) dbPayload.artwork_purpose = updates.artworkPurpose;
    if (updates.deadline !== undefined) dbPayload.deadline = updates.deadline;
    if (updates.status !== undefined) dbPayload.status = updates.status;
    if (updates.paymentStatus !== undefined) dbPayload.payment_status = updates.paymentStatus;
    if (updates.assignedArtistId !== undefined)
      dbPayload.assigned_artist_id = updates.assignedArtistId;
    if (updates.estimatedCompletion !== undefined)
      dbPayload.estimated_completion = updates.estimatedCompletion;
    if (updates.adminNotes !== undefined) dbPayload.admin_notes = updates.adminNotes;
    if (updates.internalNotes !== undefined) dbPayload.internal_notes = updates.internalNotes;
    if (updates.quotationNotes !== undefined) dbPayload.quotation_notes = updates.quotationNotes;
    if (updates.priority !== undefined) dbPayload.priority = updates.priority;
    if (updates.completionPercentage !== undefined)
      dbPayload.completion_percentage = updates.completionPercentage;

    dbPayload.updated_at = new Date().toISOString();

    const { data, error } = await (supabase as any)
      .from('commissions')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDbCommissionToUi(data);
  },

  async deleteCommission(id: string): Promise<void> {
    const { error } = await supabase.from('commissions').delete().eq('id', id);
    if (error) throw error;
  },

  async getUserCommissions(userId: string): Promise<Commission[]> {
    const { data, error } = await supabase
      .from('commissions')
      .select('*, commission_reference_images(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDbCommissionToUi);
  },

  async getCommissionDetails(id: string): Promise<Commission | null> {
    const { data, error } = await supabase
      .from('commissions')
      .select('*, commission_reference_images(*), commission_updates(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const dbComm = data as any;

    // Order updates manually by created_at ascending
    if (dbComm.commission_updates) {
      dbComm.commission_updates.sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    // Order images by display_order ascending
    if (dbComm.commission_reference_images) {
      dbComm.commission_reference_images.sort(
        (a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)
      );
    }

    return mapDbCommissionToUi(dbComm);
  },

  async addReferenceImages(
    commissionId: string,
    images: { imageUrl: string; displayOrder: number }[]
  ): Promise<CommissionReference[]> {
    const payloads = images.map((img) => ({
      commission_id: commissionId,
      image_url: img.imageUrl,
      display_order: img.displayOrder,
    }));

    const { data, error } = await (supabase as any)
      .from('commission_reference_images')
      .insert(payloads)
      .select();

    if (error) throw error;
    return (data || []).map(mapDbReferenceToUi);
  },

  async removeReferenceImage(id: number): Promise<void> {
    const { error } = await supabase.from('commission_reference_images').delete().eq('id', id);
    if (error) throw error;
  },

  async removeReferenceImageByUrl(commissionId: string, imageUrl: string): Promise<void> {
    const { error } = await supabase
      .from('commission_reference_images')
      .delete()
      .eq('commission_id', commissionId)
      .eq('image_url', imageUrl);
    if (error) throw error;
  },

  async addCommissionUpdate(
    commissionId: string,
    update: { oldStatus?: string; newStatus: string; message?: string; createdBy?: string }
  ): Promise<CommissionUpdate> {
    const payload = {
      commission_id: commissionId,
      old_status: update.oldStatus || null,
      new_status: update.newStatus,
      message: update.message || null,
      created_by: update.createdBy || null,
    };

    const { data, error } = await (supabase as any)
      .from('commission_updates')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return mapDbUpdateToUi(data);
  },
};
export default CommissionRepository;
