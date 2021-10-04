import React from "react";
import ItemCard from "./ItemCard";

export default class Workspace extends React.Component {
  render() {
    const { currentList, renameItemCallback, moveItemCallback } = this.props;
    let divItems;
    if (currentList !== null) {
      let id = 0;
      divItems = (
        <div id="edit-items">
          {currentList.items.map((item) => (
            <ItemCard
              key={item + id}
              className="top5-item"
              id={id++}
              text={item}
              renameItemCallback={renameItemCallback}
              moveItemCallback={moveItemCallback}
            />
          ))}
        </div>
      );
    } else {
      divItems = <div></div>;
    }
    return (
      <div id="top5-workspace">
        <div id="workspace-edit">
          <div id="edit-numbering">
            <div className="item-number">1.</div>
            <div className="item-number">2.</div>
            <div className="item-number">3.</div>
            <div className="item-number">4.</div>
            <div className="item-number">5.</div>
          </div>
          {divItems}
        </div>
      </div>
    );
  }
}
