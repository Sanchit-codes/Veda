import AppShell from "@/components/layout/AppShell";
import ToolkitContent from "./ToolkitContent";

export default function ToolkitPage() {
  return (
    <AppShell topBarTitle="AI Teacher's Toolkit" showBack={false}>
      <ToolkitContent />
    </AppShell>
  );
}
