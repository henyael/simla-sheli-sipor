// Anonymous per-device identifier stored in localStorage.
// Used to scope library access without requiring a login.

const KEY = "bedtime.device_id";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
