// src/lib/db/connection.ts
import mysql, {
  Pool,
  PoolOptions,
  PoolConnection,
  RowDataPacket,
  FieldPacket,
  ResultSetHeader,
} from "mysql2/promise";

/** DEV hot-reload sırasında tek pool tutmak için global cache */
declare global {
  // eslint-disable-next-line no-var
  var __MYSQL_POOL__: Pool | undefined;
}

let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;
  if (global.__MYSQL_POOL__) {
    pool = global.__MYSQL_POOL__;
    return pool!;
  }

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

  const options: PoolOptions = {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,

    waitForConnections: true,
    connectionLimit: 10,          // gerektikçe artırılabilir
    queueLimit: 0,                // sınırsız bekleme kuyruğu
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,

    // mysql2 yeni opsiyonlar:
    maxIdle: 10,                  // aynı anda idle’da tutulacak max conn
    idleTimeout: 60_000,          // idle conn kapatma (ms)

    namedPlaceholders: true,
    decimalNumbers: true,
    timezone: MYSQL_TIMEZONE || "Z",
  };

  pool = mysql.createPool(options);
  // global cache’e koy
  global.__MYSQL_POOL__ = pool;

  return pool!;
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
    try { await conn.rollback(); } catch {}
    throw err;
  } finally {
    conn.release();
  }
}

// opsiyonel: sağlık kontrolü için ping
export async function ping() {
  const [r] = await queryRows<RowDataPacket[]>("SELECT 1 AS ok");
  return r?.[0]?.ok === 1;
}
