const fs = require("fs");

let file = fs.readFileSync("./db.ts").toString();

file = file.replace(/export.namespace/g, "namespace");

fs.writeFileSync("./db.ts", file);
