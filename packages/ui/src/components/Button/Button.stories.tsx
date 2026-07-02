import { Search } from "../../icons";
import { Button, GhostButton, IconButton, LoadingButton, SecondaryButton, TextButton } from "./Button";

export default { title: "NOIR/Button" };

export function AllButtons() {
  return (
    <div className="noir-scope noir-row">
      <Button>Continue mission</Button>
      <SecondaryButton>Review</SecondaryButton>
      <GhostButton>Skip</GhostButton>
      <TextButton>Learn more</TextButton>
      <LoadingButton>Checking</LoadingButton>
      <IconButton icon={<Search size={16} />} label="Search" variant="secondary" />
    </div>
  );
}
