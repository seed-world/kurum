// src/lib/routes/admin/[id]/routes.ts
import bcrypt from "bcrypt";
import { executeResult, queryRows } from "../../../db/connection";
import { Admin, UpdateAdminInput, AdminRow } from "../../../types";
import { parseId, pick } from "../../../utils";

/** Tek admin getirir */
export async function getAdminById(id: number | string): Promise<Admin | null> {
  const adminId = parseId(id);
  const [rows] = await queryRows<AdminRow[]>(
    `SELECT * FROM admins WHERE id = :id`,
    { id: adminId }
  );
  return (rows[0] as unknown as Admin) ?? null;
}

/** Admin günceller — password_hash alanı düz şifre verilirse hash'lenir */
export async function updateAdmin(
  id: number | string,
  input: UpdateAdminInput
): Promise<Admin | null> {
  const adminId = parseId(id);

  const allowed = pick(input, ["name", "email", "role", "password_hash", "is_active"]);
  if (allowed.password_hash) {
    allowed.password_hash = await bcrypt.hash(String(allowed.password_hash), 10);
  }

  const keys = Object.keys(allowed);
  if (keys.length === 0) return await getAdminById(adminId);

  const setSql = keys.map(k => `${k} = :${k}`).join(", ");

  await executeResult(
    `UPDATE admins SET ${setSql}, updated_at = NOW() WHERE id = :id`,
    { id: adminId, ...allowed }
  );

  return await getAdminById(adminId);
}

/** Admin siler (hard delete) */
export async function deleteAdmin(id: number | string): Promise<{ deleted: boolean }> {
  const adminId = parseId(id);
  const [res] = await executeResult(
    `DELETE FROM admins WHERE id = :id`,
    { id: adminId }
  );
  return { deleted: res.affectedRows > 0 };
}
