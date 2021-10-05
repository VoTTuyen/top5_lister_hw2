import jsTPS_Transaction from "./jsTPS.js"

/**
 * RenameItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Tuyen Vo
 */
export default class RenameItem_Transaction extends jsTPS_Transaction {
    constructor(initRenameItem, initList, initIndex, initOldText, initNewText) {
        super();
        this.renameItem = initRenameItem;
        this.list = initList
        this.index = initIndex;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        this.renameItem(this.list, this.index, this.newText);
    }
    
    undoTransaction() {
        this.renameItem(this.list, this.index, this.oldText);
    }
}