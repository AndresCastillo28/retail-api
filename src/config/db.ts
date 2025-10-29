import oracledb from "oracledb";

export async function testConnection() {
  const connection = await oracledb.getConnection({
    user: process.env.APP_USER,
    password: process.env.APP_USER_PASSWORD,
    connectString:
      process.env.ORACLE_CONNECT_STRING ?? "localhost:1521/FREEPDB1", // default service in the Free image
  });
  const result = await connection.execute(
    `select 'connected' as status from dual`
  );
  console.log(result.rows);
  await connection.close();
}

let pool: oracledb.Pool | null = null;

export async function initPool() {
  if (pool) return pool;
  pool = await oracledb.createPool({
    user: process.env.APP_USER,
    password: process.env.APP_USER_PASSWORD,
    connectString:
      process.env.ORACLE_CONNECT_STRING ?? "localhost:1521/FREEPDB1",
    poolMin: 0,
    poolMax: 10,
    poolIncrement: 1,
  });
  return pool;
}

export async function closePool() {
  if (pool) {
    await pool.close(10);
    pool = null;
  }
}

export async function getConnection() {
  if (!pool) await initPool();
  return pool!.getConnection();
}
