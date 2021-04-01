import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import BetBox from "./betbox"
import Carrousel from "./components/carrousel"
import {isMobile} from "react-device-detect"

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: "0",
      keys: 0,
      components: [
      ]
    }
    this.addComponent = this.addComponent.bind(this)
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.addComponent(<BetBox balance={this.state.balance} betW={"1"} betL={"1"} betlW={"Bet"} betlL={"Bet"} callback={this.callback} event="VICTORY!" />)
    this.addComponent(<BetBox balance={this.state.balance} betW={"10"} betL={"1"} betlW={"Yes"} betlL={"No"} callback={this.callback} event="PENTAKILL!" />)
    this.addComponent(<BetBox balance={this.state.balance} betW={"2"} betL={"1"} betlW={"Yes"} betlL={"No"} callback={this.callback} event="SHUTDOWN!" />)
    this.addComponent(<BetBox balance={this.state.balance} betW={"1"} betL={"1"} betlW={"Yes"} betlL={"No"} callback={this.callback} event="FIRST BLOOD!" />)
    this.forceUpdate()
  }

  componentWillReceiveProps(nextProps) {

  }

  shouldComponentUpdate(nextProps, nextState) {

  }

  componentWillUpdate(nextProps, nextState) {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {

  }

  addComponent = (data) => {
    let temp = this.state.components
    temp.push({
      comp: data,
      key: makeid(10)
    })
    this.setState({
      keys: this.state.keys + 1,
      components: temp
    })
  }

  render() {
    if(isMobile){
      return (
        <div className="App">
          <header className="App-header" >
              <img style={{ width: "70%", height: "70%" }} src={logo} className="App-logo" alt="logo" />
              <br />
            <Carrousel
              elements={this.state.components}
            />
          </header>
        </div>
      );
    }
    
    else{
      return (
        <div className="App">
          <header className="App-header" >
              <img style={{ width: "20%", height: "20%" }} src={logo} className="App-logo" alt="logo" />
            <Carrousel
              elements={this.state.components}
            />
          </header>
        </div>
      );
    }
    } 
}

export default App;
