class Panel {
    labels = {}
    container;
    userWrapper;
    map;
    editable = false;
    callback = {};

    /**
     *
     * @param {HTMLElement|String} container HTML element or its ID
     * @param {Map} map
     * @param {Object} params
     * @params {string} params.labelName
     */
    constructor(container, map, params) {
        if (typeof container === 'string') {
            this.container = document.getElementById(container)
            if (!this.container) {
                throw new Error('Container parameter is not valid ID.')
            }
        } else {
            this.container = container;
        }

        this.editable = params.editable === true

        this.map = map

        this.labels = params.labels
        this.callback = params.callback

        this.init()
    }

    init() {
        this.container.innerText = ''

        let content = document.createElement('div')
        content.classList.add('content')

        let label = document.createElement('div')
        label.classList.add('label')
        label.innerText = this.labels['panelName'] ?? '...'

        content.append(label)

        this.userWrapper = document.createElement('div')
        this.userWrapper.classList.add('user-wrapper')
        this.userWrapper.innerText = ''

        // @TODO вынести в настройки
        let margin

        if (this.isEditable()) {
            margin = 110
        } else {
            margin = 55
        }

        this.userWrapper.style.height = (this.container.clientHeight - margin) + 'px'

        content.append(this.userWrapper)

        if (this.isEditable()) {
            let btnWrapper = document.createElement('div')
            btnWrapper.classList.add('btn-wrapper')

            if (this.callback['save']) {
                let saveBtnNode = document.createElement('div')
                saveBtnNode.classList.add('btn')
                saveBtnNode.innerText = this.labels['saveBtn'] ?? '...'

                saveBtnNode.addEventListener('click', (e) => {
                    this.callback['save'](e, this)
                })

                btnWrapper.append(saveBtnNode)
            }

            if (this.callback['add']) {
                let saveBtnNode = document.createElement('div')
                saveBtnNode.classList.add('btn')
                saveBtnNode.innerText = this.labels['addUserBtn'] ?? '...'

                saveBtnNode.addEventListener('click', (e) => {
                    this.callback['add'](e, this)
                })

                btnWrapper.append(saveBtnNode)
            }

            content.append(btnWrapper)
        }

        this.container.append(content)
        this.actualizeUserList()
    }

    actualizeUserList() {
        let location = this.map.getActiveLocation()

        if (location) {
            let points = location.getPoints()

            this.userWrapper.innerHTML = ''

            if (points.length > 0) {
                for (let point of points) {
                    this.drawUserPoint(point)
                }
            } else {
                let emptyMapNode = document.createElement('div')
                emptyMapNode.classList.add('empty-map')
                emptyMapNode.innerText = this.labels['emptyMap'] ?? '...'
                this.userWrapper.append(emptyMapNode)
            }
        }
    }

    drawUserPoint(point) {
        let userPointNode = document.createElement('div')
        userPointNode.classList.add('user-point')

        let userImageNode = document.createElement('div')
        userImageNode.classList.add('user-pic', 'inline')

        // @TODO вынести стили в конфиг
        userImageNode.style.width = '25px'
        userImageNode.style.height = '25px'
        userImageNode.style.background = '#d9d9d9'
        userImageNode.style.borderRadius = '20px'
        userImageNode.style.backgroundImage = 'url(' + point.image + ')'
        userImageNode.style.backgroundSize = 'contain'
        userImageNode.style.border = '2px solid #868686'

        userPointNode.append(userImageNode)

        let userNameNode = document.createElement('div')
        userNameNode.classList.add('user-name', 'inline')
        userNameNode.innerText = point.label

        userPointNode.append(userNameNode)

        userPointNode.addEventListener('click', (e) => {
            this.map.getActiveLocation().moveToPoint(point.id)
        })

        this.userWrapper.append(userPointNode)
    }

    /**
     * Проверка активности режима редактирования
     * @returns {boolean}
     */
    isEditable() {
        return this.editable === true
    }

    /**
     * Установка режима просмотра
     */
    setViewMode() {
        this.editable = false
        this.init()
    }

    /**
     * Установка режима редактирования
     */
    setEditMode() {
        this.editable = true
        this.init()
    }
}

export default Panel
