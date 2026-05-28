import AppShell from "@/components/layout/AppShell";
import CreateAssignmentWizard from "./CreateAssignmentWizard";

export default function NewAssignmentPage() {
  return (
    <AppShell topBarTitle="Assignment" showBack>
      <CreateAssignmentWizard />
    </AppShell>
  );
}
