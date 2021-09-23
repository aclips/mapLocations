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
    positionParams = {
        scale: 1,
        left: 0,
        top: 0
    };

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
        this.manageMove()

        this.renderLocation()
        this.renderPoints(this.points)

        container.appendChild(this.container)
    }

    /**
     * Установка увеличения карты
     */
    manageZoom() {
        let parentRect, oldScale, rect



        const mouseWheelHandler = (e) => {
            e = window.event || e // old IE support

            let pgX = e.pageX,
                pgY = e.pageY

            parentRect = this.container.parentNode.getBoundingClientRect()
            rect = this.container.getBoundingClientRect()

            let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))

            oldScale = this.positionParams.scale
            this.positionParams.scale += (delta / 5)

            if (this.positionParams.scale < 0.3) {
                this.positionParams.scale = 0.3
            }
            if (this.positionParams.scale > 7) {
                this.positionParams.scale = 7
            }

            let xPercent = ((pgX - rect.left) / rect.width).toFixed(2)
            let yPercent = ((pgY - rect.top) / rect.height).toFixed(2)

            this.positionParams.left = Math.round(pgX - parentRect.left - (xPercent * (rect.width * this.positionParams.scale / oldScale)))
            this.positionParams.top = Math.round(pgY - parentRect.top - (yPercent * (rect.height * this.positionParams.scale / oldScale)))

            this.transformContainer(this.positionParams.scale, this.positionParams.left, this.positionParams.top)
        }

        if (this.container.addEventListener) {
            this.container.removeEventListener('mousewheel', mouseWheelHandler);
            this.container.removeEventListener('DOMMouseScroll', mouseWheelHandler);

            this.container.addEventListener("mousewheel", mouseWheelHandler, false);
            this.container.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
        }
    }

    transformContainer(scale, left, top) {
        let transform = 'matrix(' + scale + ',0,0,' + scale + ',' + left + ',' + top + ')'

        this.container.style.webkitTransform = transform
        this.container.style.mozTransform = transform
        this.container.style.transform = transform
    }

    manageMove() {
        this.container.style.cursor = 'grab'

        let pos = {x: 0, y: 0}

        const mouseDownHandler = (e) => {
            this.container.style.cursor = 'grabbing'
            this.container.style.userSelect = 'none'

            pos = {
                left: this.positionParams.left,
                top: this.positionParams.top,
                x: e.clientX,
                y: e.clientY,
            }

            this.container.addEventListener('mousemove', mouseMoveHandler)
            this.container.addEventListener('mouseup', mouseUpHandler)
        }

        const mouseUpHandler = () => {
            this.container.style.cursor = 'grab'
            this.container.removeEventListener('mousemove', mouseMoveHandler)
            this.container.removeEventListener('mouseup', mouseUpHandler)
        }

        const mouseMoveHandler = (e) => {
            const dx = e.clientX - pos.x
            const dy = e.clientY - pos.y

            this.positionParams.left = pos.left + dx
            this.positionParams.top = pos.top + dy
            this.transformContainer(this.positionParams.scale, this.positionParams.left, this.positionParams.top)
        }

        this.container.addEventListener('mousedown', mouseDownHandler)
    }

    renderLocation() {
        const imageNode = document.createElement('img')
        imageNode.src = this.image
        imageNode.classList.add('map-image')
        imageNode.style.pointerEvents = 'none'

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
