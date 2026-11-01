import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { backupEnquiries } from "@/lib/sheets";


export async function POST(request: Request) {
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 10000) return Response.json({ error: "Request is too large." }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return Response.json({ error: "Invalid enquiry." }, { status: 400 });
  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (!name || name.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || phone.length > 50 || !message || message.length > 5000) {
    return Response.json({ error: "Please provide a valid name, email and message." }, { status: 400 });
  }
  const id = randomUUID();
  try {
    await getDb().insert(enquiries).values({ id, name, email, phone: phone || null, message });
  } catch (error) {
    console.error("Could not save enquiry", error);
    return Response.json({ error: "Could not save your enquiry. Please try again." }, { status: 500 });
  }
  try {
    await backupEnquiries();
  } catch (error) {
    console.error("Enquiry saved; Sheets backup is pending", error);
  }
  return Response.json({ id }, { status: 201 });
}
