import { FileText, User } from "../../icons";
import { BackButton, BottomNavigation, Header, ProfileMenu } from "./Navigation";

export default { title: "NOIR/Navigation" };

export function NavigationStates() {
  return (
    <div className="noir-scope noir-stack">
      <Header leading={<BackButton />} title="Current mission" />
      <ProfileMenu name="AS VISA Applicant" />
      <BottomNavigation inline items={[{ id: "mission", label: "Mission", icon: <FileText size={16} />, active: true }, { id: "profile", label: "Profile", icon: <User size={16} /> }]} />
    </div>
  );
}
