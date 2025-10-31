// src/lib/routes/admin/routes.ts
import bcrypt from "bcrypt";
import { executeResult, queryRows } from "../../db/connection";
import {
  Admin,
  ListOptions,
  NewAdminInput,
  PagedResult,
  AdminRow,
} from "../../types";
import { orderBy, paginate, sanitizeLike } from "../../utils";
import type { RowDataPacket } from "mysql2";

/** COUNT(*) sonucu için tip */
interface CountRow extends RowDataPacket {
  total: number;
}

/**
 * Admin listesi (arama + sıralama + sayfalama)
 * allowed sort columns: id, name, email, role, created_at, updated_at
 */
export async function listAdmins(opts?: ListOptions): Promise<PagedResult<Admin>> {
  const { page, limit, offset } = paginate(opts);
  const like = sanitizeLike(opts?.search);
  const { column, direction } = orderBy(opts?.sort, opts?.order, [
    "id",
    "name",
    "email",
    "role",
    "created_at",
    "updated_at",
  ]);

  const where = like
    ? "WHERE (a.name LIKE :q ESCAPE '\\\\' OR a.email LIKE :q ESCAPE '\\\\')"
    : "";
  const params = like ? { q: like, limit, offset } : { limit, offset };

  const [rows] = await queryRows<AdminRow[]>(
    `
    SELECT a.id, a.name, a.email, a.role, a.password_hash, a.is_active, a.created_at, a.updated_at
    FROM admins a
    ${where}
    ORDER BY ${column} ${direction.toUpperCase()}
    LIMIT :limit OFFSET :offset
    `,
    params
  );

  const [countRows] = await queryRows<CountRow[]>(
    `
    SELECT COUNT(*) as total
    FROM admins a
    ${where}
    `,
    like ? { q: like } : {}
  );

  const data = rows as unknown as Admin[];
  return { data, page, limit, total: countRows[0]?.total ?? 0 };
}

/** Yeni admin oluşturur — düz şifre geldiyse hash'ler */
export async function createAdmin(input: NewAdminInput): Promise<Admin> {
  const payload = {
    name: input.name,
    email: input.email,
    role: input.role ?? "editor",
    password_hash: input.password_hash ? await bcrypt.hash(input.password_hash, 10) : null,
    is_active: input.is_active ?? 1,
  };

  const [result] = await executeResult(
    `
    INSERT INTO admins (name, email, role, password_hash, is_active, created_at, updated_at)
    VALUES (:name, :email, :role, :password_hash, :is_active, NOW(), NOW())
    `,
    payload
  );

  const insertId = Number(result.insertId);
  const [rows] = await queryRows<AdminRow[]>(
    `SELECT * FROM admins WHERE id = :id`,
    { id: insertId }
  );
  return rows[0] as unknown as Admin;
}
