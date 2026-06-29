export const BOOKING_HOURS = {
  startHour: 9,
  endHour: 22,
  slotIntervalMinutes: 30,
  maxAdvanceDays: 21,
} as const;

const weekdayFormatter = new Intl.DateTimeFormat("en-CA", { weekday: "short" });
const monthDayFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  day: "numeric",
});
const fullDateFormatter = new Intl.DateTimeFormat("en-CA", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getAvailableDates(referenceDate = new Date()) {
  const today = startOfDay(referenceDate);
  const dates = [];

  for (let offset = 0; offset < BOOKING_HOURS.maxAdvanceDays; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    dates.push({
      key: toDateKey(date),
      weekday: weekdayFormatter.format(date),
      monthDay: monthDayFormatter.format(date),
      isToday: offset === 0,
    });
  }

  return dates;
}

export function formatBookingDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return fullDateFormatter.format(new Date(year, month - 1, day));
}

export function formatBookingTime(time: string) {
  const [hourPart, minutePart] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hourPart, minutePart, 0, 0);

  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getTimeSlots() {
  const slots: string[] = [];
  const { startHour, endHour, slotIntervalMinutes } = BOOKING_HOURS;

  for (let hour = startHour; hour < endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += slotIntervalMinutes) {
      const slotEndMinutes = hour * 60 + minute + slotIntervalMinutes;
      if (slotEndMinutes > endHour * 60) {
        break;
      }

      slots.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      );
    }
  }

  return slots;
}

export function groupTimeSlots(slots: string[]) {
  return {
    morning: slots.filter((slot) => Number(slot.split(":")[0]) < 12),
    afternoon: slots.filter((slot) => {
      const hour = Number(slot.split(":")[0]);
      return hour >= 12 && hour < 17;
    }),
    evening: slots.filter((slot) => Number(slot.split(":")[0]) >= 17),
  };
}
