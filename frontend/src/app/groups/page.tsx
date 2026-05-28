import AppShell from "@/components/layout/AppShell";
import GroupsContent from "./GroupsContent";

export default function GroupsPage() {
  return (
    <AppShell topBarTitle="My Groups" showBack={false}>
      <GroupsContent />
    </AppShell>
  );
}
