// File: src/app/admin/components/Card.tsx

export default function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
