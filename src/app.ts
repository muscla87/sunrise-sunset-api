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
    //Exclude also values that are not valid because api call threw an error
    const validCheckFilter = R.filter((x: SunsetSunriseResult | undefined) => {
        return x !== undefined && x !== null && x.sunrise.getUTCFullYear() != 1970 && x.sunset.getUTCFullYear() != 1970;
    });

    const validResults = validCheckFilter(results);
    const findEarliest = R.reduce<SunsetSunriseResult | null, SunsetSunriseResult>((min, current) => min != null && min.sunrise < current.sunrise ? min : current, null);
    const earliest = findEarliest(validResults);

    if (earliest != null) {
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

