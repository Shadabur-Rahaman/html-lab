import { createClient } from "npm:@supabase/supabase-js@2.118.0";
export const bucket = "html-lab-resources";
export function service() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
export function response(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
export class ClientError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function checked<T>(
  result: PromiseLike<{ data: T; error: unknown }>,
): Promise<NonNullable<T>> {
  const { data, error } = await result;
  if (error) throw error;
  if (data == null) throw new ClientError("This resource is unavailable.", 404);
  return data;
}
export async function actor(
  req: Request,
  db: ReturnType<typeof service>,
  required = true,
) {
  const token =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  const {
    data: { user },
    error,
  } = token
    ? await db.auth.getUser(token)
    : { data: { user: null }, error: true };
  if (error || !user) {
    if (required)
      throw new ClientError("Sign in again to manage resources.", 401);
    return null;
  }
  const { data: member } = await db
    .from("html_authorized_teachers")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!member) {
    if (required)
      throw new ClientError(
        "This account has not been authorized as a teacher.",
        403,
      );
    return null;
  }
  return { id: user.id, role: member.role, email: user.email };
}
export async function limit(
  db: ReturnType<typeof service>,
  key: string,
  maximum: number,
  seconds = 60,
) {
  const ok = await checked(
    db.rpc("html_resource_rate", { key_value: key, maximum, seconds }),
  );
  if (!ok)
    throw new ClientError(
      "Too many requests. Wait a minute and try again.",
      429,
    );
}
