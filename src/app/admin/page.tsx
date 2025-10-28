// File: src/app/admin/page.tsx


import Card from "./components/Card";
import Table from "./components/Table";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Toplam Kullanıcı", value: "1,274" },
    { title: "Aktif Admin", value: "3" },
  ];

  const rows = [
    { id: 1, name: "Adem Karaveli", role: "superadmin", email: "ademkaraveli34@gmail.com" },
    { id: 2, name: "Yiğithan", role: "editor", email: "y@example.com" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.title} title={s.title} value={s.value} />
        ))}
      </div>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Son Adminler</h2>
        <Table
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "İsim" },
            { key: "role", label: "Rol" },
            { key: "email", label: "E-posta" },
          ]}
          rows={rows}
        />
      </section>
    </div>
  );
}
