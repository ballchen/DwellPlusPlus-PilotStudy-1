/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Vibration,
  Platform
} from 'react-native';
import TimerMixin from 'react-timer-mixin';
import process from 'process';

const vTime = 10;
const dTime = 120;
let interval = null;
let startTime = 0;
let stopTime = 0;
let segStartTime = 0;
let segQuestNum = 0;
let segResultNum = 0;
let counter = 0;
let quests = [0,1,2,3,4,5,6,7,8,9] 
let pivot = 0;
let base = 10;

let records = [];

function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }

  return a;
}

function generateNewQuest(b) {
  let arr = [];
  for (let i = 0; i < b; i ++) {
    arr.push(i);
  }

  return shuffle(arr);
}

quests = generateNewQuest(base);

function reset() {
  startTime = 0;
  stopTime = 0;
  segStartTime = 0;
  counter = 0;
}

function record() {
  let obj = {
    wholeTime: stopTime -  startTime,
    segTime: stopTime - ((segStartTime == 0)? startTime : segStartTime),
    quest: segQuestNum,
    vibTime: vTime,
    gapTime: dTime,
    result: segResultNum
  }

  records.push(obj);
}

export default class buzz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questStart: false,
      quest: null,
      counter: 0,
      isVibrating: false,
      segtime: 0,
      wholetime: 0,
      viewingResult: false,
      mode: 'training',
      study: 1,
      vt: vTime,
      dt: dTime
    };
    this.startVibration = this.startVibration.bind(this);
    this.stopVibration = this.stopVibration.bind(this);
    this.addvt = this.addvt.bind(this);
    this.adddt = this.adddt.bind(this);
    this.minusvt = this.minusvt.bind(this);
    this.minusdt = this.minusdt.bind(this);
    this.startQuests = this.startQuests.bind(this);
    this.nextQuest = this.nextQuest.bind(this);
    this.toggleMode = this.toggleMode.bind(this);
    this.onEnteringName = this.onEnteringName.bind(this);
    this.setStudy = this.setStudy.bind(this);
  }

  startVibration() {
    startTime = Date.now();

    let {isVibrating, vt, dt} = this.state;
    isVibrating = true;

    this.interval = TimerMixin.setInterval(() => {
      segStartTime = Date.now();
      counter ++ ;
      
      this.setState({counter: counter});

      if((this.state.study == 2) && counter > segQuestNum) {
        //no vib
      } else {
        Vibration.vibrate(vt);
      }

    }, dt+vt)
    
    this.setState({counter, isVibrating});
  }

  stopVibration() {
    stopTime = Date.now();


    let {isVibrating} = this.state;
    isVibrating = false;
    segResultNum = counter;
    TimerMixin.clearInterval(this.interval)

    record();

    this.setState({viewingResult: true ,isVibrating, time: stopTime - ((segStartTime == 0)? startTime : segStartTime)});
  }

  nextQuest() {
    reset();
    this.setState({viewingResult: false, counter: counter});

    pivot ++;
    if(pivot >= quests.length) {
      this.setState({quest: null, questStart: false});

       let option = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records,
          quests,
          name: this.state.name,
          mode: this.state.mode
        })
      };

      fetch('http://192.168.11.30:3000/pilot_study/'+this.state.study, option)
      .then((response) => response.json()).then((response) => {
        
        records = [];
        pivot = 0;

        return response;
      }).catch((error) => {
        console.log(error)
      })
      
    } else {
      segQuestNum = quests[pivot];
      this.setState({quest: segQuestNum});
    }
  }

  addvt() {
    let {vt} = this.state;
    vt += 5;
    vTime = vt;
    this.setState({vt});
  }

  minusvt() {
    let {vt} = this.state;
    if(vt - 5 <= 0) return;
    vt -= 5;
    vTime = vt;
    this.setState({vt});
  }

  adddt() {
    let {dt} = this.state;
    dt += 10;
    dTime = dt;
    this.setState({dt});
  }

  minusdt() {
    let {dt} = this.state;
    if(dt - 10 <= 0) return;
    dt -= 10;
    dTime = dt;
    this.setState({dt});
  }

  toggleMode() {
    let {mode} = this.state;
    if(mode == 'training') {
      mode = 'testing'
    }
    else if(mode == 'testing'){
      mode = 'training'
    }
    this.setState({mode});
  }

  startQuests() {
    quests = generateNewQuest(base);
    segQuestNum = quests[pivot];
    this.setState({questStart: true, quest: segQuestNum});
  }

  onEnteringName(text) {
    this.setState({name: text})
  }

  setStudy(i) {
    this.setState({study:i});
  }

  render() {
    const {questStart, viewingResult} = this.state;

    if(!questStart) {
      return (
        <View style={styles.container}>

          <TextInput
            placeholder = {'Enter Your Name'}
            multiline={false}
            editable = {true}
            maxLength = {40}
            onChangeText={this.onEnteringName}
            style= {styles.nameInput}
            value={this.state.name}
          />


          <Text style={styles.welcome}>
            Setting: {this.state.vt} + {this.state.dt}
          </Text>

          <TouchableHighlight
            style={styles.wrapper}
            onPress={this.startQuests}>
            <View style={styles.button}>
              <Text>Start</Text>
            </View>
          </TouchableHighlight>

          <View style={styles.buttons}>
            <TouchableHighlight
              style={styles.wrapper}
              onPress={this.addvt}>
              <View style={styles.button}>
                <Text>vt +</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.wrapper}
              onPress={this.minusvt}>
              <View style={styles.button}>
                <Text>vt -</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.wrapper}
              onPress={this.adddt}>
              <View style={styles.button}>
                <Text>dt +</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.wrapper}
              onPress={this.minusdt}>
              <View style={styles.button}>
                <Text>dt -</Text>
              </View>
            </TouchableHighlight>
          </View>

          <View style={styles.buttons}>
            <TouchableHighlight
              style={styles.wrapper}
              onPress={() => this.setStudy(1)}>
              <View style={[styles.button, ((this.state.study==1) ? styles.active: {})]}>
                <Text>Study 1</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.wrapper}
              onPress={() => this.setStudy(2)}>
              <View style={[styles.button, ((this.state.study==2) ? styles.active: {})]}>
                <Text>Study 2</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.wrapper}
              onPress={() => this.setStudy(3)}>
              <View style={[styles.button, ((this.state.study==3) ? styles.active: {})]}>
                <Text>Study 3</Text>
              </View>
            </TouchableHighlight>
          </View>

          <TouchableHighlight
            style={styles.wrapper}
            onPress={this.toggleMode}>
            <View style={styles.button}>
              <Text>{this.state.mode}</Text>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
    else if(viewingResult) {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Quest: {this.state.quest}
          </Text>
          <Text style={styles.welcome}>
            Your Result: {this.state.counter}
          </Text>
           <TouchableHighlight
            style={styles.wrapper}
            onPress={this.nextQuest}>
            
            <View style={styles.touchButton}>
              <Text>Next</Text>
            </View>
          </TouchableHighlight>

        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Quest: {this.state.quest}
          </Text>
          <TouchableHighlight
            style={styles.wrapper}
            onPressIn={this.startVibration}
            onPressOut={this.stopVibration}>
            <View style={styles.touchButton}>
              <Text>Touch Me</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  counter: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 25
  },
  wrapper: {
    marginTop: 10,
    borderRadius: 5,
    marginBottom: 5,
    margin: 5
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 15,
    borderRadius: 5
  },
  buttons: {
    flex: 0,
    flexDirection: 'row'
  },
  active: {
    backgroundColor: '#cdcdcd'
  },
  touchButton: {
    backgroundColor: '#eeeeee',
    padding: 35,
    borderRadius: 5
  },
  nameInput: {
    width: 150,
    textAlign: 'center'
  }
});

AppRegistry.registerComponent('buzz', () => buzz);
