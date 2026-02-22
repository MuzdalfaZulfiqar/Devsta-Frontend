export default function AssessmentTimer({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="font-semibold text-red-600 text-sm">
      Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}