import Location from './Location.js'

class Map {

    container;
    size = {
        width: null,
        height: null
    };
    locations = [];

    /**
     * @param {HTMLElement|String} container HTML element or its ID
     * @param {Object} params
     * @param {{width:number, height:number}} params.size
     * @param {[]} params.locations
     */
    constructor(container, params) {
        if (typeof container === 'string') {
            this.container = document.getElementById(container)
            if (!this.container) {
                throw new Error('Container parameter is not valid ID.')
            }
        } else {
            this.container = container;
        }

        if (typeof params.size == 'object') {
            this.size = params.size
        }

        if (Array.isArray(params.locations)) {
            for (let location of params.locations) {
                this.addLocation(location)
            }
        } else {
            throw new Error('Locations must be an array.');
        }
    }

    /**
     * Добавление локации
     *
     * @param {Object} location
     * @param {string} location.id
     * @param {string} location.name
     * @param {string} location.image
     * @param {{width:string, height:string}} location.size
     * @param {[]} location.points
     */
    addLocation(location) {
        if (this.locations.filter((l) => l.id == location.id).length > 0) {
            throw new Error('Locations id must be unique.');
        }

        this.locations.push(new Location(location))
    }

    /**
     * Получение коллекции локаций карты
     * @returns {[Location]}
     */
    getLocations() {
        return this.locations
    }

    /**
     * Смена локации
     * @param {string} locationId
     */
    changeLocation(locationId) {
        let location = this.locations.find(l => l.id == locationId)

        if (!location) {
            throw new Error('Location not found.');
        }

        location.render()
    }
}

export default Map
