export type InquiryType = 'purchase' | 'question' | 'general';

export interface Inquiry {
  id: string;
  artworkId?: string;
  artworkTitle?: string;
  type: InquiryType;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
