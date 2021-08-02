import React, { Component } from "react";
import "../css/PostCardForm.css";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import ListRecipients from "./ListRecipients.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';


const useStyles = theme => ({
    root: {
      padding: "2px 4px",
      alignItems: "left",
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.25)",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      height: "3.5vh",
      display: "flex"
    },
    button: {
        color: theme.palette.getContrastText('#0499D7'),
        backgroundColor: "#0499D7",
        textTransform: "none",
        display: "flex",
        height: "3.5vh",
        width: "25%",
        "&:hover": {
          backgroundColor: "#0499D7"
        }
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    address: {
        width: "100%",
        padding: "2px 4px",
        display: "flex",
        alignItems: "left",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.25)",
    },
    cancel: {
        cursor: "pointer"
    },
});

class PostCardForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            addresses: [],
            filtered: [],
            search: '',
            recipientInputModal: false,
            selectedAddress: [],
            submitted: false,      
        }
        this.recipientInputChange = this.recipientInputChange.bind(this);
        this.selectAddress = this.selectAddress.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleClose = this.handleClose.bind(this);

    }
    componentDidMount() {
        this.getItems();
    }

    compare(person1, person2 ) {
        if (person1.name > person2.name){
            return 1;
        }
        if (person1.name < person2.name){
            return -1;
        }
        return 0;
    }

    getItems() {
        // var url = 'https://api.lob.com/v1/addresses/test_8ddaad35dc02260ae8a4e6e33d9f3ade7ae:';
        // fetch(url).then( response => {
        //     console.log(response.json);
        // })
        var Lob = require('lob')('test_8ddaad35dc02260ae8a4e6e33d9f3ade7ae');
        Lob.addresses.list()
            .then((res) => {
                this.setState({
                    addresses: res.data
                })
                this.state.addresses.sort(this.compare);
            // console.log(res.data);
            })
            .catch((e) => {
            console.log(e);
        });
        
        // var searchUrl = 'https://api.lob.com/v1/search?q="testing"';
        // fetch(searchUrl).then( response => {
        //     console.log(response.json);
        // })
        // console.log(Lob);
    }

    recipientInputChange(e) {
        var value = e.target.value
        if (e.target.value !== '') {
            this.setState({
                search: value.toUpperCase(),
                recipientInputModal: true,
            });
        }
        else {
            this.setState({
                recipientInputModal: false,
            });
        }
        let filter = this.state.addresses.sort(this.filter(value.toUpperCase()));
        this.setState({
            filtered: filter
        })
    }

    filter(query) {
        return function(person1, person2) {
            // const person1Name = person1.name.split(/\s+/); //split by any amount of spaces
            // const person2Name = person2.name.split(/\s+/);
            // var index1 = person1Name[0].indexOf(query); //check index of searched item
            // var index2 = person2Name[0].indexOf(query);
            
            var index1 = person1.name.indexOf(query); //check index of searched item in name
            var index2 = person2.name.indexOf(query);

            if (index1 === -1 && index1 < index2) {     //if searched item does not exist for each name
                return 1;                               //has higher precedence in name2 if not found name1
            }
            else if (index2 === -1 && index1 > index2) { 
                return -1;                              //has higher precedence in name1 if not found name2
            }   
            else if (index1 > index2) {                 //name2 has higher precedence if indexOf is smaller than name1
                return 1;
            } 
            else if (index1 < index2) {                 //name1 has higher precedence if indexOf is smaller than name2
                return -1;
            }
            else {              
                if(person1.name < person2.name)         //if either are not found then compare names in general
                    return 1;
                else
                    return -1;
            }
        };
    }

    toggleModal(){
        this.setState({
            recipientInputModal: false,
        });
    }

    
    selectAddress(address) {
        this.setState({
            selectedAddress: address
        });
    }

    onSubmit() {
        this.setState({
            submitted: true
        })
        
    }

    onCancel() {
        this.setState({
            selectedAddress: [],
            search: '',
        })
        this.toggleModal();
    }
    
    handleClose(){
        this.setState({
            submitted: false
        }) 
        this.onCancel();
    };

    render() {
        
        const { classes } = this.props;

        return (
            <div className="form-component">

                <p className="form-lables">
                    Description:
                </p>
                <Paper className={classes.root} component="form">
                    <InputBase className={classes.input} placeholder="Describe the mail"/>
                </Paper>

                <br/>

                <p className="form-lables">
                    To:
                </p>

                { this.state.selectedAddress.length === 0 ?  
                    <Paper className={classes.root} component="form">
                        <InputBase 
                        className={classes.input} 
                        onChange={this.recipientInputChange}
                        placeholder="Recipient Name"/>
                    </Paper>
                    :
                    <Table className={classes.root}>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                        <p className="name-text">
                                            {this.state.selectedAddress.name}
                                        </p>
                                        <p className="address-text">
                                            {this.state.selectedAddress.address_line1} {this.state.selectedAddress.address_line2} 
                                            <br></br>
                                            {this.state.selectedAddress.address_city} {this.state.selectedAddress.address_state} {this.state.selectedAddress.address_zip} 
                                            <br></br>
                                            {this.state.selectedAddress.address_country}
                                        </p>
                                </TableCell>
                                <TableCell align={"center"}>
                                    <p className="address-id" >
                                        {this.state.selectedAddress.id}
                                    </p>
                                </TableCell>
                                <TableCell 
                                    align={"center"} 
                                    className={classes.cancel}
                                    onClick={() => this.onCancel()}>
                                    <p className="address-id" >
                                        X
                                    </p>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                }

                
                { this.state.recipientInputModal &&
                     <div className="list-component">
                        <ListRecipients 
                            selectAddress={this.selectAddress} 
                            toggleModal={this.toggleModal}
                            addresses={this.state.filtered}/> 
                    </div>
                }

                <br/>
                <p className="form-lables">
                    From:
                </p>
                <Paper className={classes.root} component="form">
                    <InputBase className={classes.input} placeholder="Describe"/>
                </Paper>
                <br/>
                <p className="form-lables">
                    Front:
                </p>
                <Paper className={classes.root} component="form">
                    <InputBase className={classes.input} placeholder=""/>
                </Paper>
                <br/>
                <p className="form-lables">
                    Back:
                </p>
                <Paper className={classes.root} component="form">
                    <InputBase className={classes.input} placeholder=""/>
                </Paper>
                <br/>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => {this.onSubmit()}}>
                    Submit
                </Button>
                {this.state.submitted && 
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={this.state.submitted}
                        onClose={this.handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                    >
                    <Fade in={this.state.submitted}>
                      <div className={classes.paper}>
                            <h2 id="transition-modal-title">Mock Postcard sent verification!</h2>
                            <b>Name:</b> 
                                <p>{this.state.selectedAddress.name}</p>
                            <br/>
                            <b>AddressID:</b> 
                                <p>{this.state.selectedAddress.id}</p>
                            <br/>
                            <b>Address:</b>
                                <p>
                                    {this.state.selectedAddress.address_line1} {this.state.selectedAddress.address_line2} 
                                <br></br>
                                    {this.state.selectedAddress.address_city} {this.state.selectedAddress.address_state} {this.state.selectedAddress.address_zip} 
                                <br></br>
                                    {this.state.selectedAddress.address_country}
                                </p>
                      </div>
                    </Fade>
                  </Modal>
                }
            </div>
        );
    }
}

export default withStyles(useStyles)(PostCardForm);