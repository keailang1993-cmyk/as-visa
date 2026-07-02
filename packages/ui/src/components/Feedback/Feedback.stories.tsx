import { Button } from "../Button";
import { BottomSheet, Dialog, EmptyState, ErrorState, Loading, Skeleton, SuccessState, Toast } from "./Feedback";

export default { title: "NOIR/Feedback" };

export function FeedbackStates() {
  return (
    <div className="noir-scope noir-stack noir-story-frame">
      <Loading />
      <Skeleton label="Loading card" />
      <EmptyState title="No missions yet" description="The next mission will appear here." action={<Button>Refresh</Button>} />
      <ErrorState title="Could not load" description="Please try again." />
      <SuccessState title="Saved" description="Your progress is stored." />
      <Toast title="Document uploaded" description="AI review has started." />
      <Dialog open inline title="Confirm action">This is a reusable dialog.</Dialog>
      <BottomSheet open title="More options">Reusable mobile sheet content.</BottomSheet>
    </div>
  );
}
