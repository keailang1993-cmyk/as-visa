import { defaultMissionFlow, type MissionItem } from "@as-visa/rule-engine";

export const missionStorageKey = "as-visa-current-mission-index";

// Mission data now comes from the Rule Engine foundation.
// The current default rules are MVP sample rules until backend rule selection is connected.
export const missionFlow = defaultMissionFlow;

export type CurrentMission =
  | {
      index: number;
      mission: MissionItem;
      isComplete: false;
    }
  | {
      index: number;
      mission: undefined;
      isComplete: true;
    };

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

export function getCurrentMission(): CurrentMission {
  const index = getStoredMissionIndex();
  const mission = missionFlow[index];

  if (!mission) {
    return {
      index,
      mission: undefined,
      isComplete: true
    };
  }

  return {
    index,
    mission,
    isComplete: false
  };
}
