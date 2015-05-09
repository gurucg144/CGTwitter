Node.js application to fetch tweets using twitter api for last 7 days, performs daily and hourly aggregation and provides them as Rest service.

Pre-requisite

* MongoDB
* Node.js

Steps

1. Clone CGTwitter and 'cd CGTwitter'
2. Run 'npm update'
3. Start mongodb.
3. Run 'node init.js 1' - to fetch tweets
4. Run 'node init.js 2' - to fetch new tweets
5. Run 'node Aggregate.js' - to perform daily and hourly aggregation. 
5. Run 'node RestServer.js' -- to start express server.

To access Rest service

Daily aggregate
http://localhost:8080/api/tweets/aggregate?type=daily

Hourly aggregate
http://localhost:8080/api/tweets/aggregate?type=hourly

Sample Output hourly aggregate 

[
    {
        "hour_of_day": 0,
        "count": 19
    },
    {
        "hour_of_day": 1,
        "count": 18
    },
    {
        "hour_of_day": 2,
        "count": 25
    },
    {
        "hour_of_day": 3,
        "count": 18
    },
    {
        "hour_of_day": 4,
        "count": 9
    },
    {
        "hour_of_day": 5,
        "count": 19
    },
    {
        "hour_of_day": 6,
        "count": 20
    }
]

Sample output for daily aggregate

[
    {
        "day_of_week": "Friday",
        "count": 201
    },
    {
        "day_of_week": "Monday",
        "count": 84
    },
    {
        "day_of_week": "Saturday",
        "count": 71
    },
    {
        "day_of_week": "Sunday",
        "count": 46
    },
    {
        "day_of_week": "Thursday",
        "count": 127
    },
    {
        "day_of_week": "Tuesday",
        "count": 76
    },
    {
        "day_of_week": "Wednesday",
        "count": 95
    }
]

