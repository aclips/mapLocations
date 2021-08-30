class Map {

    constructor(params) {
        this.id = params.id
        this.image = params.image

        this.build()
    }

    build() {
        const container = document.getElementById(this.id)
        container.classList.add("map-locations")

        const mapContainer = document.createElement("div")
        mapContainer.classList.add("map")

        const mapImage = document.createElement("img")
        mapImage.src = this.image
        mapImage.style.pointerEvents = "none"

        mapContainer.appendChild(mapImage)
        container.appendChild(mapContainer)

        /**
         * Drag
         */

        container.style.cursor = 'grab'

        let pos = {top: 0, left: 0, x: 0, y: 0}

        const mouseDownHandler = function (e) {
            container.style.cursor = 'grabbing'
            container.style.userSelect = 'none'

            pos = {
                left: container.scrollLeft,
                top: container.scrollTop,
                x: e.clientX,
                y: e.clientY,
            }

            document.addEventListener('mousemove', mouseMoveHandler)
            document.addEventListener('mouseup', mouseUpHandler)
        }

        const mouseMoveHandler = function (e) {
            const dx = e.clientX - pos.x
            const dy = e.clientY - pos.y

            container.scrollTop = pos.top - dy
            container.scrollLeft = pos.left - dx
        }

        const mouseUpHandler = function () {
            container.style.cursor = 'grab'
            container.style.removeProperty('user-select')

            document.removeEventListener('mousemove', mouseMoveHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }

        /**
         * Zoom
         */

        let zoom = 1
        const ZOOM_SPEED = 0.1

        container.addEventListener('mousedown', mouseDownHandler)
        container.addEventListener("wheel", function (e) {
            if (e.deltaY > 0) {
                mapImage.style.transform = `scale(${zoom -= ZOOM_SPEED})`;
            } else {
                mapImage.style.transform = `scale(${zoom += ZOOM_SPEED})`;
            }

        })
    }

}