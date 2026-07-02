import { CountrySelector, DatePicker, OTPInput, PhoneInput, SearchInput, Textarea, TextInput } from "./Inputs";

export default { title: "NOIR/Inputs" };

export function AllInputs() {
  return (
    <div className="noir-scope noir-stack noir-story-frame">
      <TextInput label="Full name" placeholder="Applicant name" />
      <PhoneInput label="Phone" placeholder="Enter phone number" />
      <OTPInput label="Verification code" value="123" />
      <SearchInput label="Search" />
      <Textarea label="Notes" placeholder="Add context" />
      <CountrySelector label="Destination" options={[{ label: "United States", value: "US" }]} />
      <DatePicker label="Travel date" />
    </div>
  );
}
