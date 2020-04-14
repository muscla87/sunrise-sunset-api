import R from 'ramda'

export default class CoordsGenerator {

    constructor() {
    };

    public generateRandomCoordinate() : LatLng {
        return {
            latitude: getRandomRange(-90,90),
            longitude:getRandomRange(-180,180),
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

function getRandomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}