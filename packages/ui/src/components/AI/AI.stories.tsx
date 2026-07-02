import { AIAssistant, AISuggestion, AISummary, AIThinking, AITip, AIWarning } from "./AI";

export default { title: "NOIR/AI" };

export function AIStates() {
  return (
    <div className="noir-scope noir-stack noir-story-frame">
      <AIAssistant title="Assistant" description="I will guide the next mission." />
      <AITip title="Tip" description="Use the full passport page." />
      <AISuggestion title="Suggestion" description="Confirm travel dates before uploading itinerary." />
      <AIWarning title="Warning" description="This document may be expired." />
      <AISummary title="Summary" description="All required identity documents are ready." />
      <AIThinking />
    </div>
  );
}
