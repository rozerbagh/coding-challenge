import { FormEventHandler } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { EnquiryFormValues } from './enquiry-form-schema';

interface EnquiryFormViewProps {
  fields: {
    name: UseFormRegisterReturn<'name'>;
    email: UseFormRegisterReturn<'email'>;
    phone: UseFormRegisterReturn<'phone'>;
    message: UseFormRegisterReturn<'message'>;
  };
  errors: Partial<Record<keyof EnquiryFormValues, string>>;
  errorMessage?: string;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const fieldClassName =
  'mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15';

export function EnquiryFormView({
  fields,
  errors,
  errorMessage,
  isSubmitting,
  onSubmit,
}: EnquiryFormViewProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="enquiry-name" className="text-sm font-semibold text-stone-800">
            Your name
          </label>
          <input
            id="enquiry-name"
            autoComplete="name"
            {...fields.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
            className={fieldClassName}
            placeholder="Name"
          />
          {errors.name && (
            <p id="enquiry-name-error" className="mt-1 text-xs text-rose-700">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="enquiry-email" className="text-sm font-semibold text-stone-800">
            Email address
          </label>
          <input
            id="enquiry-email"
            type="email"
            autoComplete="email"
            {...fields.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
            className={fieldClassName}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="enquiry-email-error" className="mt-1 text-xs text-rose-700">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="enquiry-phone" className="text-sm font-semibold text-stone-800">
          Phone number
        </label>
        <input
          id="enquiry-phone"
          type="tel"
          autoComplete="tel"
          {...fields.phone}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'enquiry-phone-error' : undefined}
          className={fieldClassName}
          placeholder="+1 555 123 4567"
        />
        {errors.phone && (
          <p id="enquiry-phone-error" className="mt-1 text-xs text-rose-700">
            {errors.phone}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="enquiry-message" className="text-sm font-semibold text-stone-800">
          How can we help?
        </label>
        <textarea
          id="enquiry-message"
          rows={5}
          {...fields.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'enquiry-message-error' : undefined}
          className={`${fieldClassName} resize-y`}
          placeholder="Tell us what you would like to know about this product."
        />
        {errors.message && (
          <p id="enquiry-message-error" className="mt-1 text-xs text-rose-700">
            {errors.message}
          </p>
        )}
      </div>
      {errorMessage && (
        <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? 'Sending enquiry…' : 'Send enquiry'}
      </button>
      <p className="text-xs leading-5 text-stone-500">
        Your details are sent to our sales team so they can respond to this enquiry.
      </p>
    </form>
  );
}
