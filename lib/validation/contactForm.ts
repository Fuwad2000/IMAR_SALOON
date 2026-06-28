export type ContactFormPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type ContactFormRequest = ContactFormPayload & {
  turnstileToken?: string;
  companyWebsite?: string;
};

const namePattern = /^[a-zA-ZÀ-ÿ' -]{2,80}$/;
const phonePattern = /^[+]?[\d\s().-]{10,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactForm(
  payload: ContactFormPayload,
): Partial<Record<keyof ContactFormPayload, string>> {
  const errors: Partial<Record<keyof ContactFormPayload, string>> = {};

  const trimmedName = payload.name.trim();
  if (!trimmedName) {
    errors.name = "Name is required.";
  } else if (!namePattern.test(trimmedName)) {
    errors.name = "Enter a valid name.";
  }

  const trimmedPhone = payload.phone.trim();
  if (!trimmedPhone) {
    errors.phone = "Phone number is required.";
  } else if (!phonePattern.test(trimmedPhone) || trimmedPhone.replace(/\D/g, "").length < 10) {
    errors.phone = "Enter a valid phone number.";
  }

  const trimmedEmail = payload.email.trim();
  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  const trimmedMessage = payload.message.trim();
  if (!trimmedMessage) {
    errors.message = "Message is required.";
  } else if (trimmedMessage.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (trimmedMessage.length > 1000) {
    errors.message = "Message must be 1000 characters or fewer.";
  }

  return errors;
}

export function sanitizeContactForm(payload: ContactFormPayload): ContactFormPayload {
  return {
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim().toLowerCase(),
    message: payload.message.trim(),
  };
}
