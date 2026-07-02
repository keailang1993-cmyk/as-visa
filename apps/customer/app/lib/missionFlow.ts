export const missionStorageKey = "as-visa-current-mission-index";

// This is MVP mock data.
// Later it will be replaced by Rule Engine generated document checklist.
export const missionFlow = [
  {
    title: "上传护照",
    documentName: "护照",
    uploadTitle: "请上传护照",
    uploadDescription: "请确保照片清晰、四角完整、没有反光。",
    guide: "请将护照平放，确保整页信息完整清晰。",
    detectedLabel: "已识别护照",
    successTitle: "护照已收到，正在准备初步检查。"
  },
  {
    title: "上传身份证",
    documentName: "身份证",
    uploadTitle: "请上传身份证",
    uploadDescription: "请确保身份证信息清晰、边缘完整、没有遮挡。",
    guide: "请将身份证放在平整表面，确保文字清楚可读。",
    detectedLabel: "已识别身份证",
    successTitle: "身份证已收到，正在准备初步检查。"
  },
  {
    title: "上传银行流水",
    documentName: "银行流水",
    uploadTitle: "请上传银行流水",
    uploadDescription: "请上传清晰的银行流水照片或 PDF 文件。",
    guide: "请确保姓名、银行名称和近期交易记录清晰可见。",
    detectedLabel: "已识别银行流水",
    successTitle: "银行流水已收到，正在准备初步检查。"
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
