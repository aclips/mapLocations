class Point {

    id;
    label;
    image;
    position = {
        x: null,
        y: null
    };
    posted = false;

    /**
     * @param {Object} params
     * @param {string} params.id
     * @param {string} params.label
     * @param {string} params.image
     * @param {{x:number, y:number}} params.position
     */
    constructor(params) {
        if (!params.id) {
            throw new Error('Pocation parameter is not valid ID.')
        }

        this.id = params.id
        this.label = params.label
        this.image = params.image

        if (typeof params.position == 'object') {
            if (params.position.x && params.position.y) {
                this.position = params.position
                this.posted = true
            }
        }
    }

    /**
     * Проверка присутствия точки в локации
     *
     * @returns {boolean}
     */
    isPosted() {
        return this.posted === true
    }
}

export default Point
