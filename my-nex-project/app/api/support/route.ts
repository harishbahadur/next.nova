import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      fullName,
      email,
      phone,
      studentId,
      schoolName,
      helpTypes,
      message,
      contactMethods,
    } = data || {};

    if (
      !fullName ||
      !email ||
      !message ||
      !Array.isArray(helpTypes) ||
      helpTypes.length === 0
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const receivedAt = new Date().toISOString();
    const payload = {
      receivedAt,
      fullName,
      email,
      phone,
      studentId,
      schoolName,
      helpTypes,
      message,
      contactMethods,
    };

    console.log("Support form submission:", payload);

    return NextResponse.json({ ok: true, receivedAt });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }
}
