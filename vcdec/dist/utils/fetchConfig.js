import fs from "fs";
export function FetchConfig(cwd) {
    if (fs.existsSync(process.cwd() + "/.vcdec/CONFIG")) {
        let config = JSON.parse(fs.readFileSync(process.cwd() + "/.vcdec/CONFIG").toString());
        return config;
    }
    else {
        console.error("vcdec config not found in " + cwd + "/.vcdec");
        process.exit(1);
    }
}
//# sourceMappingURL=fetchConfig.js.map