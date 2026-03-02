export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  return Response.json(
    {
      ok: true,
      received: true,
      eventType:
        typeof payload?.type === "string" ? payload.type : "unknown_event",
    },
    { status: 200 },
  );
}

