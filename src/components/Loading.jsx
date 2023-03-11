export default function Loading() {
  return (
    <div className="flex gap-2">
      <div className="w-2 bg-black aspect-square rounded-full animate-bouncing-1" />
      <div className="w-2 bg-black aspect-square rounded-full animate-bouncing-2" />
      <div className="w-2 bg-black aspect-square rounded-full animate-bouncing-3" />
    </div>
  );
}
