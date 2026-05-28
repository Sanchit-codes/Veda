import AppShell from "@/components/layout/AppShell";
import GeneratingManager from "./GeneratingManager";

export default function GeneratingPage() {
  return (
    <AppShell topBarTitle="Generating" showBack={false}>
      <GeneratingManager />
    </AppShell>
  );
}
