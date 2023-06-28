export const db = await Deno.openKv();

console.log('db keys:')
console.log(Object.keys(db).forEach(key => console.log(key)));

console.log('Kv keys:')
//@ts-ignore
console.log(Object.keys(Deno.Kv).forEach(key => console.log(key)));