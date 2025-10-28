import type { RowDataPacket } from "mysql2";

/** Sıralama yönü (önceki "Order" ad çakışmasını çözdük) */
export type OrderDirection = "asc" | "desc";

/* -------------------- CATEGORIES -------------------- */
export interface CategoryRow extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
  image_path: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

export type Category = {
  id: number;
  name: string;
  description: string | null;
  image_path: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
  product_count?: number;
};

export type NewCategoryInput = Partial<
  Omit<Category, "id" | "created_at" | "updated_at" | "product_count">
> & { name: string };

export type UpdateCategoryInput = Partial<
  Omit<Category, "id" | "created_at" | "updated_at" | "product_count">
>;

/* -------------------- PRODUCTS -------------------- */
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

  is_featured: 0 | 1;
  image_path: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;

  category_id: number | null;

  rating_avg: number;
  rating_count: number;
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

  is_featured: 0 | 1;
  image_path: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;

  category_id: number | null;

  rating_avg: number;
  rating_count: number;
};

export type NewProductInput = Partial<Omit<Product, "id" | "created_at" | "updated_at">> & {
  product_type: string;
  variety: string;
  code: string;
};

export type UpdateProductInput = Partial<Omit<Product, "id" | "created_at" | "updated_at">>;

/* -------------------- REVIEWS -------------------- */
export interface ReviewRow extends RowDataPacket {
  id: number;
  product_id: number;
  user_id: number | null;
  reviewer_name: string | null;
  reviewer_email: string | null;
  rating: number; // 1..5
  title: string | null;
  comment: string | null;
  status: "pending" | "approved" | "rejected";
  is_edited: 0 | 1;
  created_at: string;
  updated_at: string;
}

export type Review = {
  id: number;
  product_id: number;
  user_id: number | null;
  reviewer_name: string | null;
  reviewer_email: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  status: "pending" | "approved" | "rejected";
  is_edited: 0 | 1;
  created_at: string;
  updated_at: string;
};

export type NewReviewInput = {
  product_id: number;
  rating: number; // 1..5
  user_id?: number | null;
  reviewer_name?: string | null;
  reviewer_email?: string | null;
  title?: string | null;
  comment?: string | null;
  status?: Review["status"]; // default: approved
};

export type UpdateReviewInput = Partial<
  Omit<NewReviewInput, "product_id"> & { status: Review["status"]; is_edited?: 0 | 1 }
>;

/* -------------------- CARTS -------------------- */
export interface CartRow extends RowDataPacket {
  id: number;
  user_id: number | null;
  guest_key: string | null; // UUID
  status: "active" | "converted" | "abandoned" | "cancelled";
  currency: string; // CHAR(3)
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  grand_total: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemRow extends RowDataPacket {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  currency: string; // CHAR(3)
  line_total: number;
  created_at: string;
  updated_at: string;
}

export type Cart = {
  id: number;
  user_id: number | null;
  guest_key: string | null;
  status: "active" | "converted" | "abandoned" | "cancelled";
  currency: string;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  grand_total: number;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
};

export type CartItem = {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  currency: string;
  line_total: number;
  created_at: string;
  updated_at: string;
};

export type EnsureCartInput = {
  user_id?: number | null;
  guest_key?: string | null; // UUID
  currency?: string; // default TRY
};

export type AddOrSetItemInput = {
  product_id: number;
  quantity: number;
  unit_price?: number | null;
};

/* -------------------- ORDERS -------------------- */
export type OrderStatus =
  | "pending" | "paid" | "failed" | "cancelled" | "refunded" | "shipped" | "completed";

export type CustomerType = "kurumsal" | "bireysel" | "katilimci";
export type PaymentMethod = "kredi-karti" | "havale";

export interface OrderDb extends RowDataPacket {
  id: number;
  order_number: string;           // <-- eklendi
  user_id: number | null;
  guest_key: string | null;
  customer_type: CustomerType;
  payment_method: PaymentMethod;
  status: OrderStatus;
  currency: string;

  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  grand_total: number;

  company_title: string | null;
  tax_number: string | null;
  tax_office: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address_text: string | null;
  note: string | null;

  payment_snapshot: any | null;
  cart_id: number | null;
  domain: string | null;

  created_at: string;
  updated_at: string;
}

export interface OrderItemDb extends RowDataPacket {
  id: number;
  order_id: number;
  product_id: number;
  code: string | null;
  title: string;
  unit_price: number;
  quantity: number;
  currency: string;
  line_total: number;
  image_path: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  code: string | null;
  title: string;
  unit_price: number;
  quantity: number;
  currency: string;
  line_total: number;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: number;
  order_number: string;           // <-- eklendi
  user_id: number | null;
  guest_key: string | null;
  customer_type: CustomerType;
  payment_method: PaymentMethod;
  status: OrderStatus;
  currency: string;

  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  grand_total: number;

  company_title: string | null;
  tax_number: string | null;
  tax_office: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address_text: string | null;
  note: string | null;

  payment_snapshot: any | null;
  cart_id: number | null;
  domain: string | null;

  created_at: string;
  updated_at: string;

  items?: OrderItem[];
};

/** Frontend’in POST edeceği payload */
export type AppOrderCreateInput = {
  user_id?: number | null;
  guest_key?: string | null;

  customer_type: CustomerType;
  payment_method: PaymentMethod;
  status?: OrderStatus;          // default: pending
  currency?: string;             // default: TRY

  subtotal: number;
  discount_total?: number;
  shipping_total?: number;
  tax_total?: number;
  grand_total: number;

  company_title?: string | null;
  tax_number?: string | null;
  tax_office?: string | null;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address_text?: string | null;
  note?: string | null;

  payment_snapshot?: any | null;
  cart_id?: number | null;
  domain?: string | null;

  items: Array<{
    product_id: number;
    code?: string | null;
    title: string;
    unit_price: number;
    quantity: number;
    currency?: string;
    line_total: number;
    image_path?: string | null;
  }>;
};

/* -------------------- List/Pages -------------------- */
export type ListOptions = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: OrderDirection;
};

export type PagedResult<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

/* -------------------- Admin/User -------------------- */
export type DBError = { code: string; message: string };

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

export type Admin = {
  id: number;
  name: string;
  email: string;
  role: "superadmin" | "editor" | "viewer";
  password_hash: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
};

export type NewAdminInput = {
  name: string;
  email: string;
  role?: Admin["role"];
  password_hash?: string | null;
  is_active?: 0 | 1;
};

export type UpdateAdminInput = Partial<Omit<NewAdminInput, "email">> & { email?: string };

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
