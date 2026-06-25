"use client";

import { contactContent } from "@/app/Content/ContactContent";
import { FormEvent, useState } from "react";

const { form } = contactContent;

type FormValues = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

const namePattern = /^[a-zA-ZÀ-ÿ' -]{2,80}$/;
const phonePattern = /^[+]?[\d\s().-]{10,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const trimmedName = values.name.trim();
  if (!trimmedName) {
    errors.name = "Name is required.";
  } else if (!namePattern.test(trimmedName)) {
    errors.name = "Enter a valid name (2–80 characters, letters only).";
  }

  const trimmedPhone = values.phone.trim();
  if (!trimmedPhone) {
    errors.phone = "Phone number is required.";
  } else if (!phonePattern.test(trimmedPhone)) {
    errors.phone = "Enter a valid phone number (10–15 digits).";
  } else if (trimmedPhone.replace(/\D/g, "").length < 10) {
    errors.phone = "Phone number must include at least 10 digits.";
  }

  const trimmedEmail = values.email.trim();
  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  const trimmedMessage = values.message.trim();
  if (!trimmedMessage) {
    errors.message = "Message is required.";
  } else if (trimmedMessage.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (trimmedMessage.length > 1000) {
    errors.message = "Message must be 1000 characters or fewer.";
  }

  return errors;
}

const inputClassName =
  "w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-all duration-300 focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20";

const inputErrorClassName =
  "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20";

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field] || submitted) {
      setErrors(validate(next));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setTouched({ name: true, phone: true, email: true, message: true });

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setShowSuccessMessage(true);
      setValues(initialValues);
      setTouched({});
      setSubmitted(false);
      setErrors({});
    }
  };

  const showSuccess = showSuccessMessage;

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

  return (
    <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight text-white">{form.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{form.subtitle}</p>

      {showSuccess && (
        <div
          className="mt-6 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-light"
          role="status"
        >
          {form.success}
        </div>
      )}

      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit}
        noValidate
      >
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

        <p className="text-xs text-white/35">
          Fields marked with <span className="text-gold">*</span> are required.
        </p>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(212,175,55,0.45)] sm:w-auto"
        >
          {form.submit}
        </button>
      </form>
    </div>
  );
}
