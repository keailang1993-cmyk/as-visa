import { Button } from "../Button";
import { CameraGuide, DocumentPreview, OCRResult, RetryUpload, UploadArea, UploadQueue } from "./Upload";

export default { title: "NOIR/Upload" };

export function UploadStates() {
  return (
    <div className="noir-scope noir-stack noir-story-frame">
      <UploadArea title="Upload passport" description="PDF, JPG, or PNG" action={<Button>Choose file</Button>} />
      <UploadQueue items={[{ id: "1", name: "passport.pdf", status: "uploading", progress: 72 }]} />
      <CameraGuide title="Use natural light" description="Keep all corners visible." />
      <DocumentPreview name="passport.pdf" />
      <OCRResult title="Extracted details" fields={[{ label: "Applicant", value: "Verified" }]} />
      <RetryUpload />
    </div>
  );
}
