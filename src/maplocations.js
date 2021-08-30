class Map {

    constructor(params) {
        this.mapWrapperId = params.mapWrapperId
        this.image = params.image

        this.itemWrapperId = params.itemWrapperId
        this.items = params.items

        this.build()
        this.setItems(this.items)
    }

    build() {
        const mapWrapper = document.getElementById(this.mapWrapperId)
        mapWrapper.classList.add("map-locations")

        const mapContainer = document.createElement("div")
        mapContainer.classList.add("map")

        const mapImage = document.createElement("img")
        mapImage.src = this.image
        mapImage.style.pointerEvents = "none"

        mapContainer.appendChild(mapImage)

        mapWrapper.appendChild(mapContainer)

        /**
         * Map items
         */
        const itemWrapper = document.getElementById(this.itemWrapperId)
        const itemContainer = document.createElement("div")
        itemContainer.classList.add("item-container")

        itemWrapper.appendChild(itemContainer)

        document.addEventListener("dragstart", function (e) {
            mapWrapper.classList.add("ready-to-drop")
            e.dataTransfer.setData("id", e.target.id)
        });

        document.addEventListener("dragend", function (e) {
            mapWrapper.classList.remove("ready-to-drop")
        });

        document.addEventListener("dragover", function (e) {
            e.preventDefault()
        });

        document.addEventListener("drop", function (e) {
            e.preventDefault()

            if (e.target.className == "map") {
                let itemId = e.dataTransfer.getData("id");
                let item = document.getElementById(itemId)

                // e.target.appendChild(item)

            }
        });

        /**
         * Drag map
         */

        mapWrapper.style.cursor = 'grab'

        let pos = {top: 0, left: 0, x: 0, y: 0}

        const mouseDownHandler = function (e) {
            mapWrapper.style.cursor = 'grabbing'
            mapWrapper.style.userSelect = 'none'

            pos = {
                left: mapWrapper.scrollLeft,
                top: mapWrapper.scrollTop,
                x: e.clientX,
                y: e.clientY,
            }

            document.addEventListener('mousemove', mouseMoveHandler)
            document.addEventListener('mouseup', mouseUpHandler)
        }

        const mouseMoveHandler = function (e) {
            const dx = e.clientX - pos.x
            const dy = e.clientY - pos.y

            mapWrapper.scrollTop = pos.top - dy
            mapWrapper.scrollLeft = pos.left - dx
        }

        const mouseUpHandler = function () {
            mapWrapper.style.cursor = 'grab'
            mapWrapper.style.removeProperty('user-select')

            document.removeEventListener('mousemove', mouseMoveHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }

        mapWrapper.addEventListener('mousedown', mouseDownHandler)

        /**
         * Zoom map
         */
        const ZOOM_SPEED = 0.1

        let zoom = 1

        mapWrapper.addEventListener("wheel", function (e) {
            e.preventDefault();

            if (e.deltaY > 0) {
                zoom -= ZOOM_SPEED
            } else {
                zoom += ZOOM_SPEED
            }

            mapImage.style.transform = `scale(${zoom})`
        })

        this.mapWrapper = mapWrapper
        this.mapContainer = mapContainer
        this.mapImage = mapImage
        this.itemWrapper = itemWrapper
        this.itemContainer = itemContainer
    }

    setItems(items) {
        this.itemContainer.innerHTML = '';

        for (let i in items) {
            let item = items[i]
            let complexId = this.itemWrapperId + '_' + item.id

            let itemElement = document.createElement("div")

            itemElement.classList.add("itemElement")
            itemElement.draggable = true
            itemElement.id = complexId

            // @TODO сделать шаблон
            // label
            let itemLabel = document.createElement("div")
            itemLabel.classList.add("label")
            itemLabel.innerHTML = item.label

            itemElement.appendChild(itemLabel)

            this.itemContainer.appendChild(itemElement)
        }

        this.itemWrapper.appendChild(this.itemContainer)
    }

}