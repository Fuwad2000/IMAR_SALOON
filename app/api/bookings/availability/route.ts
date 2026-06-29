import { BOOKING_HOURS, getTimeSlots } from "@/lib/booking/availability";
import { getExistingBookingsForDate } from "@/lib/booking/getExistingBookings";
import { getUnavailableTimeSlots } from "@/lib/booking/overlap";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const closingMinute = BOOKING_HOURS.endHour * 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date")?.trim() ?? "";
    const durationMinutes = Number(searchParams.get("durationMinutes"));

    if (!datePattern.test(date)) {
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    }

    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      return NextResponse.json({ error: "Invalid service duration." }, { status: 400 });
    }

    let existingBookings;

    try {
      existingBookings = await getExistingBookingsForDate(date);
    } catch (error) {
      console.error("Supabase availability fetch error:", error);
      return NextResponse.json(
        { error: "Unable to load availability right now." },
        { status: 502 },
      );
    }

    const unavailableSlots = getUnavailableTimeSlots(
      getTimeSlots(),
      durationMinutes,
      existingBookings,
      closingMinute,
    );

    return NextResponse.json({ unavailableSlots });
  } catch (error) {
    console.error("Availability API error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
