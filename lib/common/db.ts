export const db = await Deno.openKv();

// @ts-ignore
console.log(Deno[Deno.internal]?.core?.ops)
