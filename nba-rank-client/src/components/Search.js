import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Downshift from "downshift";

export class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { players: [], isLoading: false };
  }

  componentDidMount() {
    this.fetchAutoComplete();
  }

  fetchAutoComplete() {
    this.setState({ isLoading: true }, () => {
      fetch(`https://nba-rank.herokuapp.com/autocomplete`)
        .then(res => res.json())
        .then(res => {
          this.setState({
            players: res,
            isLoading: false
          });
        });
    });
  }

  render() {
    const items = this.state.players.map(({ first_name, last_name, id }) => {
      if (first_name) return { value: first_name + " " + last_name, id };
      else return { value: last_name, id };
    });
    return (
      <Downshift
        onChange={({ id }) => (window.location.href = `/players/${id}`)}
        itemToString={item => (item ? item.value : "")}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem
        }) => (
          <div>
            <Form.Control
              className="search"
              type="search"
              placeholder="Search"
              {...getInputProps()}
            ></Form.Control>
            <div {...getMenuProps()}>
              {isOpen
                ? items
                    .filter(
                      item =>
                        !inputValue ||
                        item.value
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((item, index) => (
                      <div
                        {...getItemProps({
                          key: item.value,
                          index,
                          item,
                          style: {
                            paddingLeft: "10px",
                            minWidth: "100%",
                            backgroundColor:
                              highlightedIndex === index
                                ? "lightgrey"
                                : "white",
                            fontWeight:
                              selectedItem === item ? "bold" : "normal"
                          }
                        })}
                      >
                        {item.value}
                      </div>
                    ))
                : null}
            </div>
          </div>
        )}
      </Downshift>
    );
  }
}
