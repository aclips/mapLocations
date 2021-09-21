import Point from './Point.js'

class Location {
    id;
    name;
    image;
    size = {
        width: '500px',
        height: '100px'
    };
    points = [];

    /**
     * @param {Object} params
     * @param {string} params.id
     * @param {string} params.name
     * @param {string} params.image
     * @param {{width:string, height:string}} params.size
     * @param {[]} params.points
     */
    constructor(params) {
        this.id = params.id
        this.name = params.name
        this.image = params.image

        if (typeof params.size == 'object') {
            this.size = params.size
        }

        if (typeof params.points == 'object' && params.points.length > 0) {
            for (let point of params.points) {
                this.points.push(new Point(point))
            }
        }
    }
}

export default Location
