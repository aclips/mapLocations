import Location from './Location.js'

class Map {

    container;
    size = {
        width: '500px',
        height: '100px'
    };
    locations = [];

    /**
     * @param {HTMLElement|String} container HTML element or its ID
     * @param {Object} params
     * @param {{width:string, height:string}} params.size
     * @param {[]} params.locations
     */
    constructor(container, params) {
        if (typeof container === 'string') {
            this.container = document.getElementById(container)
            if (!this.container) {
                throw new Error('container parameter is not valid ID')
            }
        } else {
            this.container = container;
        }

        if(typeof params.size == 'object') {
            this.size = params.size
        }

        if(typeof params.locations == 'object' && params.locations.length > 0){
            for(let location of params.locations){
                this.locations.push(new Location(location))
            }
        }

    }
}

export default Map
