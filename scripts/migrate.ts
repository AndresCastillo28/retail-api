import oracledb from "oracledb";

const SQL = `
CREATE TABLE ACCOUNTS (
  ID            VARCHAR2(36)    PRIMARY KEY,
  USER_ID       VARCHAR2(36)    NOT NULL,
  CURRENCY      VARCHAR2(3)     NOT NULL CHECK (CURRENCY IN ('USD','EUR','COP')),
  BALANCE_MINOR NUMBER(38,0)    DEFAULT 0 NOT NULL,
  CREATED_AT    TIMESTAMP       DEFAULT SYSTIMESTAMP NOT NULL,
  UPDATED_AT    TIMESTAMP       DEFAULT SYSTIMESTAMP NOT NULL,
  IS_BLOCKED    NUMBER(1,0)     DEFAULT 0 NOT NULL
);

CREATE INDEX IX_ACCOUNTS_USER_ID ON ACCOUNTS (USER_ID);
`;

async function main() {
  const conn = await oracledb.getConnection({
    user: process.env.APP_USER || "retail",
    password: process.env.APP_USER_PASSWORD || "ChangeMe1!",
    connectString:
      process.env.ORACLE_CONNECT_STRING || "localhost:1521/FREEPDB1",
  });
  try {
    for (const stmt of SQL.split(";")
      .map((s) => s.trim())
      .filter(Boolean)) {
      await conn.execute(stmt);
    }
    await conn.commit();
    console.log("Migration done.");
  } finally {
    await conn.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
