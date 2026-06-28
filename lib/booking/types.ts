export type BookingStepId = "service" | "datetime" | "details" | "review";

export type BookingService = {
  id: string;
  name: string;
  durationMinutes: number;
  description: string;
};

export type BookingDraft = {
  serviceId: string | null;
  date: string | null;
  time: string | null;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

export type BookingRequest = BookingDraft & {
  serviceName: string;
  durationMinutes: number;
};
