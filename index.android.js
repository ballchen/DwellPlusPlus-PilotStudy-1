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
  View,
  TouchableHighlight,
  Vibration,
  Platform
} from 'react-native';
import TimerMixin from 'react-timer-mixin';

const vTime = 10;
const dTime = 120;
let interval = null;

export default class buzz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      isVibrating: false,
      vt: vTime,
      dt: dTime
    };
    this.startVibration = this.startVibration.bind(this);
    this.stopVibration = this.stopVibration.bind(this);
    this.addvt = this.addvt.bind(this);
    this.adddt = this.adddt.bind(this);
    this.minusvt = this.minusvt.bind(this);
    this.minusdt = this.minusdt.bind(this);
  }

  startVibration() {
    let {counter, isVibrating, vt, dt} = this.state;
    counter = 0;
    isVibrating = true;

    this.interval = TimerMixin.setInterval(() => {
      counter ++ ;
      this.setState({counter});
      Vibration.vibrate(vt);
    }, dt+vt)
    this.setState({counter, isVibrating});
  }

  stopVibration() {
    let {isVibrating} = this.state;
    isVibrating = false;
    TimerMixin.clearInterval(this.interval)
    this.setState({isVibrating});
  }

  addvt() {
    let {vt} = this.state;
    vt += 5;
    this.setState({vt});
  }

  minusvt() {
    let {vt} = this.state;
    if(vt - 5 <= 0) return;
    vt -= 5;
    this.setState({vt});
  }

  adddt() {
    let {dt} = this.state;
    dt += 10;
    this.setState({dt});
  }

  minusdt() {
    let {dt} = this.state;
    if(dt - 10 <= 0) return;
    dt -= 10;
    this.setState({dt});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Taptick Setting: {this.state.vt} + {this.state.dt}
        </Text>
        <Text style={styles.instructions}>
          Tap buttun to Vribrate. 
        </Text>
        <Text style={styles.counter}>
          {this.state.counter}
        </Text>
        <TouchableHighlight
          style={styles.wrapper}
          onPressIn={this.startVibration}
          onPressOut={this.stopVibration}>
          <View style={styles.button}>
            <Text>Touch Me</Text>
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

      </View>
    );
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
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 15,
  },
  buttons: {
    flex: 0,
    flexDirection: 'row',
    
  }
});

AppRegistry.registerComponent('buzz', () => buzz);
