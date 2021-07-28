import React, { Component } from "react";
import "../css/PostCardForm.css";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import ListRecipients from "./ListRecipients.js";
import { addresses } from "lob/lib/resources";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';


const useStyles = theme => ({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "left",
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.25)",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      display: "flex"
    },
    button: {
        color: theme.palette.getContrastText('#0499D7'),
        backgroundColor: "#0499D7",
        textTransform: "none",
        display: "flex",
        width: "25%",
        "&:hover": {
          backgroundColor: "#0499D7"
        }
    },
    address: {
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
            search: '',
            recipientInputModal: false,
            selectedAddress: []

            
        }
        this.recipientInputChange = this.recipientInputChange.bind(this);
        this.selectAddress = this.selectAddress.bind(this);
        this.toggleModal = this.toggleModal.bind(this);

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
            console.log(res.data);
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
        
        this.state.addresses.sort(this.filter(value.toUpperCase()));
    }

    filter(query) {
        return function(person1, person2) {
            const person1Name = person1.name.split(' ');
            const person2Name = person2.name.split(' ');
            if(person1Name[0].includes(query) < person2Name[0].includes(query)) {
                return 1;
            } 
            else if (person1Name[0].includes(query) > person2Name[0].includes(query)) {
                return -1;
            } 
            else {
                if(person1.name < person2.name)
                    return 1;
                else
                    return -1;
            }
        }
    }

    toggleModal(){
        this.setState({
            recipientInputModal: false,
        })
    }

    
    selectAddress(address) {
        console.log("PARENT");
        console.log(address);
        this.setState({
            selectedAddress: address
        });
        console.log(this.state.selectedAddress);
    }

    onCancel() {
        this.setState({
            selectedAddress: [],
            search: '',
        })
        this.toggleModal();
    }

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


                { this.state.recipientInputModal && 
                    <ListRecipients 
                        selectAddress={this.selectAddress} 
                        toggleModal={this.toggleModal}
                        addresses={this.state.addresses}/> 
                }

                { this.state.selectedAddress.length == 0 ?  
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
                    onClick={() => { this.testing()}}>
                    Submit
                </Button>
            </div>
        );
    }
}

export default withStyles(useStyles)(PostCardForm);