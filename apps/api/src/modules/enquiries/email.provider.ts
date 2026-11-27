import { EnquiryEmail } from './enquiry-email.model';

export abstract class EmailProvider {
  abstract sendProductEnquiry(enquiry: EnquiryEmail): Promise<void>;
}
