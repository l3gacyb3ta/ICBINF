const BASE_URL = process.env.BASE_URL || '';

export default {
    "base": `/${BASE_URL}`,
    "root": "src",
    "build": {
        outDir: "../dist"
    }
};