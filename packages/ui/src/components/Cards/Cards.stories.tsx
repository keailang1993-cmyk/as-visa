import { AICard, DocumentCard, MissionCard, NotificationCard, ProfileCard, ProgressCard, StatusCard, UploadCard } from "./Cards";

export default { title: "NOIR/Cards" };

export function AllCards() {
  return (
    <div className="noir-scope noir-stack noir-story-frame">
      <MissionCard title="Confirm travel purpose" description="The next guided mission for this case." meta="Mission" />
      <UploadCard title="Passport bio page" description="Upload a clear image or PDF." />
      <AICard title="AI review" description="Suggested next step based on current documents." />
      <ProgressCard title="Case progress" value={64} description="Documents are being reviewed." />
      <DocumentCard title="Employment letter" description="Required document template." />
      <NotificationCard title="Action needed" description="A document requires clarification." />
      <StatusCard title="Ready for review" description="All current requirements are complete." tone="success" />
      <ProfileCard title="AS VISA Applicant" description="Primary applicant" />
    </div>
  );
}
