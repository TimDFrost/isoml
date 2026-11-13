import { InterviewRoom } from "@/components/interview/InterviewRoom";

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionId = Number(id);
  return <InterviewRoom sessionId={Number.isFinite(sessionId) ? sessionId : 1} />;
}
