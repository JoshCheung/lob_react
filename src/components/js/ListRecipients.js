import React, { Component } from "react";
import { Scrollbars } from 'react-custom-scrollbars';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import "../css/ListRecipients.css";

class ListRecipients extends Component {
    constructor (props) {
        super(props);
        this.state = {
            
        }
    }


    selectAddress(address) {
        console.log(address);
        this.props.selectAddress(address);
        this.props.toggleModal();
    }
    

    render() {
        return (
            <div className="list-container">
                <Scrollbars>
                    <Table>
                        <TableBody>
                            {
                                this.props.addresses.map((address, index) => 
                                    <TableRow 
                                        key={index}
                                        onClick={() => this.selectAddress(address)}>

                                        <TableCell>
                                                <p className="name-text">
                                                    {address.name}
                                                </p>
                                                <p className="address-text">
                                                    {address.address_line1} {address.address_line2} 
                                                    <br></br>
                                                    {address.address_city} {address.address_state} {address.address_zip} 
                                                    <br></br>
                                                    {address.address_country}
                                                </p>
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <p className="address-id" >
                                                {address.id}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )   
                            }
                        </TableBody>
                    </Table>
                </Scrollbars>
            </div>
        );
    }
}
export default ListRecipients;




// {/* 