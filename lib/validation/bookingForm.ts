import type { BookingDraft } from "@/lib/booking/types";

export type BookingDetailsPayload = Pick<
  BookingDraft,
  "name" | "phone" | "email" | "notes"
>;

const namePattern = /^[a-zA-ZÀ-ÿ' -]{2,80}$/;
const phonePattern = /^[+]?[\d\s().-]{10,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateBookingDetails(
  payload: BookingDetailsPayload,
): Partial<Record<keyof BookingDetailsPayload, string>> {
  const errors: Partial<Record<keyof BookingDetailsPayload, string>> = {};

  const trimmedName = payload.name.trim();
  if (!trimmedName) {
    errors.name = "Name is required.";
  } else if (!namePattern.test(trimmedName)) {
    errors.name = "Enter a valid name.";
  }

  const trimmedPhone = payload.phone.trim();
  if (!trimmedPhone) {
    errors.phone = "Phone number is required.";
  } else if (
    !phonePattern.test(trimmedPhone) ||
    trimmedPhone.replace(/\D/g, "").length < 10
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  const trimmedEmail = payload.email.trim();
  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  const trimmedNotes = payload.notes.trim();
  if (trimmedNotes.length > 500) {
    errors.notes = "Notes must be 500 characters or fewer.";
  }

  return errors;
}

export function sanitizeBookingDetails(
  payload: BookingDetailsPayload,
): BookingDetailsPayload {
  return {
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim().toLowerCase(),
    notes: payload.notes.trim(),
  };
}
