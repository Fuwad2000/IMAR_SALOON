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

/** True when the barber is already booked at this exact slot start time. */
export function isSlotOccupied(
  slotStartMinutes: number,
  existingBookings: ExistingBookingSlot[],
): boolean {
  return existingBookings.some((booking) => {
    const existingStart = timeToMinutes(booking.appointment_time);
    const existingEnd = existingStart + booking.duration_minutes;
    return slotStartMinutes >= existingStart && slotStartMinutes < existingEnd;
  });
}

export function isSlotUnavailable(
  slot: string,
  durationMinutes: number,
  existingBookings: ExistingBookingSlot[],
  closingMinute: number,
): boolean {
  const slotStart = timeToMinutes(slot);
  const slotEnd = slotStart + durationMinutes;

  if (slotEnd > closingMinute) {
    return true;
  }

  if (isSlotOccupied(slotStart, existingBookings)) {
    return true;
  }

  return hasBookingOverlap(slotStart, durationMinutes, existingBookings);
}

export function getUnavailableTimeSlots(
  slots: string[],
  durationMinutes: number,
  existingBookings: ExistingBookingSlot[],
  closingMinute: number,
): string[] {
  return slots.filter((slot) =>
    isSlotUnavailable(slot, durationMinutes, existingBookings, closingMinute),
  );
}

export function toDatabaseTime(time: string): string {
  const normalized = normalizeTime(time);
  return `${normalized}:00`;
}
