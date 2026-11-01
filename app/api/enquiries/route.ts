import { randomUUID } from "node:crypto";
import { reserveEnquirySlot } from "@/lib/enquiry-quota";
import { getDb } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import type { EnquiryRequest } from "@/lib/enquiry";
import { backupEnquiries } from "@/lib/sheets";


export async function POST(request: Request): Promise<Response> {
  let rawBody: unknown;
  try {
    const reader = request.body?.getReader();
    const decoder = new TextDecoder();
    let text = "";
    let bytes = 0;
    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bytes += value.byteLength;
          if (bytes > 10000) {
            void reader.cancel().catch(() => {});
            return Response.json({ error: "Request is too large." }, { status: 413 });
          }
          text += decoder.decode(value, { stream: true });
        }
        text += decoder.decode();
      } finally {
        reader.releaseLock();
      }
    }
    rawBody = JSON.parse(text);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) return Response.json({ error: "Invalid enquiry." }, { status: 400 });
  const data = rawBody as { [K in keyof EnquiryRequest]?: unknown };
  const body: EnquiryRequest = {
    name: typeof data.name === "string" ? data.name.trim() : "",
    email: typeof data.email === "string" ? data.email.trim() : "",
    phone: typeof data.phone === "string" ? data.phone.trim() : "",
    message: typeof data.message === "string" ? data.message.trim() : "",
  };
  const { name, email, phone = "", message } = body;
  if (!name || name.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || phone.length > 50 || !message || message.length > 5000) {
    return Response.json({ error: "Please provide a valid name, email and message." }, { status: 400 });
  }
  try {
    if (!await reserveEnquirySlot()) {
      return Response.json({ error: "Too many enquiries. Please try again later." }, { status: 429, headers: { "Retry-After": "3600" } });
    }
  } catch (error) {
    console.error("Could not check enquiry quota", error);
    return Response.json({ error: "Could not save your enquiry. Please try again." }, { status: 503 });
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
