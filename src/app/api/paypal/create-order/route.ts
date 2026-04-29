import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { orderId?: string };
    if (!body.orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("id, user_id, total_usd, payment_provider")
      .eq("id", body.orderId)
      .single();

    if (error || !order || order.user_id !== user.id) {
      return NextResponse.json({ error: "order" }, { status: 400 });
    }
    if (order.payment_provider !== "paypal") {
      return NextResponse.json({ error: "method" }, { status: 400 });
    }

    const value = Number(order.total_usd).toFixed(2);
    const paypalOrderId = await createPayPalOrder(value, order.id);

    await supabase
      .from("orders")
      .update({ paypal_order_id: paypalOrderId })
      .eq("id", order.id);

    return NextResponse.json({ paypalOrderId });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
