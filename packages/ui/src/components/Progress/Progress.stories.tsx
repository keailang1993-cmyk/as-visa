import { Button } from "../Button";
import { CompletionCard, MissionProgress, StatusBadge, StepIndicator, Timeline } from "./Progress";

export default { title: "NOIR/Progress" };

export function ProgressStates() {
  return (
    <div className="noir-scope noir-stack noir-story-frame">
      <Timeline steps={[{ id: "1", label: "Upload passport", status: "complete" }, { id: "2", label: "Confirm travel purpose", status: "active" }]} />
      <MissionProgress label="Mission progress" value={48} />
      <StatusBadge status="active" />
      <StepIndicator current={2} total={5} />
      <CompletionCard title="Mission complete" description="The next mission is ready." action={<Button>Continue</Button>} />
    </div>
  );
}
