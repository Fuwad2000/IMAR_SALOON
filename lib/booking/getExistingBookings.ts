import type { ExistingBookingSlot } from "@/lib/booking/overlap";
import { getSupabaseClient } from "@/lib/supabase";

export async function getExistingBookingsForDate(date: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("appointment_time, duration_minutes")
    .eq("appointment_date", date)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    throw error;
  }

  return (data ?? []) as ExistingBookingSlot[];
}
