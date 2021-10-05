import React from "react";

export default class EditToolbar extends React.Component {
  render() {
    const {
      undoButtonOn,
      redoButtonOn,
      closeButtonOn,
      closeCallback,
      undoCallback,
      redoCallback,
    } = this.props;

    let undoClassName = "top5-button-disabled";
    if (undoButtonOn) {
      undoClassName = "top5-button";
    }

    let redoClassName = "top5-button-disabled";
    if (redoButtonOn) {
      redoClassName = "top5-button";
    }

    let closeClassName = "top5-button-disabled";
    if (closeButtonOn) {
      closeClassName = "top5-button";
    }

    return (
      <div id="edit-toolbar">
        <div
          type="button"
          id="undo-button"
          className={undoClassName}
          onClick={undoCallback}
        >
          &#x21B6;
        </div>
        <div
          type="button"
          id="redo-button"
          className={redoClassName}
          onClick={redoCallback}
        >
          &#x21B7;
        </div>
        <div
          type="button"
          id="close-button"
          className={closeClassName}
          onClick={closeCallback}
        >
          &#x24E7;
        </div>
      </div>
    );
  }
}
