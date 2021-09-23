import Location from './Location.js'

class Map {

    container;
    size = {
        width: null,
        height: null
    };
    locations = [];
    activeLocationId;
    zoomParams = {
        zoom: 1,
        itemScale: 1,
        translateX: 0,
        translateY: 0
    };

    /**
     * @param {HTMLElement|String} container HTML element or its ID
     * @param {Object} params
     * @params {string} params.activeLocationId
     * @param {{width:number, height:number}} params.size
     * @param {[]} params.locations
     * @param {string} params.activeLocationId
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

        if (params.activeLocationId) {
            this.changeLocation(params.activeLocationId)
        }

        this.init()
    }

    init() {
        // Инициализация контейнера карты
        this.container.style.position = 'relative'
        this.container.style.overflow = 'hidden'
        this.container.style.width = '100%'
        this.container.style.height = '100%'
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
     * Смена локации
     * @param {string} locationId
     */
    changeLocation(locationId) {
        let location = this.getLocationById(locationId)

        if (!location) {
            throw new Error('Location not found.');
        }

        this.activeLocationId = locationId

        let locationNodes = this.container.getElementsByClassName('location')

        for (let locationNode of locationNodes) {
            locationNode.remove()
        }

        location.render(this.container)
    }

    /**
     * Получение активной локации
     * @returns {?Location}
     */
    getActiveLocation() {
        return this.getLocationById(this.activeLocationId)
    }

    /**
     * Получение локации по id
     * @param locationId
     * @returns {?Location}
     */
    getLocationById(locationId) {
        return this.getLocations().find(l => l.id == locationId)
    }

    /**
     * Получение коллекции локаций карты
     * @returns {[Location]}
     */
    getLocations() {
        return this.locations
    }
}

export default Map
