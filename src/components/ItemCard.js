import React from "react";

class ItemCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      className: this.props.className,
      id: this.props.id,
      editActive: false,
      renameItemCallback: this.props.renameItemCallback,
      moveItemCallback: this.props.moveItemCallback
    };
  }

  handleClick = (event) => {
    if (event.detail === 2) {
      this.handleToggleEdit(event);
    }
  };
  handleToggleEdit = (event) => {
    this.setState({ editActive: !this.state.editActive });
  };
  handleUpdate = (event) => {
    this.setState({ text: event.target.value });
  };
  handleKeyPress = (event) => {
    if (event.code === "Enter") {
      this.handleBlur();
    }
  };
  handleBlur = (event) => {
    let id = this.state.id;
    let textValue = this.state.text;
    console.log("ListItem handlerBlur: " + textValue);
    this.props.renameItemCallback(id, textValue);
    this.handleToggleEdit();
  };

  handleDragStart = (event) => {
    console.log('drag start');
    event.dataTransfer.setData("id", event.target.id);
  };

  handleDragLeave = (event) => {
    this.setState((prevState) => ({
      className: "top5-item"
    }));


  }

  handleDragOver = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      className: "top5-item-dragged-to"
    }));
  }

  handleDrop = (event) => {
    event.preventDefault();
    let data = event.dataTransfer.getData("id");
    let oldIndex = parseInt(data);
    let newIndex = parseInt(this.state.id);
    this.state.moveItemCallback(oldIndex, newIndex);
    console.log("Data:" + data)
  }

  render() {
    if (this.state.editActive) {
      return (
        <input
          id={this.state.id}
          className={this.state.className}
          type="text"
          onKeyPress={this.handleKeyPress}
          onBlur={this.handleBlur}
          onChange={this.handleUpdate}
          defaultValue={this.state.text}
        />
      );
    } else {
      return (
        <div
          id={this.state.id}
          className={this.state.className}
          onClick={this.handleClick}
          draggable='true'
          onDragStart={this.handleDragStart}
          onDragLeave={this.handleDragLeave}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
        >
          {this.state.text}
        </div>
      );
    }
  }
}
export default ItemCard;
