module.exports = function (positionId) {
    return `
    SELECT ?item ?startdate ?enddate WHERE {
        ?item wdt:P31 wd:Q5;
              p:P39 ?posStatement .
        
        ?posStatement ps:P39/wdt:P279* wd:${positionId};
                      pq:P580 ?startdate.
        OPTIONAL { ?posStatement pq:P582 ?enddate }
    }`
}
