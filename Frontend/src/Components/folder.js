import React, { Component } from "react";
import FolderIcon from "@material-ui/icons/Folder";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import { Menu, Item, Separator, Submenu, MenuProvider } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";

export default class folder extends Component {
  constructor() {
    super();
    this.state = {
      folders: [],
    };

  }
  
//    onClick = this.onClick.bind(this);
   MyAwesomeMenu = () => (
    <Menu id="menu_id">
      <Item onClick={this.onClick}>delete</Item>
      <Item onClick={this.onClick}>Add File</Item>
      <Separator />
      <Item disabled>NA</Item>
      <Separator />
      
    </Menu>
  );
  async componentWillMount() {
    await this.fetchFolders(null);
  }
  async fetchFolders(path) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    console.log(
      "http://localhost:5000/tree" + (path == null ? "" : `/${path}`)
    );
    let response = await fetch(
      "http://localhost:5000/tree" + (path == null ? "" : `/${path}`),
      requestOptions
    );
    let json = await response.json();
    this.setState(
      (prevState, props) => ({ folders: json[0].children }),
      () => {
        console.log(this.state);
      }
    );
    console.log("Update Complete");
  }

  render() {
    return (
      <div>
          
        <Button onClick={(e) => this.fetchFolders(this.state.current)}>
          <SkipPreviousIcon></SkipPreviousIcon>
        </Button>
        <div>
          {this.state.folders.map((fold) => (
            <div>
              <Button onClick={(e) => this.fetchFolders(fold.name)}>
                <FolderIcon
                  style={{
                    width: 60,
                    height: 60,
                    fontSize: "large",
                    color: "inherit",
                  }}
                ></FolderIcon>
                 <Typography>{fold.name}</Typography>
              </Button>
             
            </div>
          ))}
        </div>
       
        
      </div>
    );
  }
}
