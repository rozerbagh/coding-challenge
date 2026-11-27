'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitEnquiry } from '@/services/enquiries-api';
import { Product } from '@/types/product';
import { EnquiryFormValues, enquiryFormSchema } from './enquiry-form-schema';
import { EnquiryFormView } from './enquiry-form-view';
import { ThankYouView } from './thank-you-view';

export function EnquiryFormFeature({ product }: { product: Product }) {
  const [submitted, setSubmitted] = useState(false);
  const mutation = useMutation({ mutationFn: submitEnquiry });
  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  async function onSubmit(values: EnquiryFormValues): Promise<void> {
    mutation.reset();
    try {
      await mutation.mutateAsync({ ...values, productId: product.id });
      setSubmitted(true);
    } catch {
      // The mutation state carries a safe, user-facing error message.
    }
  }

  if (submitted) {
    return (
      <ThankYouView
        onStartAnother={() => {
          form.reset();
          mutation.reset();
          setSubmitted(false);
        }}
      />
    );
  }

  return (
    <EnquiryFormView
      fields={{
        name: form.register('name'),
        email: form.register('email'),
        phone: form.register('phone'),
        message: form.register('message'),
      }}
      errors={{
        name: form.formState.errors.name?.message,
        email: form.formState.errors.email?.message,
        phone: form.formState.errors.phone?.message,
        message: form.formState.errors.message?.message,
      }}
      errorMessage={mutation.error?.message}
      isSubmitting={form.formState.isSubmitting || mutation.isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
}
