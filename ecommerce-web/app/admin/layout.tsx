import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-130px)]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto bg-gray-50 p-6">{children}</div>
    </div>
  );
}
