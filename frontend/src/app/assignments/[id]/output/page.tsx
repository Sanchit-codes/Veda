import AppShell from "@/components/layout/AppShell";
import OutputContent from "./OutputContent";

export default function OutputPage() {
  return (
    <AppShell topBarTitle="Create New" showBack pageBg="#e6e6e6">
      <OutputContent />
    </AppShell>
  );
}
