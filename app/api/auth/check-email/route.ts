
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return NextResponse.json(
        {
          error: "البريد الإلكتروني مطلوب",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      exists: Boolean(user),
    });
  } catch (error) {
    console.error("CHECK EMAIL ERROR:", error);

    return NextResponse.json(
      {
        error: "حدث خطأ أثناء التحقق من البريد الإلكتروني",
      },
      {
        status: 500,
      }
    );
  }
}

