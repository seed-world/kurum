// src/lib/types.ts
import type { RowDataPacket } from "mysql2";

/** Sıralama yönü */
export type Order = "asc" | "desc";

// --- PRODUCTS ---
export interface ProductRow extends RowDataPacket {
  id: number;
  product_type: string;
  variety: string;
  sub_type: string | null;
  code: string;
  region: string | null;
  germination_start_year: number | null;

  seeds_2023: number | null;
  seeds_2024: number | null;
  seeds_2025_expected: number | null;
  annual_growth_factor: number | null;

  seedling_unit_price: number | null;
  asset_value_2023: number | null;
  asset_value_2024: number | null;
  asset_value_2025: number | null;

  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

export type Product = {
  id: number;
  product_type: string;
  variety: string;
  sub_type: string | null;
  code: string;
  region: string | null;
  germination_start_year: number | null;

  seeds_2023: number | null;
  seeds_2024: number | null;
  seeds_2025_expected: number | null;
  annual_growth_factor: number | null;

  seedling_unit_price: number | null;
  asset_value_2023: number | null;
  asset_value_2024: number | null;
  asset_value_2025: number | null;

  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
};

export type NewProductInput = Partial<Omit<Product, "id" | "created_at" | "updated_at">> & {
  product_type: string;
  variety: string;
  code: string;
};

export type UpdateProductInput = Partial<Omit<Product, "id" | "created_at" | "updated_at">>;


/** MySQL satır tipleri (RowDataPacket'i extend eder) */
export interface AdminRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: "superadmin" | "editor" | "viewer";
  password_hash: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

/** Listeleme opsiyonları */
export type ListOptions = {
  page?: number;        // 1-based
  limit?: number;       // default 20
  search?: string;      // isim/email vb.
  sort?: string;        // whitelist ile kullanılacak
  order?: Order;
};

/** Sayfalı sonuç şablonu */
export type PagedResult<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

/** DB hata yapısı (istersen kullan) */
export type DBError = {
  code: string;
  message: string;
};

/** Domain tipleri (uygulama içi) */
export type Admin = {
  id: number;
  name: string;
  email: string;
  role: "superadmin" | "editor" | "viewer";
  password_hash: string | null;
  is_active: 0 | 1;
  created_at: string; // ISO
  updated_at: string; // ISO
};

export type NewAdminInput = {
  name: string;
  email: string;
  role?: Admin["role"];
  /** Düz şifre gelirse backend hash'leyecek (create/update içinde) */
  password_hash?: string | null;
  is_active?: 0 | 1;
};

export type UpdateAdminInput = Partial<Omit<NewAdminInput, "email">> & {
  email?: string;
};

export type AppUser = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
};

export type NewUserInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  is_active?: 0 | 1;
};

export type UpdateUserInput = Partial<NewUserInput>;
