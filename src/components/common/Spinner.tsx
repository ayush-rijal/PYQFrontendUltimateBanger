import Loading from "@/loading/Loading";

export default function Spinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex  justify-center text-4xl items-center gap-2"
    >
      <Loading />
    </div>
  );
}
