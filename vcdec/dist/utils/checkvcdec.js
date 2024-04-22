import fs from "fs";
export function Isvcdec(cwd) {
    if (!fs.existsSync(cwd + "/.vcdec")) {
        console.error("fatal: .vcdec folder missing!!!");
        process.exit(1);
    }
}
//# sourceMappingURL=checkvcdec.js.map