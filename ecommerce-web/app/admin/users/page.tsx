"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/common/EmptyState";
import type { User } from "@/types/user.type";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users")
      .then((res) => setUsers(res.data.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
      <p className="text-sm text-gray-500">{users.length} người dùng</p>

      {loading ? (
        <div className="mt-6 animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-lg bg-gray-200" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="mt-6"><EmptyState message="Chưa có người dùng" icon="👥" /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === "ADMIN" ? "bg-red-100 text-red-700" :
                      user.role === "SELLER" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.createdAt ? formatDate(user.createdAt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
