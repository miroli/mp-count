const readline = require('readline');

const start = new Date("1990-01-01");
const end = new Date("2021-12-31");
const endFillDate = "2030-01-01";
const counts = {};


async function processData() {

    let loop = new Date(start);
    while (loop <= end) {
        let newDate = loop.setDate(loop.getDate() + 1);
        counts[loop.toLocaleDateString("sv")] = 0;
        loop = new Date(newDate);
    }

    const rl = readline.createInterface(process.stdin, process.stdout);

    for await (const line of rl) {
        let data = JSON.parse(line);
        let lineStart = new Date(data.startdate)
        let lineEnd = new Date(data.enddate || endFillDate)
        for (const key in counts) {
            let currentDate = new Date(key)
            if (lineStart <= currentDate && lineEnd >= currentDate) {
                counts[key] += 1
            }
        }
    }
    process.stdout.write(JSON.stringify(counts))
}

processData()