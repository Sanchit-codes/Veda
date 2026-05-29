import AppShell from "@/components/layout/AppShell";
import DashboardContent from "./dashboard/DashboardContent";

export default function Home() {
  return (
    <AppShell topBarTitle="Home" showBack={false}>
      <DashboardContent />
    </AppShell>
  );
}
