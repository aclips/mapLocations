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

        if (typeof container === 'string') {
            this.container = document.getElementById(container)
            if (!this.container) {
                throw new Error('container parameter is not valid ID')
            }
        } else {
            this.container = container;
        }

        this.image = params.image

        this.itemWrapperId = params.itemWrapperId
        this.items = params.items

        this.build()
        this.setItems(this.items)
    }

    build() {
        const ZOOM_SPEED = 0.1

        let self = this

        this.zoom = 1
        this.itemScale = 1
        this.translateX = 0
        this.translateY = 0

        this.container.classList.add("map-locations")

        const mapContainer = document.createElement("div")
        mapContainer.classList.add("map")

        const mapImage = document.createElement("img")
        mapImage.src = this.image
        mapImage.classList.add("map-image")
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

        let targetMapItem = null

        document.addEventListener("mousedown", (e) => {

            if (e.target.classList.contains('item') && e.target.parentNode.classList.contains('map')) {
                this.container.classList.add("ready-to-drop")
                document.removeEventListener('mousemove', mouseMoveHandler)
                document.removeEventListener('mouseup', mouseUpHandler)
            }
        })

        document.addEventListener("mouseup", (e) => {

            if (e.target.classList.contains('item') && e.target.parentNode.classList.contains('map')) {
                this.container.classList.remove("ready-to-drop")
                this.container.style.cursor = 'grab'
            }
        })

        document.addEventListener("dragover", (e) => {
            e.preventDefault()

            // От тени
            if (targetMapItem && e.target.classList.contains('map')) {
                let params = targetMapItem.getBoundingClientRect()

                let x = e.layerX - (params.width / 2)
                let y = e.layerY - (params.height / 2)

                targetMapItem.style.left = x + "px"
                targetMapItem.style.top = y + "px"
            }
        })

        document.addEventListener("dragstart", (e) => {
            let id = e.target.getAttribute('data-id')

            // От тени
            if(e.target.classList.contains('item')){
                targetMapItem = e.target.cloneNode(true)
                targetMapItem.setAttribute('data-id', 'tmp')
                targetMapItem.id = 'TMP_ITEM'
                targetMapItem.classList.add('tmp-item')
                this.mapContainer.appendChild(targetMapItem)

                e.target.style.width = '1px'
                e.target.style.height = '1px'
                e.target.style.transform = `scale(0.1)`
            }

            this.container.classList.add("ready-to-drop")
            e.dataTransfer.setData("id", id)

            this.container.style.cursor = 'grab'
            this.container.style.removeProperty('user-select')
        })

        document.addEventListener("dragend", (e) => {
            e.preventDefault()
        })

        document.addEventListener("dragover", (e) => {
            e.preventDefault()
        })

        document.addEventListener("drop", (e) => {
            e.preventDefault()

            let classes = e.target.classList

            if (classes.contains('item') || classes.contains('map')) {
                let itemId = e.dataTransfer.getData("id");

                let targetItem = this.items.find(function (element) {
                    return element.id == itemId
                })

                if (targetItem) {
                    let x = 0, y = 0

                    if (classes.contains('item')) {
                        let params = targetMapItem.getBoundingClientRect()

                        x = parseInt(targetMapItem.style.left.replace('px', '')) + (params.width / 2)
                        y = parseInt(targetMapItem.style.top.replace('px', '')) + (params.height / 2)
                    } else {
                        x = e.layerX
                        y = e.layerY
                    }

                    targetItem.onMap = {
                        x: x,
                        y: y,
                    }
                }

                this.setItems(this.items)

            }

            if (targetMapItem) {
                targetMapItem.remove()
            }

            this.container.classList.remove("ready-to-drop")
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
                left: self.translateX,
                top: self.translateY,
                x: e.clientX,
                y: e.clientY,
            }

            document.addEventListener('mousemove', mouseMoveHandler)
            document.addEventListener('mouseup', mouseUpHandler)
        }

        const mouseMoveHandler = (e) => {
            const dx = e.clientX - pos.x
            const dy = e.clientY - pos.y

            self.translateX = pos.left + dx
            self.translateY = pos.top + dy

            mapContainer.style.transform = `translate(${self.translateX}px,${self.translateY}px) scale(${self.zoom})`
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
        this.container.addEventListener("wheel", function (e) {
            e.preventDefault();

            if (e.deltaY > 0) {
                self.zoom -= ZOOM_SPEED
                self.itemScale += ZOOM_SPEED
            } else {
                self.zoom += ZOOM_SPEED
                self.itemScale -= ZOOM_SPEED
            }

            mapContainer.style.transform = `translate(${self.translateX}px,${self.translateY}px) scale(${self.zoom})`
        })

        this.mapContainer = mapContainer
        this.mapImage = mapImage
        this.itemWrapper = itemWrapper
        this.itemContainer = itemContainer

    }

    setItems(items) {
        this.itemContainer.innerHTML = '';

        document.querySelectorAll('.map .item').forEach(e => e.remove());

        for (let i in items) {
            let item = items[i]
            let complexId = this.itemWrapperId + '_' + item.id

            let itemElement = document.createElement("div")

            itemElement.classList.add("itemElement")

            if (item.onMap == false) {
                itemElement.draggable = true
            } else {
                this.addPoint(item)
            }

            itemElement.setAttribute('data-id', item.id)
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

    addPoint(item) {
        let element = document.createElement('div')

        element.draggable = true
        element.setAttribute('data-id', item.id)

        let complexId = this.itemWrapperId + '_' + item.id

        element.id = complexId
        element.classList.add('item')
        element.style.top = item.onMap.y - 10 + 'px'
        element.style.left = item.onMap.x - 10 + 'px'
        element.style.transform = `scale(1)`
        this.mapContainer.appendChild(element)
    }

}