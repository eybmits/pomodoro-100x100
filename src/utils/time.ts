export function nowIso(): string {
  return new Date().toISOString();
}

export function formatSeconds(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const min = Math.floor(clamped / 60)
    .toString()
    .padStart(2, "0");
  const sec = (clamped % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}
