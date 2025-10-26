// src/lib/db/connection.ts


import mysql, {
  Pool,
  PoolConnection,
  RowDataPacket,
  FieldPacket,
  ResultSetHeader,
} from "mysql2/promise";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const {
      MYSQL_HOST,
      MYSQL_USER,
      MYSQL_PASSWORD,
      MYSQL_DATABASE,
      MYSQL_PORT,
      MYSQL_TIMEZONE,
    } = process.env;

    if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
      throw new Error(
        "DB env değişkenleri eksik. Gerekli: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE"
      );
    }

    pool = mysql.createPool({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
      connectionLimit: 10,
      waitForConnections: true,
      namedPlaceholders: true,
      decimalNumbers: true,
      timezone: MYSQL_TIMEZONE || "Z",
    });
  }
  return pool;
}

/** Satır dönen sorgular (SELECT) */
export async function queryRows<T extends RowDataPacket[]>(
  sql: string,
  params?: Record<string, any> | any[]
): Promise<[T, FieldPacket[]]> {
  const [rows, fields] = await getPool().query(sql, params as any);
  return [rows as T, fields];
}

/** DML sorguları (INSERT/UPDATE/DELETE) */
export async function executeResult(
  sql: string,
  params?: Record<string, any> | any[]
): Promise<[ResultSetHeader, FieldPacket[]]> {
  const [result, fields] = await getPool().execute<ResultSetHeader>(sql, params as any);
  return [result, fields];
}

/** Transaction yardımcıları */
export async function withTransaction<T>(
  fn: (conn: PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
