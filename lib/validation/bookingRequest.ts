import { bookingsContent } from "@/app/Content/BookingsContent";
import {
  sanitizeBookingDetails,
  validateBookingDetails,
  type BookingDetailsPayload,
} from "@/lib/validation/bookingForm";

export type BookingApiRequest = BookingDetailsPayload & {
  serviceId: string;
  serviceName?: string;
  durationMinutes?: number;
  date: string;
  time: string;
  turnstileToken?: string;
  companyWebsite?: string;
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;

export function getServiceById(serviceId: string) {
  return bookingsContent.services.find((service) => service.id === serviceId);
}

export function validateBookingRequest(body: BookingApiRequest) {
  const errors: Partial<Record<string, string>> = {};

  const service = body.serviceId ? getServiceById(body.serviceId) : undefined;
  if (!service) {
    errors.serviceId = "Select a valid service.";
  }

  if (!body.date?.trim()) {
    errors.date = "Select an appointment date.";
  } else if (!datePattern.test(body.date.trim())) {
    errors.date = "Select a valid appointment date.";
  }

  if (!body.time?.trim()) {
    errors.time = "Select an appointment time.";
  } else if (!timePattern.test(body.time.trim())) {
    errors.time = "Select a valid appointment time.";
  }

  const detailErrors = validateBookingDetails(body);
  Object.assign(errors, detailErrors);

  return { errors, service };
}

export function sanitizeBookingRequest(
  body: BookingApiRequest,
  service: NonNullable<ReturnType<typeof getServiceById>>,
) {
  const details = sanitizeBookingDetails(body);

  return {
    service_id: service.id,
    service_name: service.name,
    duration_minutes: service.durationMinutes,
    appointment_date: body.date.trim(),
    appointment_time: body.time.trim(),
    customer_name: details.name,
    customer_phone: details.phone,
    customer_email: details.email,
    notes: details.notes || null,
    status: "pending" as const,
  };
}

export type SanitizedBookingInsert = ReturnType<typeof sanitizeBookingRequest>;
