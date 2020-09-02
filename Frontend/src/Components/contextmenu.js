import { Menu, Item, Separator, Submenu, MenuProvider } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
import Background from "./backgroud";
import React from "react";
import Typography from "@material-ui/core/Typography";
import "./background.css";
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import Folders from "./folder";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

export default class MyMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      type: "",
      path: "",
      foldername: "",
      delete:false,
    };
  }

  onC = () => {
    this.setState({ open: false });
  };
  delete = () => {
    let { path, foldername } = this.state;
    var formdata = new FormData();
    if (path != "") {
      path = path + "/";
    }
    formdata.append("path", path + foldername);

    var requestOptions = {
      method: "DELETE",
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:5000/tree", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .then(()=>this.setState({open:false}))
      .catch((error) => console.log("error", error));
  };
  addFolder = () => {
    let { type, path, foldername, selectedFile } = this.state;
    if (path != "") {
      path = path + "/";
    }
    var formdata = new FormData();
    formdata.append("type", type);
    formdata.append("path", path + foldername);
    if (selectedFile) formdata.append("file", selectedFile);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:5000/tree", requestOptions)
      .then((response) => response.text())
      .then(() => this.setState({ open: false }))
      .catch((error) => console.log("error", error));
  };
  render() {
    const { open } = this.state;
    return (
      <div>
        <Dialog
          open={open}
          onClose={this.onC}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Actions</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="path"
              type="text"
              placeholder="If not given it would be taken as Default path"
              fullWidth
              onChange={(event, newValue) =>
                this.setState({ path: event.target.value })
              }
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Folder name"
              type="text"
              fullWidth
              onChange={(event, newValue) =>
                this.setState({ foldername: event.target.value })
              }
            />
            {this.state.type == "file" ? (
              <Input
                type="file"
                margin="dense"
                id="file"
                label="File"
                fullWidth
                onChange={(e) =>
                  this.setState({ selectedFile: e.target.files[0] })
                }
              />
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onC.bind(this)} color="primary">
              Cancel
            </Button>
            {this.state.delete? <Button onClick={this.delete.bind(this)} color="primary">
              Delete
            </Button>:
            <Button onClick={this.addFolder.bind(this)} color="primary">
              ADD
            </Button>}
          </DialogActions>
        </Dialog>

        <MenuProvider
          id="menu_id"
          style={{ display: "inline-block" }}
          component={Background}
        >
          <div>
            <Folders />
            <img
              className="bg"
              style={{ opacity: 0.1 }}
              src="https://images.unsplash.com/photo-1519120944692-1a8d8cfc107f?ixlib=rb-1.2.1&auto=format&fit=crop&w=976&q=80"
            ></img>
          </div>
        </MenuProvider>

        <Menu id="menu_id">
          <Item
            onClick={() => {
              this.setState({
                type: "folder",
                open: true,
              });
            }}
          >
            Add Folder
          </Item>
          <Separator />
          <Item
            onClick={() => {
              this.setState({
                type: "file",
                open: true,
              });
            }}
          >
            Add File
          </Item>
          <Separator />
          <Item
            onClick={() => {
              this.setState({
                delete:true,
                open: true,
              });
            }}
          >
            Delete
          </Item>
        </Menu>
      </div>
    );
  }
}
