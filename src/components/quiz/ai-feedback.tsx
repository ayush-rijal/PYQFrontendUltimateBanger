import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AiFeedbackProps {
  feedback: string;
}

export function AiFeedback({ feedback }: AiFeedbackProps) {
  return (
    <Card className="mt-4 w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">AI Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-line">{feedback}</p>
      </CardContent>
    </Card>
  );
}
