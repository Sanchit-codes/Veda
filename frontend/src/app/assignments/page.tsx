import AppShell from "@/components/layout/AppShell";
import AssignmentsContent from "./AssignmentsContent";

export default function AssignmentsPage() {
  return (
    <AppShell topBarTitle="Assignments" showBack={false}>
      <AssignmentsContent />
    </AppShell>
  );
}
