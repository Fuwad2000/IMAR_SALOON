export const bookingsContent = {
  header: {
    title: "Book an Appointment",
    tagline: "Reserve your chair",
    description:
      "Choose your service, pick a day and time, and confirm your details. Imar is available Monday through Sunday — select what works best for you.",
  },
  availability: {
    label: "Open every day",
    value: "Monday – Sunday",
    hours: "9:00 AM – 8:00 PM",
  },
  steps: [
    { id: "service", label: "Service" },
    { id: "datetime", label: "Date & Time" },
    { id: "details", label: "Your Details" },
    { id: "review", label: "Review" },
  ] as const,
  services: [
    {
      id: "skin-fade",
      name: "Skin Fade & Taper",
      durationMinutes: 45,
      description: "Sharp skin fade or clean taper, finished to your style.",
    },
    {
      id: "mens-haircut",
      name: "Men's Haircut",
      durationMinutes: 45,
      description: "Classic or modern cut tailored to your look.",
    },
    {
      id: "beard-trim",
      name: "Beard Trim & Line-Up",
      durationMinutes: 30,
      description: "Beard shaping, line-up, and clean edge work.",
    },
    {
      id: "kids-haircut",
      name: "Kids Haircut",
      durationMinutes: 30,
      description: "Patient, professional cuts for young clients.",
    },
    {
      id: "afro-curly",
      name: "Afro & Curly Styling",
      durationMinutes: 45,
      description: "Cuts and styling for afro and curly hair textures.",
    },
    {
      id: "textured-cut",
      name: "Straight & Textured Cut",
      durationMinutes: 45,
      description: "Precision cuts for straight and textured hair.",
    },
    {
      id: "hot-towel",
      name: "Hot Towel Service",
      durationMinutes: 60,
      description: "Relaxing hot towel treatment with grooming finish.",
    },
  ],
  form: {
    service: {
      title: "Select a service",
      subtitle: "All services include a consultation to match your style.",
    },
    datetime: {
      title: "Pick a date & time",
      subtitle: "Available Monday through Sunday. Times shown in Eastern Time.",
      dateLabel: "Choose a date",
      timeLabel: "Choose a time",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      loadingTimes: "Checking availability...",
      unavailable: "Unavailable",
    },
    details: {
      title: "Your details",
      subtitle: "We'll use this to confirm your appointment.",
      fields: {
        name: { label: "Full name", placeholder: "Your name" },
        phone: { label: "Phone number", placeholder: "+1 (555) 000-0000" },
        email: { label: "Email address", placeholder: "you@example.com" },
        notes: {
          label: "Notes (optional)",
          placeholder: "Any preferences, reference photos, or special requests...",
        },
      },
    },
    review: {
      title: "Review your booking",
      subtitle: "Confirm everything looks right before submitting your request.",
      labels: {
        service: "Service",
        date: "Date",
        time: "Time",
        duration: "Duration",
        name: "Name",
        phone: "Phone",
        email: "Email",
        notes: "Notes",
      },
    },
    actions: {
      back: "Back",
      continue: "Continue",
      confirm: "Request appointment",
      submitting: "Submitting...",
    },
    success: {
      title: "Booking request received",
      message:
        "Thank you! Your appointment request has been submitted. Imar will confirm your booking shortly.",
      newBooking: "Book another appointment",
    },
    error:
      "We couldn't submit your booking right now. Please try again or contact us directly.",
    turnstileRequired:
      "Please complete the security check before submitting your booking.",
  },
  sidebar: {
    title: "What to expect",
    items: [
      "Choose your service and preferred time slot",
      "Submit your request — confirmation coming soon",
      "Arrive a few minutes early for your appointment",
      "Cash and e-transfer accepted at the chair",
    ],
    location: {
      label: "Location",
      value: "35 Ridgemore Crescent, Brampton ON",
      href: "/contact",
    },
  },
};
