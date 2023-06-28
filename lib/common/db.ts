export const db = await Deno.openKv();

console.log(db);
console.log(Deno);

//@ts-ignore
console.log(Deno.core)

//@ts-ignore
console.log(Deno.ops)