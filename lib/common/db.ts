export let db: Deno.Kv;

export function setKv(kv: Deno.Kv) {
  db = kv;
}
