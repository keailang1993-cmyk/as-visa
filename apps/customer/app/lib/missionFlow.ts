export const missionStorageKey = "as-visa-current-mission-index";

export const missionFlow = [
  {
    title: "Upload Passport",
    uploadTitle: "Passport photo",
    uploadDescription: "Use your camera or upload a clear passport photo.",
    guide: "Place the passport on a flat surface with all corners visible.",
    detectedLabel: "Passport detected.",
    successTitle: "Passport uploaded"
  },
  {
    title: "Upload ID",
    uploadTitle: "ID photo",
    uploadDescription: "Use your camera or upload a clear ID photo.",
    guide: "Keep the full ID inside the frame with text readable.",
    detectedLabel: "ID detected.",
    successTitle: "ID uploaded"
  },
  {
    title: "Upload Bank",
    uploadTitle: "Bank statement",
    uploadDescription: "Upload a clear bank statement photo or PDF.",
    guide: "Make sure name, bank, and recent transactions are visible.",
    detectedLabel: "Bank statement detected.",
    successTitle: "Bank statement uploaded"
  }
] as const;

export type MissionItem = (typeof missionFlow)[number];

export function getStoredMissionIndex() {
  if (typeof window === "undefined") return 0;

  const rawValue = window.localStorage.getItem(missionStorageKey);
  const parsedValue = rawValue ? Number.parseInt(rawValue, 10) : 0;

  if (Number.isNaN(parsedValue)) return 0;
  return Math.min(Math.max(parsedValue, 0), missionFlow.length);
}

export function setStoredMissionIndex(index: number) {
  window.localStorage.setItem(
    missionStorageKey,
    String(Math.min(Math.max(index, 0), missionFlow.length))
  );
}

export function getCurrentMission() {
  const index = getStoredMissionIndex();
  return {
    index,
    mission: missionFlow[index],
    isComplete: index >= missionFlow.length
  };
}
