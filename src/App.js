import React from "react";
import "./App.css";

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from "./db/DBManager";

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from "./components/DeleteModal";
import Banner from "./components/Banner.js";
import Sidebar from "./components/Sidebar.js";
import Workspace from "./components/Workspace.js";
import Statusbar from "./components/Statusbar.js";
import jsTPS from "./jsTPS.js";
import MoveItem_Transaction from "./MoveItem_Transaction";
import RenameItem_Transaction from "./RenameItem_Transaction";

/*
Undo/Redo - Undo/Redo should also work using Control-Z and Control-Y.
List Saving - after every single edit, data should be saved to local storage. Remember to also save session data when necessary, like when a list is deleted.
Foolproof Design - make sure the undo, redo, and close buttons are only enabled when they are usable. When disabled, they should look faded (use transparency) and should not be clickable.
*/

class App extends React.Component {
  constructor(props) {
    super(props);

    // THIS WILL TALK TO LOCAL STORAGE
    this.db = new DBManager();
    this.jsTPS = new jsTPS();

    // GET THE SESSION DATA FROM OUR DATA MANAGER
    let loadedSessionData = this.db.queryGetSessionData();

    // SETUP THE INITIAL STATE
    this.state = {
      currentList: null,
      sessionData: loadedSessionData,
      keyNamePair: null, // for deleting a list (key = (id, name))
    };
  }
  sortKeyNamePairsByName = (keyNamePairs) => {
    keyNamePairs.sort((keyPair1, keyPair2) => {
      // GET THE LISTS
      return keyPair1.name.localeCompare(keyPair2.name);
    });
  };
  // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
  createNewList = () => {
    // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
    let newKey = this.state.sessionData.nextKey;
    let newName = "Untitled" + newKey;

    // MAKE THE NEW LIST
    let newList = {
      key: newKey,
      name: newName,
      items: ["?", "?", "?", "?", "?"],
    };

    // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
    // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
    let newKeyNamePair = { key: newKey, name: newName };
    let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
    this.sortKeyNamePairsByName(updatedPairs);

    // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
    // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
    // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
    // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
    // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
    // SHOULD BE DONE VIA ITS CALLBACK
    this.setState(
      (prevState) => ({
        currentList: newList,
        sessionData: {
          nextKey: prevState.sessionData.nextKey + 1,
          counter: prevState.sessionData.counter + 1,
          keyNamePairs: updatedPairs,
        },
      }),
      () => {
        // PUTTING THIS NEW LIST IN PERMANENT STORAGE
        // IS AN AFTER EFFECT
        this.db.mutationCreateList(newList);
      }
    );
  };
  renameList = (key, newName) => {
    let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
    // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
    for (let i = 0; i < newKeyNamePairs.length; i++) {
      let pair = newKeyNamePairs[i];
      if (pair.key === key) {
        pair.name = newName;
      }
    }
    this.sortKeyNamePairsByName(newKeyNamePairs);

    // WE MAY HAVE TO RENAME THE currentList
    let currentList = this.state.currentList;
    if (currentList.key === key) {
      currentList.name = newName;
    }

    this.setState(
      (prevState) => ({
        currentList: prevState.currentList,
        sessionData: {
          nextKey: prevState.sessionData.nextKey,
          counter: prevState.sessionData.counter,
          keyNamePairs: newKeyNamePairs,
        },
      }),
      () => {
        // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
        // THE TRANSACTION STACK IS CLEARED
        let list = this.db.queryGetList(key);
        list.name = newName;
        this.db.mutationUpdateList(list);
        this.db.mutationUpdateSessionData(this.state.sessionData);
      }
    );
  };
  // RENAME LIST ITEM
  renameItem = (index, newText) => {
    let list = this.state.currentList;
    let oldText = list.items[index];

    let foo = (list, index, newText) => {
      list.items[index] = newText;
      this.db.mutationUpdateList(list);
    };
    
    let renameItem_Transaction = new RenameItem_Transaction(foo, list, index, oldText, newText);
    this.jsTPS.addTransaction(renameItem_Transaction);
    this.setState((prevState) => ({
      currentList: prevState.currentList,
    }));
  };
  // DRAG AND DROP  
  moveItem = (oldIndex, newIndex) => {
    let list = this.state.currentList;
    let foo = (list, oldIndex, newIndex) => {
      list.items.splice(newIndex, 0, list.items.splice(oldIndex, 1)[0]);
      this.db.mutationUpdateList(list);
    };
    let moveItem_Transaction = new MoveItem_Transaction(foo, list, oldIndex, newIndex);
    this.jsTPS.addTransaction(moveItem_Transaction);
    this.setState((prevState) => ({
      currentList: prevState.currentList
    }));
  };
  // UNDO AND REDO FUNCTION
  undo = () => {
    if (this.jsTPS.hasTransactionToUndo()) {
          this.jsTPS.undoTransaction();
    } else {
      
    }
    this.setState((prevState) => ({
      currentList: prevState.currentList,
    }));
  };
  redo = () => {
    if (this.jsTPS.hasTransactionToRedo()) {
      this.jsTPS.doTransaction();
    } else {
      
    }
      this.setState((prevState) => ({
        currentList: prevState.currentList,
      }));
    
  };
  // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
  loadList = (key) => {
    let newCurrentList = this.db.queryGetList(key);
    this.setState(
      (prevState) => ({
        currentList: newCurrentList,
        sessionData: prevState.sessionData,
      }),
      () => {
        // ANY AFTER EFFECTS?
      }
    );
  };
  // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
  closeCurrentList = () => {
    this.setState(
      (prevState) => ({
        currentList: null,
        listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
        sessionData: this.state.sessionData,
        keyNamePair: null,
      }),
      () => {
        // ANY AFTER EFFECTS?
      }
    );
  };
  deleteList = (keyNamePair) => {
    // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
    // WHICH LIST IT IS THAT THE USER WANTS TO
    // DELETE AND MAKE THAT CONNECTION SO THAT THE
    // NAME PROPERLY DISPLAYS INSIDE THE MODAL
    this.showDeleteListModal();
    this.setState((prevState) => ({
      currentList: prevState.currentList,
      keyNamePair: keyNamePair,
    }));
  };

  deleteConfirm = () => {
    let key = this.state.keyNamePair.key;
    console.log("Key: " + key);
    this.db.mutationDeleteList(key);
    this.hideDeleteListModal();
    let loadedSessionData = this.db.queryGetSessionData();
    this.setState((prevState) => ({
      currentList: prevState.currentList,
      keyNamePair: null,
      sessionData: loadedSessionData,

    }));
  };
  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
  showDeleteListModal() {
    let modal = document.getElementById("delete-modal");
    modal.classList.add("is-visible");
  }
  // THIS FUNCTION IS FOR HIDING THE MODAL
  hideDeleteListModal() {
    let modal = document.getElementById("delete-modal");
    modal.classList.remove("is-visible");
  }
  render() {
    return (
      <div id="app-root">
        <Banner title="Top 5 Lister"
          closeCallback={this.closeCurrentList}
          undoCallback={this.undo}
          redoCallback={this.redo}
        
        />
        <Sidebar
          heading="Your Lists"
          currentList={this.state.currentList}
          keyNamePairs={this.state.sessionData.keyNamePairs}
          createNewListCallback={this.createNewList}
          deleteListCallback={this.deleteList}
          loadListCallback={this.loadList}
          renameListCallback={this.renameList}
        />
        <Workspace
          currentList={this.state.currentList}
          renameItemCallback={this.renameItem}
          moveItemCallback={this.moveItem}
        />

        <Statusbar currentList={this.state.currentList} />
        <DeleteModal
          listKeyPair={this.state.keyNamePair}
          hideDeleteListModalCallback={this.hideDeleteListModal}
          deleteConfirm={this.deleteConfirm}
        />
      </div>
    );
  }
}

export default App;
