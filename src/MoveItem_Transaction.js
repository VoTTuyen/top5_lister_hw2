import jsTPS_Transaction from "./jsTPS.js"
/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Tuyen Vo
 */
export default class MoveItem_Transaction extends jsTPS_Transaction {
    constructor(initMoveItem, initList, initOldIndex, initNewIndex) {
        super();
        this.moveItem = initMoveItem;
        this.list = initList;
        this.oldIndex = initOldIndex;
        this.newIndex = initNewIndex;
    }

    doTransaction() {
        this.moveItem(this.list, this.oldIndex, this.newIndex);
    }
    
    undoTransaction() {
        this.moveItem(this.list, this.newIndex, this.oldIndex);
    }
}