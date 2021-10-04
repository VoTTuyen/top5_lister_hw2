import React from "react";
class ItemCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: this.props.text,
            className: this.props.className,
            id: this.props.id,
        }
    }
  render() {
      return <div className={this.state.className}>
          {this.state.text}
    </div>;
  }
}
export default ItemCard;
