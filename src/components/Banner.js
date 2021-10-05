import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
  render() {
    const {
      title,
      undoButtonOn,
      redoButtonOn,
      closeButtonOn,
      undoCallback,
      redoCallback,
      closeCallback,
    } = this.props;
    return (
      <div id="top5-banner">
        {title}
        <EditToolbar
          undoButtonOn={undoButtonOn}
          redoButtonOn={redoButtonOn}
          closeButtonOn={closeButtonOn}
          closeCallback={closeCallback}
          undoCallback={undoCallback}
          redoCallback={redoCallback}
        />
      </div>
    );
  }
}
