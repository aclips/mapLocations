class Map {

    constructor(params) {
        this.mapWrapperId = params.mapWrapperId
        this.image = params.image

        this.itemWrapperId = params.itemWrapperId
        this.items = params.items

        this.build()
    }

    build() {
        const container = document.getElementById(this.mapWrapperId)
        container.classList.add("map-locations")

        const mapContainer = document.createElement("div")
        mapContainer.classList.add("map")

        const mapImage = document.createElement("img")
        mapImage.src = this.image
        mapImage.style.pointerEvents = "none"

        mapContainer.appendChild(mapImage)

        container.appendChild(mapContainer)

        /**
         * Map items
         */
        const itemContainer = document.getElementById(this.itemWrapperId)
        const items = document.createElement("div")
        items.classList.add("item-container")

        for (let i in this.items) {
            let item = this.items[i]
            let complexId = this.itemWrapperId + '_' + item.id

            let itemElement = document.createElement("div")

            itemElement.classList.add("itemElement")
            itemElement.draggable = true
            itemElement.id = complexId

            // @TODO сделать шаблон
            // label
            let itemName = document.createElement("div")
            itemName.innerHTML = item.label

            itemElement.appendChild(itemName)

            items.appendChild(itemElement)
        }

        itemContainer.appendChild(items)

        document.addEventListener("dragstart", function (e) {
            container.classList.add("ready-to-drop")
            e.dataTransfer.setData("id", e.target.id)
        });

        document.addEventListener("dragend", function (e) {
            container.classList.remove("ready-to-drop")
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

        container.addEventListener('mousedown', mouseDownHandler)

        /**
         * Zoom map
         */
        const ZOOM_SPEED = 0.1

        let zoom = 1

        container.addEventListener("wheel", function (e) {
            e.preventDefault();

            if (e.deltaY > 0) {
                zoom -= ZOOM_SPEED
            } else {
                zoom += ZOOM_SPEED
            }

            mapImage.style.transform = `scale(${zoom})`
        })
    }

}