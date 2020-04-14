import express from 'express';
import config from './app.config'
import { toHHMMSS } from './date-util'
import ThrottlePromises from './throttle-promises'
import CoordsGenerator, { LatLng } from './coords-generator'
import SunriseSunsetApi, { SunsetSunriseResult } from './sunrise-sunset-api'
import R from 'ramda'

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const { maxParallelRequests, requestsCount, verboseRequest } = config;
    const coordsGenerator = new CoordsGenerator();
    const sunriseSunsetApi = new SunriseSunsetApi(verboseRequest);

    const randomCoordinates = coordsGenerator.generateRandomCoordinates(requestsCount);
    const coordsTransformation = R.map<LatLng, () => Promise<SunsetSunriseResult>>(latLng => () => sunriseSunsetApi.getTodayData(latLng));
    const requests = coordsTransformation(randomCoordinates);
    const results = await ThrottlePromises<SunsetSunriseResult>(requests, maxParallelRequests);
    //results, even with status "OK" may return an invalid date (e.g. 1970). We are filtering out these records.
    const todayUTCTime = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 1000 * 60).setHours(0, 0, 0, 0);
    //Exclude values that are not valid because api call threw an error
    const validCheckFilter = R.filter((x: SunsetSunriseResult | undefined) => {
        return x !== undefined && x !== null && x.sunrise.getTime() >= todayUTCTime && x.sunset.getTime() >= todayUTCTime;
    });

    const validResults = validCheckFilter(results);
    const bySunrise = R.comparator<SunsetSunriseResult>((a, b) => a.sunrise < b.sunrise);
    const resultsByEarliestSunrise = R.sort(bySunrise, validResults);

    if (R.any(() => true, resultsByEarliestSunrise)) {
        var earliest = resultsByEarliestSunrise[0];
        res.send('Found earliest sunrise with a day length of ' + toHHMMSS(earliest.day_length) + '<br><pre>' + JSON.stringify(earliest) + '</pre>');
    }
    else {
        res.send('Cannot find any result');
    }
});

app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});

