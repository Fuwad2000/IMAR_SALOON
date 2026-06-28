export type ExistingBookingSlot = {
  appointment_time: string;
  duration_minutes: number;
};

export function normalizeTime(time: string): string {
  return time.slice(0, 5);
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = normalizeTime(time).split(":").map(Number);
  return hours * 60 + minutes;
}

export function hasBookingOverlap(
  candidateStartMinutes: number,
  candidateDurationMinutes: number,
  existingBookings: ExistingBookingSlot[],
): boolean {
  const candidateEnd = candidateStartMinutes + candidateDurationMinutes;

  return existingBookings.some((booking) => {
    const existingStart = timeToMinutes(booking.appointment_time);
    const existingEnd = existingStart + booking.duration_minutes;
    return candidateStartMinutes < existingEnd && existingStart < candidateEnd;
  });
}

export function getUnavailableTimeSlots(
  slots: string[],
  durationMinutes: number,
  existingBookings: ExistingBookingSlot[],
): string[] {
  return slots.filter((slot) =>
    hasBookingOverlap(timeToMinutes(slot), durationMinutes, existingBookings),
  );
}

export function toDatabaseTime(time: string): string {
  const normalized = normalizeTime(time);
  return `${normalized}:00`;
}
