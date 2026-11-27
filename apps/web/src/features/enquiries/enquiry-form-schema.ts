import { z } from 'zod';

export const enquiryFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(100),
  email: z.string().trim().email('Enter a valid email address.').max(320),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{7,24}$/, 'Enter a valid phone number.'),
  message: z
    .string()
    .trim()
    .min(10, 'Add a little more detail (at least 10 characters).')
    .max(2000, 'Keep your message under 2,000 characters.'),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;
