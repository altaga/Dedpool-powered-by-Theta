import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import {
    Card, CardBody,
    CardTitle, CardSubtitle, Button, Col, Row
} from 'reactstrap';

import { MQTTKEY } from "./pass.js"

import Modals from "./components/modal"

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var mqtt = require('mqtt');
var options = {
    protocol: 'mqtts',
    clientId: makeid(5),
    username: MQTTKEY,
    password: "",
    keepalive: 60,
    reconnectPeriod: 1000
};
var client = mqtt.connect('wss://mqtt.flespi.io:443', options);
const topic = "/TQR"

class BetBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal_state: false,
            blue: "1",
            red: "1",
            betW: this.props.betW,
            betL: this.props.betL,
            time: "",
            event: "",
            bet0: this.props.betlW,
            bet1: this.props.betlL,
            balance: "0",
            buttonState: false
        }
        this.addChannelPoints = this.addChannelPoints.bind(this)
    }

    componentWillUnmount() {
        client.end()
    }

    componentDidMount() {
        let _this = this
        client.on('connect', function () {
            console.log("Connection OK")
            client.subscribe(topic, function (err) {
                if (!err) {
                    console.log("MainTopic OK")
                    let myjson = {
                        "Accountin": "9F1233798E905E173560071255140b4A8aBd3Ec6",
                        "Accountout": "2E833968E5bB786Ae419c4d13189fB081Cc43bab",
                        "TF": "0",
                        "T": "0"
                    }
                    client.publish("/TQ", JSON.stringify(myjson))
                }
            })
            client.subscribe("/reflowA", function (err) {
                if (!err) {
                    console.log("Reflow OK")
                }
            })
            client.subscribe("/event", function (err) {
                if (!err) {
                    console.log("Event OK")
                }
            })
            client.subscribe("/time", function (err) {
                if (!err) {
                    console.log("Time OK")
                }
            })
            client.subscribe("/score", function (err) {
                if (!err) {
                    console.log("Score OK")
                }
            })

        })

        client.on('message', function (topic, message) {
            const note = message.toString();
            if (topic === "/time") {
                const note = message.toString();
                const a = note.split(":");
                const seconds = (+a[0]) * 60 + (+a[1]);
                if (_this.props.event === "FIRST BLOOD!") {
                    if (seconds < 120) {
                        _this.setState({
                            betW:"10"
                        })
                    }
                    else if (seconds < 180) {
                        _this.setState({
                            betW:"5"
                        })
                    }
                    else if (seconds < 240) {
                        _this.setState({
                            betW:"3"
                        })
                    }
                    else {
                        _this.setState({
                            betW:"1"
                        })
                    }
                }
                if (note !== "") {
                    _this.setState({
                        time: note
                    })
                }
            }
            else if (topic === "/TQR") {
                const note = message.toString();
                _this.setState({
                    balance: parseInt(note)
                })
            }
            else if (topic === "/score") {
                const note = message.toString().split(",");
                if (note !== ",") {
                    const tempW = parseInt(note[1]) 
                    const tempL = parseInt(note[0]) 
                    if (_this.props.event === "VICTORY!"){
                        if((tempW-tempL>100)){
                            _this.setState({
                                betW:"1000",
                                betL:"1"
                            })
                        }
                        else if((tempW-tempL>50)){
                            _this.setState({
                                betW:"100",
                                betL:"1"
                            })
                        }
                        else if((tempW-tempL>30)){
                            _this.setState({
                                betW:"50",
                                betL:"1"
                            })  
                        }
                        else if((tempW-tempL>15)){
                            _this.setState({
                                betW:"10",
                                betL:"1"
                            })
                        }
                        else if((tempW-tempL>10)){
                            _this.setState({
                                betW:"5",
                                betL:"1"
                            })
                        }
                        else if((tempW-tempL>6)){
                            _this.setState({
                                betW:"3",
                                betL:"1"
                            })
                        } 
                        else if((tempW-tempL>3)){
                            _this.setState({
                                betW:"2",
                                betL:"1"
                            })
                        }
                        else if((tempL-tempW>100)){
                            _this.setState({
                                betW:"1",
                                betL:"1000"
                            })
                        }
                        else if((tempL-tempW>50)){
                            _this.setState({
                                betW:"1",
                                betL:"100"
                            })
                        }
                        else if((tempL-tempW>30)){
                            _this.setState({
                                betW:"1",
                                betL:"50"
                            })
                        }
                        else if((tempL-tempW>15)){
                            _this.setState({
                                betW:"1",
                                betL:"10"
                            })
                        }
                        else if((tempL-tempW>10)){
                            _this.setState({
                                betW:"1",
                                betL:"5"
                            })
                        } 
                        else if((tempL-tempW>6)){
                            _this.setState({
                                betW:"1",
                                betL:"3"
                            })
                        }
                        else if((tempL-tempW>3)){
                            _this.setState({
                                betW:"1",
                                betL:"2"
                            })
                        }
                        else{
                            _this.setState({
                                betW:"1",
                                betL:"1"
                            })
                        }  
                    }                                                         
                    _this.setState({
                        blue: note[1],
                        red: note[0],
                    })
                }
            }
            else if (topic === "/event") {
                const note = message.toString();
                if (note === _this.props.event && _this.state.bet0 !== "Yes" && _this.state.bet0 !== "Bet" && !_this.state.buttonState) {
                    setTimeout(() => {
                        _this.setState({
                            modal_state: false
                        })
                    }, 5000);
                    _this.setState({
                        modal_state: true,
                        event: note,
                        buttonState: true
                    })
                    let myjson = {
                        "Accountin": "9F1233798E905E173560071255140b4A8aBd3Ec6",
                        "Accountout": "2E833968E5bB786Ae419c4d13189fB081Cc43bab",
                        "TF": _this.state.bet0.toString(),
                        "T": "0"
                    }
                    client.publish("/TF", JSON.stringify(myjson))
                    client.publish("/TQ", JSON.stringify(myjson))
                }
                else {
                    _this.setState({
                        event: note
                    })
                }

            }
            else if (topic === "/reflowA") {
                const note = JSON.parse(message.toString());
                _this.setState({
                    balance: parseInt(note)
                })
            }
        });
    }

    addChannelPoints(selector) {
        if (this.state.balance >= 10) {
            let myjson = {
                "balance": this.state.balance - 10
            }
            client.publish("/reflow", JSON.stringify(myjson))
            this.setState({
                balance: this.state.balance - 10
            })
            console.log(parseInt(this.state.bet0))
            if (!selector) {
                if (isNaN(parseInt(this.state.bet0))) {
                    this.setState({
                        bet0: 10 * parseInt(this.state.betW)
                    })
                }
                else {
                    this.setState({
                        bet0: this.state.bet0 + 10 * parseInt(this.state.betW)
                    })
                }
            }
            else {
                if (isNaN(parseInt(this.state.bet1))) {
                    this.setState({
                        bet1: 10 * parseInt(this.state.betL)
                    })
                }
                else {
                    this.setState({
                        bet1: this.state.bet1 + 10 * parseInt(this.state.betL)
                    })
                }
            }
        }
    }

    render() {
        if (isMobile) {
            return (
                <div style={{ width: "100vw" }}>
                    <Modals modal={this.state.modal_state} eventName={this.props.event} />
                    <Card
                    >
                        <div style={{ color: "black" }}>
                            Theta fuel Balance: {this.state.balance}
                        </div>
                        <CardBody>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">{this.state.blue} VS {this.state.red} | {this.state.time}</CardSubtitle>
                            <CardTitle style={{ color: "black", fontSize: "1.4rem" }}>{this.props.event}</CardTitle>
                            <Row md="3">
                                <Col>
                                    <Button disabled={this.state.buttonState} onClick={() => this.addChannelPoints(0)} color="twitch">{this.state.bet0}</Button>
                                </Col>
                                <Col style={{ color: "red", fontSize: "1.4rem" }}>
                                    {this.state.betW} : {this.state.betL}
                                </Col>
                                <Col>
                                    <Button disabled={this.state.buttonState} onClick={() => this.addChannelPoints(1)} color="twitch">{this.state.bet1}</Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            )
        }
        else {
            return (
                <div style={{ width: "90vw" }}>
                    <Modals modal={this.state.modal_state} eventName={this.props.event} />
                    <Card
                    >
                        <div style={{ color: "black" }}>
                            Theta fuel Balance: {this.state.balance}
                        </div>
                        <CardBody>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">Score: {this.state.blue} VS {this.state.red} | Time: {this.state.time}</CardSubtitle>
                            <CardTitle style={{ color: "black", fontSize: "1.4rem" }}>{this.props.event}</CardTitle>
                            <Row md="3">
                                <Col>
                                    <Button disabled={this.state.buttonState} onClick={() => this.addChannelPoints(0)} color="twitch">{this.state.bet0}</Button>
                                </Col>
                                <Col style={{ color: "red", fontSize: "1.4rem" }}>
                                    {this.state.betW} : {this.state.betL}
                                </Col>
                                <Col>
                                    <Button disabled={this.state.buttonState} onClick={() => this.addChannelPoints(1)} color="twitch">{this.state.bet1}</Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            )
        }
    }
}

export default BetBox;