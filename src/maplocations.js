class Map {

    /**
     * @type HTMLElement
     */
    container;

    /**
     * @param {HTMLElement|String} container HTML element or its ID
     * @param {Object} params
     * @param {String} params.image
     * @param {String} params.itemWrapperId
     * @param {Array} params.items
     */
    constructor(container, params) {

        if(typeof container === 'string') {
            this.container = document.getElementById(container)
            if(!this.container) {
                throw new Error('container parameter is not valid ID')
            }
        } else {
            this.container = container;
        }

        console.log(this.container);

        this.image = params.image

        this.itemWrapperId = params.itemWrapperId
        this.items = params.items

        this.build()
        this.setItems(this.items)
    }

    build() {
        this.container.classList.add("map-locations")

        const mapContainer = document.createElement("div")
        mapContainer.classList.add("map")

        const mapImage = document.createElement("img")
        mapImage.src = this.image
        mapImage.style.pointerEvents = "none"

        mapContainer.appendChild(mapImage)

        this.container.appendChild(mapContainer)

        /**
         * Map items
         */
        const itemWrapper = document.getElementById(this.itemWrapperId)
        const itemContainer = document.createElement("div")
        itemContainer.classList.add("item-container")

        itemWrapper.appendChild(itemContainer)

        document.addEventListener("dragstart", (e) => {
            this.container.classList.add("ready-to-drop")
            e.dataTransfer.setData("id", e.target.id)
        })

        document.addEventListener("dragend", (e) => {
            this.container.classList.remove("ready-to-drop")
        })

        document.addEventListener("dragover", (e) => {
            e.preventDefault()
        })

        document.addEventListener("drop", (e) => {
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

        this.container.style.cursor = 'grab'

        let pos = {top: 0, left: 0, x: 0, y: 0}

        const mouseDownHandler = (e) => {
            this.container.style.cursor = 'grabbing'
            this.container.style.userSelect = 'none'

            pos = {
                left: this.container.scrollLeft,
                top: this.container.scrollTop,
                x: e.clientX,
                y: e.clientY,
            }

            document.addEventListener('mousemove', mouseMoveHandler)
            document.addEventListener('mouseup', mouseUpHandler)
        }

        const mouseMoveHandler = (e) => {
            const dx = e.clientX - pos.x
            const dy = e.clientY - pos.y

            this.container.scrollTop = pos.top - dy
            this.container.scrollLeft = pos.left - dx
        }

        const mouseUpHandler = () => {
            this.container.style.cursor = 'grab'
            this.container.style.removeProperty('user-select')

            document.removeEventListener('mousemove', mouseMoveHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }

        this.container.addEventListener('mousedown', mouseDownHandler)

        /**
         * Zoom map
         */
        const ZOOM_SPEED = 0.1

        let zoom = 1

        this.container.addEventListener("wheel", function (e) {
            e.preventDefault();

            if (e.deltaY > 0) {
                zoom -= ZOOM_SPEED
            } else {
                zoom += ZOOM_SPEED
            }

            mapImage.style.transform = `scale(${zoom})`
        })

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