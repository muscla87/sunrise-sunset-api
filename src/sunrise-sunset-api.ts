import R from 'ramda'
import { LatLng } from './coords-generator';
import axios, { AxiosResponse } from 'axios'

export default class SunsetSunriseApi {

    constructor(private printRequestUrl: boolean = false) {
    };

    public async getTodayData(coords: LatLng): Promise<SunsetSunriseResult | undefined> {
        var url = this.getUrl(coords);
        if (this.printRequestUrl)
            console.log(url);
        try {

            var axiosResult = await axios.get<SunsetSunriseApiResult>(url);
            if (axiosResult.data.status == "OK") {
                return {
                    coordinates: coords,
                    day_length: axiosResult.data.results.day_length,
                    sunrise: new Date(axiosResult.data.results.sunrise),
                    sunset: new Date(axiosResult.data.results.sunset),
                    url: url
                };
            }
            else {
                console.log("Error during sunset-sunrise-api request. Url:%s Status:%s ", url, axiosResult.data.status);
            }
        }
        catch (error) {
            console.log("Error during sunset-sunrise-api request. Url:%s Error:%s ", url, error);
            return null;
        }
    };

    private getUrl(latLng: LatLng): string {
        return 'https://api.sunrise-sunset.org/json?formatted=0&lat=' + latLng.latitude + '&lng=' + latLng.longitude
    };

}

export interface SunsetSunriseResult {
    sunrise: Date;
    sunset: Date;
    day_length: number;
    coordinates: LatLng;
    url: string;
}

interface SunsetSunriseApiResult {
    status: string;
    results: {
        sunrise: Date;
        sunset: Date;
        day_length: number;
    };
}

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso 
}