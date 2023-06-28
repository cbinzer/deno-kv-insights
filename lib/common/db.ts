export const db = await Deno.openKv();

console.log('Core keys:')
//@ts-ignore
console.log(Object.keys(Deno[Deno.internal]).forEach(key => console.log(key)));