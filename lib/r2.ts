/** Build a public R2 object URL. The bucket must be exposed through a public domain. */
export function publicR2Url(objectKey: string | null): string | null {
  const base = process.env.R2_PUBLIC_BASE_URL?.trim();
  if (!base || !objectKey) return null;
  try {
    const url = new URL(base);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const key = objectKey.split("/").filter(Boolean).map(encodeURIComponent).join("/");
    if (!key) return null;
    return `${url.href.replace(/\/+$/, "")}/${key}`;
  } catch {
    return null;
  }
}
