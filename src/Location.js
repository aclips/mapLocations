import Point from './Point.js'

class Location {
    id;
    name;
    image;
    size = {
        width: null,
        height: null
    };
    points = [];
    container;

    /**
     * @param {Object} params
     * @param {string} params.id
     * @param {string} params.name
     * @param {string} params.image
     * @param {{width:number, height:number}} params.size
     * @param {[]} params.points
     */
    constructor(params) {
        if (!params.id) {
            throw new Error('Location parameter is not valid ID.')
        }

        this.id = params.id
        this.name = params.name
        this.image = params.image

        if (typeof params.size == 'object') {
            this.size = params.size
        }

        if (Array.isArray(params.points)) {
            for (let point of params.points) {
                this.addPoint(point)
            }
        } else {
            throw new Error('Points must be an array.');
        }
    }

    /**
     * Добавление точки
     *
     * @param {Object} point
     * @param {string} point.id
     * @param {string} point.label
     * @param {string} point.image
     * @param {{x:string, y:string}} point.position
     */
    addPoint(point) {
        if (this.points.filter((p) => p.id == point.id).length > 0) {
            throw new Error('Points id must be unique ');
        }

        this.points.push(new Point(point))
    }


    /**
     * Отрисовка локации
     * @param {HTMLElement} container
     */
    render(container) {

        this.container = document.createElement("div")
        this.container.classList.add("map")
        this.container.style.position = 'relative';

        this.renderLocation()
        this.renderPoints()

        container.appendChild(this.container)
    }

    renderLocation() {
        const imageNode = document.createElement("img")
        imageNode.src = this.image
        imageNode.classList.add("map-image")

        this.container.appendChild(imageNode)
    }

    renderPoints() {

        let oldPoints = this.container.getElementsByClassName('point')

        for (let oldPoint of oldPoints) {
            oldPoint.remove()
        }

        for (let point of this.points) {
            let pointNode = document.createElement('div')
            pointNode.setAttribute('data-id', point.id)
            pointNode.classList.add('point')

            pointNode.style.width = '25px';
            pointNode.style.height = '25px';
            pointNode.style.background = 'red';
            pointNode.style.borderRadius = '20px';
            pointNode.style.position = 'absolute';

            pointNode.style.left = point.position.x + 'px'
            pointNode.style.top = point.position.y + 'px'

            this.container.appendChild(pointNode)
        }
    }
}

export default Location
