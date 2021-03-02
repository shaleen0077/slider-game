class SliddingGame {
    constructor() {
        this.gameDataSet = new Set();
        this.emptyItemClass = 'grid-item-empty';
        this.positionMap = [
            [0, 0], [1, 0], [2, 0], [3, 0],
            [0, 1], [1, 1], [2, 1], [3, 1],
            [0, 2], [1, 2], [2, 2], [3, 2],
            [0, 3], [1, 3], [2, 3], [3, 3],
        ];
    }
    init() {
        this.randomPlacement();
    }
    /**
     * Create a random placement of image slices
     */
    randomPlacement() {
        const imageArray = [];
        for (let i = 0; i < 15; i++) {
            imageArray.push({ className: "grid-item-" + i, index: i });
        }
        let tempate = "";
        for (let i = imageArray.length - 1; i >= 0; i--) {
            const sliceIndex = Math.floor(Math.random() * imageArray.length);
            const imageSlice = imageArray.splice(sliceIndex, 1)[0];
            this.gameDataSet.add(imageSlice.index);
            tempate += `<div class="grid-item ${imageSlice.className}" data-id="${imageSlice.index}"></div>`;
        }
        // Push the empty image part as -1
        this.gameDataSet.add(-1);
        tempate += `<div class="grid-item ${this.emptyItemClass}"></div>`;
        document.querySelector('.play-area').innerHTML = tempate;
        this.attachClickEvent();
    }
    /**
     * Attach click event on the image slices
     */
    attachClickEvent() {
        document.querySelector('.play-area').addEventListener('click', (e) => {
            // Retrieve clicked item data-id
            const dataId = e.target.getAttribute('data-id');
            if (!dataId || parseInt(dataId) === -1) {
                this.logData('Clicked on empty slice. Try again :)', 'error');
                return;
            }
            const clickImageCordinates = this.getCordinates(parseInt(dataId));
            const canMoveImageSlice = this.moveImageSlice(clickImageCordinates[0], clickImageCordinates[1], parseInt(dataId));
            if (canMoveImageSlice) {
                this.evaluateGameStatus();
            }
        }, true);
    }
    /**
     * Evaluate the game statuss
     */
    evaluateGameStatus() {
        let index = 0;
        let wonGameFlag = true;
        this.gameDataSet.forEach((value) => {
            if (value === index) {
                index++;
            }
            else {
                wonGameFlag = false;
                return;
            }
        });
        if (wonGameFlag) {
            this.logData('You have won the game !!!', 'won-game');
        }
    }
    /**
     * Check and move the image slice to empty slice if possible
     * @param {number} x - x cordinate
     * @param {number} y - y cordinate
     * @param {number} dataId - data id
     */
    moveImageSlice(x, y, dataId) {
        const emptyImageCordinates = this.getCordinates(-1);
        const emptyX = emptyImageCordinates[0];
        const emptyY = emptyImageCordinates[1];
        if (
        // can move right
        ((x + 1) === emptyX && y === emptyY) ||
            // can move left
            ((x - 1) === emptyX && y === emptyY) ||
            // can move down
            (x === emptyX && (y + 1) === emptyY) ||
            // can move up
            (x === emptyX && (y - 1) === emptyY)) {
            // can move right
            const itemToBeEmpty = document.querySelector('.grid-item-' + dataId);
            const itemGettingImage = document.getElementsByClassName(this.emptyItemClass)[0];
            itemToBeEmpty.classList.remove('grid-item-' + dataId);
            delete itemToBeEmpty.dataset.id;
            itemGettingImage.classList.add('grid-item-' + dataId);
            itemGettingImage.setAttribute('data-id', dataId);
            itemGettingImage.classList.remove(this.emptyItemClass);
            itemToBeEmpty.classList.add(this.emptyItemClass);
            const newGameDataSet = [...this.gameDataSet];
            const emptyImageIndex = newGameDataSet.indexOf(-1);
            const movedImageIndex = newGameDataSet.indexOf(dataId);
            newGameDataSet[emptyImageIndex] = dataId;
            newGameDataSet[movedImageIndex] = -1;
            this.gameDataSet = new Set(newGameDataSet);
            this.logData('Moving the image slice');
            return true;
        }
        this.logData('Image slice cannot be moved', 'error');
        // cannot move the image slice
        return false;
    }
    /**
     * Log the passed data with class name
     * @param {string} data - Data for logging
     * @param {string} className - Class name
     * @returns void
     */
    logData(data, className = '') {
        const dataNode = document.createElement('div');
        if (className) {
            dataNode.classList.add(className);
        }
        dataNode.innerHTML = new Date().toLocaleTimeString() + ' - ' + data;
        document.querySelector('.logging').prepend(dataNode);
    }
    /**
     * Get the cordinates for the passed selected data id
     * @param dataId - Data id
     * @returns {number[]} Array containing x and y cordinates
     */
    getCordinates(dataId) {
        let clickedItemIndex = -1;
        [...this.gameDataSet].forEach((value, index) => {
            if (value === dataId) {
                clickedItemIndex = index;
                return;
            }
        });
        return this.positionMap[clickedItemIndex];
    }
}
var game = new SliddingGame();
game.init();
