const BASE_URL = process.env.BASE_URL || 'https://arcades.agency/ICBINF';

export default {
    "base": `${BASE_URL}`,
    "root": "src",
    "build": {
        outDir: "../dist"
    }
};