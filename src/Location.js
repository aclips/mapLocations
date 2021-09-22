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
     * Получение контейнера
     * @returns {HTMLElement}
     */
    getContainer() {
        return this.container
    }

    /**
     * Добавление точки в коллекцию
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
        this.container.id = 'LOCATION_' + this.id
        this.container.classList.add('location')
        this.container.style.position = 'absolute'
        this.container.style.transformOrigin = '0 0'

        this.manageZoom()

        this.renderLocation()
        this.renderPoints(this.points)

        container.appendChild(this.container)
    }

    /**
     * Установка увеличения карты
     */
    manageZoom() {

        let container = this.container
        let scale, parentRect, oldScale, rect, transform

        scale = 1
        transform = 'matrix(' + 1 + ',0,0,' + 1 + ',' + 0 + ',' + 0 + ')'

        setTimeout(function () {
            rect = container.getBoundingClientRect();
        }, 0);

        if (container.addEventListener) {
            container.removeEventListener('mousewheel', mouseWheelHandler);
            container.removeEventListener('DOMMouseScroll', mouseWheelHandler);

            container.addEventListener("mousewheel", mouseWheelHandler, false);
            container.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
        }

        function mouseWheelHandler(e) {
            e = window.event || e // old IE support

            let pgX = e.pageX,
                pgY = e.pageY

            parentRect = container.parentNode.getBoundingClientRect()
            rect = container.getBoundingClientRect()

            let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))

            oldScale = scale
            scale += (delta / 5)

            if (scale < 0.3) {
                scale = 0.3
            }
            if (scale > 7) {
                scale = 7
            }

            let xPercent = ((pgX - rect.left) / rect.width).toFixed(2)
            let yPercent = ((pgY - rect.top) / rect.height).toFixed(2)

            let left = Math.round(pgX - parentRect.left - (xPercent * (rect.width * scale / oldScale)))
            let top = Math.round(pgY - parentRect.top - (yPercent * (rect.height * scale / oldScale)))

            transform = 'matrix(' + scale + ',0,0,' + scale + ',' + left + ',' + top + ')'

            container.style.webkitTransform = transform
            container.style.mozTransform = transform
            container.style.transform = transform
        }
    }

    renderLocation() {
        const imageNode = document.createElement("img")
        imageNode.src = this.image
        imageNode.classList.add("map-image")

        this.container.appendChild(imageNode)
    }

    /**
     * Отрисовка точек
     * @param {[Point]}points
     */
    renderPoints(points) {
        for (let point of points) {
            // Удаляем точку, если она уже нарисована
            this.erasePoint(point)
            // Рисуем точку
            this.drawPoint(point)
        }
    }

    /**
     * Рисование точки
     * @param {Point} point
     */
    drawPoint(point) {
        let pointNode = document.createElement('div')

        pointNode.id = this.id + '_' + point.id
        pointNode.setAttribute('data-id', point.id)
        pointNode.classList.add('point')

        // @TODO вынести стили в конфиг
        pointNode.style.width = '25px'
        pointNode.style.height = '25px'
        pointNode.style.background = '#d9d9d9'
        pointNode.style.borderRadius = '20px'
        pointNode.style.position = 'absolute'
        pointNode.style.backgroundImage = 'url(' + point.image + ')'
        pointNode.style.backgroundSize = 'contain'
        pointNode.style.left = point.position.x + 'px'
        pointNode.style.top = point.position.y + 'px'
        pointNode.style.border = '2px solid #868686'

        this.container.appendChild(pointNode)
    }

    /**
     * Удаление нарисованной точки
     * @param {Point} point
     */
    erasePoint(point) {
        let complexId = this.id + '_' + point.id
        let pointNode = document.getElementById(complexId)

        if (pointNode) {
            pointNode.remove()
        }
    }
}

export default Location
