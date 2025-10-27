export const toMinor = (major: string | number) =>
  BigInt(Math.round(Number(major) * 100)); // simple; prefer a decimal lib in prod
export const toMajor = (minor: bigint) => Number(minor) / 100;
