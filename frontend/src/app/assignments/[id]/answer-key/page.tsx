import AppShell from "@/components/layout/AppShell";
import AnswerKeyContent from "./AnswerKeyContent";

export default function AnswerKeyPage() {
  return (
    <AppShell topBarTitle="Answer Key" showBack pageBg="#e6e6e6">
      <AnswerKeyContent />
    </AppShell>
  );
}
