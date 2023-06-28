export const db = await Deno.openKv();

console.log(Object.keys(Deno).forEach(key => console.log(key)));