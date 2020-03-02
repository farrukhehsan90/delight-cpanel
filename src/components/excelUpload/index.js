import React from 'react';
import readXlsxFile from 'read-excel-file';
import firebase from 'firebase';
import { ExportCSV } from './DownloadExcel';
import { Button, CircularProgress } from '@material-ui/core';
import { Input } from '@material-ui/core';
class ExcelUpload extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users: {},
            found: [],
            notFound: [],
            alreadyUpdated: [],
            disableUpdate: false,
            loadingUsers: true
        }
        this.myRef = React.createRef();
    }
    fetchUsers = () => {
        this.setState({ loadingUsers: true });

        let ref = firebase.database().ref("users");
        ref.on('value', (val) => {
                let users = val.val()
                this.setState({ loadingUsers: false, users });
            })
    }
    componentDidMount() {
        this.fetchUsers();
    }
    resetInput = () => {
        let ele = document.getElementById("excel-file-input");
        ele.target.value = "";
    }
    fileUpload = (event) => {
        readXlsxFile(event.target.files[0]).then((rows) => {
            rows.shift();
            let foundArr = [];
            let notFoundArr = [];
            let alreadyUpdated = [];
            rows.map(val => {
                let foundOne = {};
                let obj = Object.keys(this.state.users).find(u => {
                    let attributes = this.state.users[u]["attributes"];
                    if ("attributes" in attributes) {
                        attributes = attributes["attributes"];
                    }
                    if (attributes["custom:civilIdNumber"] === val[0].toString()
                        && attributes["phone_number"].includes(val[1].toString())
                    ) {
                        foundOne = { id: u, isSignedUp: u.isSignedUp, phone_number: attributes["phone_number"], civilIdNumber: attributes["custom:civilIdNumber"] }
                        return true;
                    }
                })
                if (obj) {
                    if (this.state.users[foundOne.id].isSignedUp === true) {
                        alreadyUpdated.push(foundOne);
                    } else {
                        foundArr.push(foundOne);
                    }
                    foundOne = {};
                } else {
                    notFoundArr.push({ civilIdNumber: val[0], phone_number: val[1] })
                }
            })
            this.setState({ found: foundArr, notFound: notFoundArr, alreadyUpdated });
        })
    }
    updatedData = () => {
        this.setState({ disableUpdate: true })
        let updateQuery = this.state.found.reduce((acc, val) => {
            return {
                ...acc,
                [`${val.id}/isSignedUp`]: true
            }
        }, {})
        firebase.database().ref("users").update(updateQuery, (err) => {
            if (!err) {
                alert("Update Successfully");
                this.fetchUsers();
            }
        })
    }
    // makeFalse = () => {
    //     let updateQuery = Object.keys(this.state.users).reduce((acc, val) => {
    //         return {
    //             ...acc,
    //             [`${val}/isSignedUp`]: false
    //         }
    //     }, {})
    //     firebase.database().ref("users").update(updateQuery, (err) => {
    //         if (!err) {
    //             alert("success");
    //         }
    //     })
    // }
    render() {
        return <div>
            {/* <Button onClick={this.makeFalse}>makeFalse</Button> */}
            {
                !this.state.loadingUsers ? <Input ref={ this.myRef} id="excel-file-input" name="file" type="file" onChange={this.fileUpload} /> : <CircularProgress color="secondary" />
            }
            {
                this.state.alreadyUpdated.length > 0 || this.state.found.length > 0 || this.state.notFound.length > 0 ?
                    <table className="my-custom-table">
                        <thead>
                            <tr><th>Civil ID</th><th>Phone Number</th></tr>
                        </thead>
                        <tbody>

                            {
                                this.state.found.length > 0 && <tr className="action-header"><th>To Be Updated</th></tr>

                            }
                            {
                                this.state.found.map(val => {
                                    return <tr>
                                        <td> {val.civilIdNumber}</td>
                                        <td> {val.phone_number}</td>
                                    </tr>
                                })
                            }
                            {
                                this.state.found.length > 0 &&
                                <tr>
                                    <th>
                                        <Button variant="contained" color="primary" onClick={this.updatedData} disabled={this.state.disableUpdate}>Update</Button>
                                    </th>
                                </tr>
                            }
                            {
                                this.state.alreadyUpdated.length > 0 &&
                                <tr className="action-header"><th>Already Updated</th></tr>
                            }
                            {
                                this.state.alreadyUpdated.map(val => {
                                    return <tr>
                                        <td> {val.civilIdNumber}</td>
                                        <td> {val.phone_number}</td>
                                    </tr>
                                })
                            }
                            {
                                this.state.notFound.length > 0 &&
                                <tr className="action-header"><th>Not Signed Up Yet</th></tr>
                            }
                            {
                                this.state.notFound.map(val => {
                                    return <tr>
                                        <td> {val.civilIdNumber}</td>
                                        <td> {val.phone_number}</td>
                                    </tr>
                                })
                            }
                            <tr>
                                <th>
                                    {
                                        this.state.notFound.length > 0 && <ExportCSV csvData={this.state.notFound} fileName={'asdad'} />
                                    }
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    : ''
            }

        </div>
    }
}
export default ExcelUpload;