export function addComplaintsToOverview(overview, complaints) {
  const normalizedComplaints = complaints?.trim();
  if (!normalizedComplaints) return overview;
  return `Скарги: ${normalizedComplaints}\n\n${overview}`;
}
