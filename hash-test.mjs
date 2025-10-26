import bcrypt from "bcrypt";

const password = "@@Globalnexus34.";
const hash = await bcrypt.hash(password, 10);

console.log("Hash sonucu:");
console.log(hash);
