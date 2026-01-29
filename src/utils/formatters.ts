/**
 * Formats a date string into a human-readable Arabic/English format.
 * Returns an empty string if the date is invalid or missing.
 * يقوم بتنسيق سلسلة التاريخ لتصبح قابلة للقراءة بشكل جيد.
 * يعود بسلسلة فارغة إذا كان التاريخ غير صالح أو غير موجود.
 */
export function formatEndDateArabic(dateString: string | null | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return (
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}
