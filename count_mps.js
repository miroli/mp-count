const readline = require('readline');

const earliestDate = new Date("1900-01-01");
const endFillDateString = "2022-02-01";
const counts = {};

function getDates(startDate, endDate) {
    const dates = []
    let currentDate = startDate
    const addDays = function (days) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }
    while (currentDate <= endDate) {
        dates.push(currentDate)
        currentDate = addDays.call(currentDate, 1)
    }
    return dates
}

async function processData() {
    const rl = readline.createInterface(input = process.stdin, output = process.stdout);

    for await (const line of rl) {
        let data = JSON.parse(line);
        let lineStart = new Date(Math.max(new Date(data.startdate), earliestDate))
        let lineEnd = new Date(data.enddate || endFillDateString)
        let dates = getDates(lineStart, lineEnd)

        dates.forEach((key) => {
            let currentDateString = key.toLocaleDateString("sv")
            let currentDate = new Date(currentDateString)
            if (lineStart <= currentDate && lineEnd >= currentDate) {
                currentCount = counts[currentDateString] + 1 || 0
                counts[currentDateString] = currentCount
            }
        })
    }
    process.stdout.write(JSON.stringify(counts))
    process.exit()
}

processData()
