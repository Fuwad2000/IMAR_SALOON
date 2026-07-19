"use client";

import { bookingsContent } from "@/app/Content/BookingsContent";
import {
  formatBookingDate,
  formatBookingTime,
  getAvailableDates,
  getTimeSlots,
  groupTimeSlots,
} from "@/lib/booking/availability";
import type { BookingDraft, BookingStepId } from "@/lib/booking/types";
import {
  sanitizeBookingDetails,
  validateBookingDetails,
  type BookingDetailsPayload,
} from "@/lib/validation/bookingForm";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useEffect, useMemo, useRef, useState } from "react";

const { steps, services, form } = bookingsContent;

const stepOrder: BookingStepId[] = ["service", "datetime", "details", "review"];

type CompletedSummary = {
  serviceName: string;
  date: string;
  time: string;
  name: string;
};

const initialDraft: BookingDraft = {
  serviceId: null,
  date: null,
  time: null,
  name: "",
  phone: "",
  email: "",
  notes: "",
};

const inputClassName =
  "w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/30 transition-all duration-300 focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20 sm:text-sm";

const inputErrorClassName =
  "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20";

const selectionClassName = (selected: boolean) =>
  [
    "rounded-xl border px-4 py-3 text-left transition-all duration-300",
    selected
      ? "border-gold bg-gold/10 text-white shadow-[0_0_20px_rgba(212,175,55,0.15)]"
      : "border-gold/15 bg-black/30 text-white/80 hover:border-gold/35 hover:bg-white/[0.04]",
  ].join(" ");

function BookingLoadingOverlay({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-[#0a0a0a]/90 px-6 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-11 w-11 animate-spin rounded-full border-2 border-gold/20 border-t-gold"
        aria-hidden="true"
      />
      <p className="mt-5 text-center text-sm font-semibold text-white">{title}</p>
      {detail && (
        <p className="mt-2 max-w-xs text-center text-xs leading-relaxed text-white/55">
          {detail}
        </p>
      )}
    </div>
  );
}

function StepIndicator({ currentStep }: { currentStep: BookingStepId }) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <ol className="grid grid-cols-4 gap-1.5 sm:gap-3">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = step.id === currentStep;

        return (
          <li key={step.id} className="min-w-0">
            <div
              className={[
                "rounded-lg border px-1.5 py-2.5 text-center transition-all duration-300 sm:rounded-xl sm:px-3 sm:py-3",
                isCurrent
                  ? "border-gold/50 bg-gold/10"
                  : isComplete
                    ? "border-gold/25 bg-white/[0.03]"
                    : "border-gold/10 bg-black/20",
              ].join(" ")}
            >
              <span
                className={[
                  "mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold sm:h-7 sm:w-7 sm:text-xs",
                  isCurrent
                    ? "bg-gold text-[#0a0a0a]"
                    : isComplete
                      ? "bg-gold/20 text-gold-light"
                      : "bg-white/5 text-white/35",
                ].join(" ")}
              >
                {isComplete ? "✓" : index + 1}
              </span>
              <p
                className={[
                  "mt-1.5 text-[9px] font-semibold uppercase leading-tight tracking-[0.06em] sm:mt-2 sm:text-xs sm:tracking-[0.12em]",
                  isCurrent ? "text-gold-light" : "text-white/45",
                ].join(" ")}
              >
                {step.label}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function BookingFlow() {
  const flowTopRef = useRef<HTMLDivElement>(null);
  const skipInitialScrollRef = useRef(true);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string | null>(null);
  const [turnstileConfigLoading, setTurnstileConfigLoading] = useState(true);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [currentStep, setCurrentStep] = useState<BookingStepId>("service");
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [completedSummary, setCompletedSummary] = useState<CompletedSummary | null>(
    null,
  );
  const [detailsErrors, setDetailsErrors] = useState<
    Partial<Record<keyof BookingDetailsPayload, string>>
  >({});
  const [detailsTouched, setDetailsTouched] = useState<
    Partial<Record<keyof BookingDetailsPayload, boolean>>
  >({});
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const availableDates = useMemo(() => getAvailableDates(), []);
  const timeSlots = useMemo(() => getTimeSlots(), []);
  const groupedSlots = useMemo(() => groupTimeSlots(timeSlots), [timeSlots]);

  const selectedService = services.find((service) => service.id === draft.serviceId);

  const resetTurnstile = () => {
    setTurnstileToken("");
    turnstileRef.current?.reset();
  };

  useEffect(() => {
    let cancelled = false;

    async function loadTurnstileConfig() {
      try {
        const response = await fetch("/api/turnstile/site-key");
        const data = (await response.json()) as { siteKey?: string | null };

        if (!cancelled) {
          setTurnstileSiteKey(data.siteKey ?? null);
        }
      } catch {
        if (!cancelled) {
          setTurnstileSiteKey(null);
        }
      } finally {
        if (!cancelled) {
          setTurnstileConfigLoading(false);
        }
      }
    }

    loadTurnstileConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (skipInitialScrollRef.current) {
      skipInitialScrollRef.current = false;
      return;
    }

    requestAnimationFrame(() => {
      flowTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [currentStep, isComplete]);

  useEffect(() => {
    if (!draft.date || !selectedService) {
      setUnavailableSlots([]);
      setAvailabilityLoading(false);
      setAvailabilityError("");
      return;
    }

    let cancelled = false;

    async function loadAvailability() {
      setAvailabilityLoading(true);
      setAvailabilityError("");

      try {
        const params = new URLSearchParams({
          date: draft.date!,
          durationMinutes: String(selectedService!.durationMinutes),
        });
        const response = await fetch(`/api/bookings/availability?${params}`);
        const data = (await response.json()) as {
          unavailableSlots?: string[];
          error?: string;
        };

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setUnavailableSlots([]);
          setAvailabilityError(form.datetime.loadError);
          return;
        }

        const nextUnavailable = data.unavailableSlots ?? [];
        setUnavailableSlots(nextUnavailable);

        setDraft((prev) => {
          if (prev.time && nextUnavailable.includes(prev.time)) {
            return { ...prev, time: null };
          }
          return prev;
        });
      } catch {
        if (!cancelled) {
          setUnavailableSlots([]);
          setAvailabilityError(form.datetime.loadError);
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [draft.date, selectedService?.id, selectedService?.durationMinutes]);

  const updateDraft = (patch: Partial<BookingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const goToStep = (step: BookingStepId) => {
    setSubmitError("");
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setCurrentStep(step);
  };

  const goBack = () => {
    const index = stepOrder.indexOf(currentStep);
    if (index > 0) {
      if (currentStep === "review") {
        resetTurnstile();
      }
      goToStep(stepOrder[index - 1]);
    }
  };

  const goNext = () => {
    const index = stepOrder.indexOf(currentStep);
    if (index < stepOrder.length - 1) {
      goToStep(stepOrder[index + 1]);
    }
  };

  const handleContinue = () => {
    setSubmitError("");

    if (currentStep === "service" && !draft.serviceId) {
      return;
    }

    if (currentStep === "datetime" && (!draft.date || !draft.time)) {
      return;
    }

    if (currentStep === "details") {
      setDetailsSubmitted(true);
      setDetailsTouched({ name: true, phone: true, email: true, notes: true });
      const nextErrors = validateBookingDetails(draft);
      setDetailsErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        return;
      }
    }

    goNext();
  };

  const handleSubmit = async () => {
    if (!selectedService || !draft.serviceId || !draft.date || !draft.time) {
      return;
    }

    if (!turnstileToken) {
      setSubmitError(form.turnstileRequired);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sanitizeBookingDetails(draft),
          serviceId: draft.serviceId,
          date: draft.date,
          time: draft.time,
          turnstileToken,
          companyWebsite,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        errors?: Partial<Record<keyof BookingDetailsPayload, string>>;
      };

      if (!response.ok) {
        if (data.errors) {
          setDetailsErrors(data.errors);
        }
        setSubmitError(data.error ?? form.error);
        resetTurnstile();
        if (response.status === 409) {
          setCurrentStep("datetime");
        }
        return;
      }

      setCompletedSummary({
        serviceName: selectedService.name,
        date: draft.date,
        time: draft.time,
        name: draft.name,
      });
      setDraft(initialDraft);
      setDetailsErrors({});
      setDetailsTouched({});
      setDetailsSubmitted(false);
      resetTurnstile();
      setIsComplete(true);
    } catch {
      setSubmitError(form.error);
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setDraft(initialDraft);
    setCompletedSummary(null);
    setDetailsErrors({});
    setDetailsTouched({});
    setDetailsSubmitted(false);
    setSubmitError("");
    setIsComplete(false);
    setCurrentStep("service");
    setUnavailableSlots([]);
    setAvailabilityLoading(false);
    setAvailabilityError("");
    resetTurnstile();
  };

  const canContinue =
    (currentStep === "service" && Boolean(draft.serviceId)) ||
    (currentStep === "datetime" && Boolean(draft.date && draft.time)) ||
    currentStep === "details" ||
    currentStep === "review";

  const renderTimeGroup = (
    label: string,
    slots: string[],
  ) => {
    if (slots.length === 0) {
      return null;
    }

    return (
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
          {label}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {slots.map((slot) => {
            const isUnavailable = unavailableSlots.includes(slot);
            const isSelected = draft.time === slot;

            return (
              <button
                key={slot}
                type="button"
                disabled={isUnavailable || availabilityLoading}
                onClick={() => {
                  if (!isUnavailable) {
                    updateDraft({ time: slot });
                  }
                }}
                aria-disabled={isUnavailable}
                title={isUnavailable ? form.datetime.unavailable : undefined}
                className={[
                  "rounded-lg border px-1.5 py-2.5 text-xs font-medium transition-all duration-300 sm:px-2 sm:text-sm",
                  isUnavailable
                    ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-white/25 line-through decoration-white/20"
                    : isSelected
                      ? "border-gold bg-gold text-[#0a0a0a] shadow-[0_0_16px_rgba(212,175,55,0.35)]"
                      : "border-gold/15 bg-black/30 text-white/75 hover:border-gold/35 hover:text-white",
                  availabilityLoading && !isUnavailable ? "opacity-70" : "",
                ].join(" ")}
              >
                {formatBookingTime(slot)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDetailsField = (
    key: keyof BookingDetailsPayload,
    type: "text" | "tel" | "email" | "textarea",
    config: { label: string; placeholder: string; required?: boolean; maxLength?: number },
  ) => {
    const hasError = Boolean(
      detailsErrors[key] && (detailsTouched[key] || detailsSubmitted),
    );

    return (
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
          {config.label}
          {config.required && <span className="text-gold"> *</span>}
        </label>
        {type === "textarea" ? (
          <textarea
            rows={4}
            maxLength={config.maxLength}
            value={draft[key]}
            onChange={(event) => {
              updateDraft({ [key]: event.target.value });
              if (detailsTouched[key] || detailsSubmitted) {
                setDetailsErrors(validateBookingDetails({ ...draft, [key]: event.target.value }));
              }
            }}
            onBlur={() => {
              setDetailsTouched((prev) => ({ ...prev, [key]: true }));
              setDetailsErrors(validateBookingDetails(draft));
            }}
            placeholder={config.placeholder}
            className={`${inputClassName} resize-none ${hasError ? inputErrorClassName : ""}`}
          />
        ) : (
          <input
            type={type}
            maxLength={config.maxLength}
            value={draft[key]}
            onChange={(event) => {
              updateDraft({ [key]: event.target.value });
              if (detailsTouched[key] || detailsSubmitted) {
                setDetailsErrors(validateBookingDetails({ ...draft, [key]: event.target.value }));
              }
            }}
            onBlur={() => {
              setDetailsTouched((prev) => ({ ...prev, [key]: true }));
              setDetailsErrors(validateBookingDetails(draft));
            }}
            placeholder={config.placeholder}
            className={`${inputClassName} ${hasError ? inputErrorClassName : ""}`}
          />
        )}
        {hasError && (
          <p className="mt-2 text-xs text-red-400/90" role="alert">
            {detailsErrors[key]}
          </p>
        )}
      </div>
    );
  };

  if (isComplete && completedSummary) {
    return (
      <div
        ref={flowTopRef}
        className="scroll-mt-24 rounded-2xl border border-gold/20 bg-[#111111] p-6 text-center backdrop-blur-sm sm:bg-white/[0.03] sm:p-10"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-2xl text-gold">
          ✓
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
          {form.success.title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60">
          {form.success.message}
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-xl border border-gold/15 bg-black/30 p-5 text-left text-sm">
          <p className="font-semibold text-white">{completedSummary.serviceName}</p>
          <p className="mt-2 text-white/55">
            {formatBookingDate(completedSummary.date)} at{" "}
            {formatBookingTime(completedSummary.time)}
          </p>
          <p className="mt-1 text-white/40">{completedSummary.name}</p>
        </div>

        <button
          type="button"
          onClick={resetBooking}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(212,175,55,0.45)] sm:w-auto"
        >
          {form.success.newBooking}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={flowTopRef}
      className="relative scroll-mt-24 min-w-0 rounded-2xl border border-gold/20 bg-[#111111] p-4 backdrop-blur-sm sm:bg-white/[0.03] sm:p-6 md:p-8"
    >
      {isSubmitting && (
        <BookingLoadingOverlay
          title={form.actions.submitting}
          detail={form.actions.submittingDetail}
        />
      )}

      <StepIndicator currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === "service" && (
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {form.service.title}
            </h2>
            <p className="mt-2 text-sm text-white/55">{form.service.subtitle}</p>

            <div className="mt-6 grid gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => updateDraft({ serviceId: service.id })}
                  className={selectionClassName(draft.serviceId === service.id)}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{service.name}</p>
                      <p className="mt-1 text-sm text-white/50">{service.description}</p>
                    </div>
                    <span className="w-fit shrink-0 rounded-full border border-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold-light">
                      {service.durationMinutes} min
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === "datetime" && (
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {form.datetime.title}
            </h2>
            <p className="mt-2 text-sm text-white/55">{form.datetime.subtitle}</p>

            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
                {form.datetime.dateLabel}
              </p>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {availableDates.map((date) => (
                  <button
                    key={date.key}
                    type="button"
                    onClick={() => updateDraft({ date: date.key, time: null })}
                    className={[
                      "min-w-[4.25rem] shrink-0 rounded-xl border px-2.5 py-2.5 text-center transition-all duration-300 sm:min-w-[4.75rem] sm:px-3 sm:py-3",
                      draft.date === date.key
                        ? "border-gold bg-gold text-[#0a0a0a]"
                        : "border-gold/15 bg-black/30 text-white/75 hover:border-gold/35",
                    ].join(" ")}
                  >
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.14em]">
                      {date.weekday}
                    </span>
                    <span className="mt-1 block text-sm font-bold">{date.monthDay}</span>
                    {date.isToday && (
                      <span
                        className={[
                          "mt-1 block text-[10px] uppercase tracking-[0.12em]",
                          draft.date === date.key ? "text-[#0a0a0a]/70" : "text-gold/70",
                        ].join(" ")}
                      >
                        Today
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
                  {form.datetime.timeLabel}
                </p>
                {availabilityLoading && (
                  <p className="text-xs text-white/40">{form.datetime.loadingTimes}</p>
                )}
              </div>

              {!draft.date ? (
                <p className="rounded-xl border border-gold/10 bg-black/20 px-4 py-6 text-center text-sm text-white/45">
                  Select a date first to see available times.
                </p>
              ) : (
                <div className="relative min-h-[12rem]">
                  {availabilityLoading && (
                    <BookingLoadingOverlay title={form.datetime.loadingOverlay} />
                  )}

                  {availabilityError && !availabilityLoading && (
                    <div
                      className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200/90"
                      role="alert"
                    >
                      {availabilityError}
                    </div>
                  )}

                  {renderTimeGroup(form.datetime.morning, groupedSlots.morning)}
                  {renderTimeGroup(form.datetime.afternoon, groupedSlots.afternoon)}
                  {renderTimeGroup(form.datetime.evening, groupedSlots.evening)}
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === "details" && (
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {form.details.title}
            </h2>
            <p className="mt-2 text-sm text-white/55">{form.details.subtitle}</p>

            <div className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {renderDetailsField("name", "text", {
                  label: form.details.fields.name.label,
                  placeholder: form.details.fields.name.placeholder,
                  required: true,
                  maxLength: 80,
                })}
                {renderDetailsField("phone", "tel", {
                  label: form.details.fields.phone.label,
                  placeholder: form.details.fields.phone.placeholder,
                  required: true,
                  maxLength: 20,
                })}
              </div>

              {renderDetailsField("email", "email", {
                label: form.details.fields.email.label,
                placeholder: form.details.fields.email.placeholder,
                required: true,
                maxLength: 254,
              })}

              {renderDetailsField("notes", "textarea", {
                label: form.details.fields.notes.label,
                placeholder: form.details.fields.notes.placeholder,
                maxLength: 500,
              })}
            </div>
          </div>
        )}

        {currentStep === "review" && selectedService && draft.date && draft.time && (
          <div className="relative">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {form.review.title}
            </h2>
            <p className="mt-2 text-sm text-white/55">{form.review.subtitle}</p>

            <dl className="mt-8 space-y-4 rounded-xl border border-gold/15 bg-black/30 p-5">
              {[
                [form.review.labels.service, selectedService.name],
                [form.review.labels.duration, `${selectedService.durationMinutes} minutes`],
                [form.review.labels.date, formatBookingDate(draft.date)],
                [form.review.labels.time, formatBookingTime(draft.time)],
                [form.review.labels.name, draft.name],
                [form.review.labels.phone, draft.phone],
                [form.review.labels.email, draft.email],
                ...(draft.notes
                  ? [[form.review.labels.notes, draft.notes] as const]
                  : []),
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 border-b border-gold/10 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:justify-between"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-light">
                    {label}
                  </dt>
                  <dd className="break-words text-sm text-white/80 sm:max-w-[60%] sm:text-right">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-xs text-white/40">
              Submit your request and Imar will confirm your appointment shortly.
            </p>

            <div
              className="absolute left-[-9999px] h-px w-px overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="booking-companyWebsite">Company website</label>
              <input
                id="booking-companyWebsite"
                name="companyWebsite"
                type="text"
                value={companyWebsite}
                onChange={(event) => setCompanyWebsite(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {turnstileConfigLoading ? (
              <div className="mt-6 rounded-xl border border-gold/15 bg-black/30 px-4 py-6 text-center text-sm text-white/50">
                Loading security verification...
              </div>
            ) : turnstileSiteKey ? (
              <div className="mt-6 flex justify-center overflow-hidden rounded-xl border border-gold/15 bg-black/30 p-3">
                <div className="max-w-full origin-top scale-[0.92] sm:scale-100">
                  <Turnstile
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey}
                  onSuccess={setTurnstileToken}
                  onExpire={resetTurnstile}
                  onError={resetTurnstile}
                  options={{
                    theme: "dark",
                    appearance: "always",
                  }}
                />
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm text-red-300" role="alert">
                Security verification is not configured. Please try again later.
              </p>
            )}
          </div>
        )}
      </div>

      {submitError && (
        <div
          className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={currentStep === "service" || isSubmitting}
          className="order-2 inline-flex w-full items-center justify-center rounded-full border border-gold/25 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-gold transition-all duration-300 hover:border-gold/50 hover:bg-gold/5 disabled:cursor-not-allowed disabled:opacity-40 sm:order-1 sm:w-auto"
        >
          {form.actions.back}
        </button>

        {currentStep === "review" ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !turnstileToken || !turnstileSiteKey}
            className="order-1 inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(212,175,55,0.45)] disabled:cursor-not-allowed disabled:opacity-60 sm:order-2 sm:w-auto"
          >
            {isSubmitting ? form.actions.submitting : form.actions.confirm}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="order-1 inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(212,175,55,0.45)] disabled:cursor-not-allowed disabled:opacity-60 sm:order-2 sm:w-auto"
          >
            {form.actions.continue}
          </button>
        )}
      </div>
    </div>
  );
}
