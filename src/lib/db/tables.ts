
export const project = `
project (
    id VARCHAR(10) NOT NULL,
    timestamp DATETIME NOT NULL,
    lang VARCHAR(20) NOT NULL,
    code TEXT NOT NULL,
    creator VARCHAR(512),
    passwd VARCHAR(1024),
    readme TEXT,
    steps TEXT,
    stats TEXT
)`;
