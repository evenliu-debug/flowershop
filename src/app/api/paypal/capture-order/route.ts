import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      paypalOrderID?: string;
      internalOrderId?: string;
    };
    if (!body.paypalOrderID || !body.internalOrderId) {
      return NextResponse.json({ error: "params" }, { status: 400 });
    }
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { data: order } = await supabase
      .from("orders")
      .select("id, user_id, paypal_order_id")
      .eq("id", body.internalOrderId)
      .single();

    if (!order || order.user_id !== user.id) {
      return NextResponse.json({ error: "order" }, { status: 400 });
    }

    await capturePayPalOrder(body.paypalOrderID);

    await supabase
      .from("orders")
      .update({ paypal_order_id: body.paypalOrderID })
      .eq("id", order.id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
