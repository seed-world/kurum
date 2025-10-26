// File: src/app/admin/components/Table.tsx

type Column = { key: string; label: string };
type Row = Record<string, any>;

export default function Table({ columns, rows }: { columns: Column[]; rows: Row[] }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left bg-neutral-50">
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 border-b border-neutral-200">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-neutral-50">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 border-b border-neutral-100">
                  {String(r[c.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
