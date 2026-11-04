/** Build a public URL for an object in Homliv's asset bucket. */
export function assetUrl(objectKey: string): string {
  const key = objectKey.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  return `https://assets.homliv.co.in/${key}`;
}
