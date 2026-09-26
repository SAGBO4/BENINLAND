import { NextResponse } from "next/server";
import { processInboundSms, getSimulatedSmsJournal } from "@/lib/channels";

export async function GET() {
  const journal = getSimulatedSmsJournal();
  return NextResponse.json({ success: true, count: journal.length, data: journal });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const telephone = body.telephone || "+229 97 00 12 34";
    const text = body.message || body.text || "";

    const response = processInboundSms(telephone, text);
    return NextResponse.json({ success: true, telephone, response });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur traitement SMS", details: String(error) },
      { status: 500 }
    );
  }
}
