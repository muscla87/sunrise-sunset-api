import R from 'ramda'

export default class CoordsGenerator {

    constructor() {
    };

    public generateRandomCoordinate() : LatLng {
        return {
            latitude: getRandomIntInclusive(-90,90),
            longitude:getRandomIntInclusive(-180,180),
        };
    };

    public generateRandomCoordinates(count:number) : LatLng[] {
        return R.map<number, LatLng>((_ => this.generateRandomCoordinate()),R.range(0, count));
    };

}

export interface LatLng{
    latitude: number;
    longitude: number;
}

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min + 1) + min;
}