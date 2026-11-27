import { CreateEnquiryRequest, EnquiryResponse } from '@/types/product';
import { apiRequest } from './api-client';

export function submitEnquiry(
  enquiry: CreateEnquiryRequest,
): Promise<EnquiryResponse> {
  return apiRequest('/enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiry),
  });
}
