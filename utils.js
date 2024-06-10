const fs = require('fs');
const path = require('path');

const readJSONFile = (filename) => {
    const filepath = path.join(__dirname, 'data', filename);
    if (fs.existsSync(filepath)) {
        const data = fs.readFileSync(filepath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
};

const writeJSONFile = (filename, data) => {
    const filepath = path.join(__dirname, 'data', filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = {
    readJSONFile,
    writeJSONFile
};
