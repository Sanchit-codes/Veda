import AppShell from "@/components/layout/AppShell";
import LibraryContent from "./LibraryContent";

export default function LibraryPage() {
  return (
    <AppShell topBarTitle="My Library" showBack={false}>
      <LibraryContent />
    </AppShell>
  );
}
