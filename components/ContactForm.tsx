"use client";

import { contactContent } from "@/app/Content/ContactContent";
import {
  validateContactForm,
  type ContactFormPayload,
} from "@/lib/validation/contactForm";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { FormEvent, useEffect, useRef, useState } from "react";

const { form } = contactContent;

type FormValues = ContactFormPayload;
type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

const inputClassName =
  "w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-all duration-300 focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20";

const inputErrorClassName =
  "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20";

export default function ContactForm() {
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string | null>(null);
  const [turnstileConfigLoading, setTurnstileConfigLoading] = useState(true);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetTurnstile = () => {
    setTurnstileToken("");
    turnstileRef.current?.reset();
  };

  useEffect(() => {
    let cancelled = false;

    async function loadTurnstileConfig() {
      try {
        const response = await fetch("/api/turnstile/site-key");
        const data = (await response.json()) as { siteKey?: string | null };

        if (!cancelled) {
          setTurnstileSiteKey(data.siteKey ?? null);
        }
      } catch {
        if (!cancelled) {
          setTurnstileSiteKey(null);
        }
      } finally {
        if (!cancelled) {
          setTurnstileConfigLoading(false);
        }
      }
    }

    loadTurnstileConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateContactForm(values));
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field] || submitted) {
      setErrors(validateContactForm(next));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setSubmitError("");
    setTouched({ name: true, phone: true, email: true, message: true });

    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!turnstileToken) {
      setSubmitError(form.turnstileRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          turnstileToken,
          companyWebsite,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        errors?: FormErrors;
      };

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setSubmitError(data.error ?? form.error);
        resetTurnstile();
        return;
      }

      setShowSuccessMessage(true);
      setValues(initialValues);
      setCompanyWebsite("");
      setTouched({});
      setSubmitted(false);
      setErrors({});
      resetTurnstile();
    } catch {
      setSubmitError(form.error);
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (
    key: keyof FormValues,
    type: "text" | "tel" | "email" | "textarea",
    config: { label: string; placeholder: string; maxLength?: number; rows?: number },
  ) => {
    const hasError = Boolean(errors[key] && (touched[key] || submitted));
    const inputId = `contact-${key}`;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gold-light"
        >
          {config.label}
          <span className="text-gold"> *</span>
        </label>
        {type === "textarea" ? (
          <textarea
            id={inputId}
            name={key}
            rows={config.rows ?? 5}
            maxLength={config.maxLength}
            value={values[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            onBlur={() => handleBlur(key)}
            placeholder={config.placeholder}
            disabled={isSubmitting}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            className={`${inputClassName} resize-none ${hasError ? inputErrorClassName : ""}`}
          />
        ) : (
          <input
            id={inputId}
            name={key}
            type={type}
            maxLength={config.maxLength}
            value={values[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            onBlur={() => handleBlur(key)}
            placeholder={config.placeholder}
            disabled={isSubmitting}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            className={`${inputClassName} ${hasError ? inputErrorClassName : ""}`}
          />
        )}
        {hasError && (
          <p id={`${inputId}-error`} className="mt-2 text-xs text-red-400/90" role="alert">
            {errors[key]}
          </p>
        )}
      </div>
    );
  };

  const canSubmit = Boolean(turnstileSiteKey && turnstileToken) && !isSubmitting;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gold/20 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight text-white">{form.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{form.subtitle}</p>

      {showSuccessMessage && (
        <div
          className="mt-6 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-light"
          role="status"
        >
          {form.success}
        </div>
      )}

      {submitError && (
        <div
          className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <div
          className="absolute left-[-9999px] h-px w-px overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="contact-companyWebsite">Company website</label>
          <input
            id="contact-companyWebsite"
            name="companyWebsite"
            type="text"
            value={companyWebsite}
            onChange={(event) => setCompanyWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {field("name", "text", {
            label: form.fields.name.label,
            placeholder: form.fields.name.placeholder,
            maxLength: 80,
          })}
          {field("phone", "tel", {
            label: form.fields.phone.label,
            placeholder: form.fields.phone.placeholder,
            maxLength: 20,
          })}
        </div>

        {field("email", "email", {
          label: form.fields.email.label,
          placeholder: form.fields.email.placeholder,
          maxLength: 254,
        })}

        {field("message", "textarea", {
          label: form.fields.message.label,
          placeholder: form.fields.message.placeholder,
          maxLength: 1000,
          rows: 5,
        })}

        {turnstileConfigLoading ? (
          <div className="rounded-xl border border-gold/15 bg-black/30 px-4 py-6 text-center text-sm text-white/50">
            Loading security verification...
          </div>
        ) : turnstileSiteKey ? (
          <div className="overflow-hidden rounded-xl border border-gold/15 bg-black/30 p-3">
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              onSuccess={setTurnstileToken}
              onExpire={resetTurnstile}
              onError={resetTurnstile}
              options={{
                theme: "dark",
                appearance: "always",
              }}
            />
          </div>
        ) : (
          <p className="text-sm text-red-300" role="alert">
            Security verification is not configured. Please try again later.
          </p>
        )}

        <p className="text-xs text-white/35">
          Fields marked with <span className="text-gold">*</span> are required.
        </p>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(212,175,55,0.45)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? form.submitting : form.submit}
        </button>
      </form>
    </div>
  );
}
