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
const dTime = 100 + vTime;
let interval = null;

export default class buzz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      isVibrating: false
    };
    this.startVibration = this.startVibration.bind(this);
    this.stopVibration = this.stopVibration.bind(this);
  }

  startVibration() {
    let {counter, isVibrating} = this.state;
    counter = 0;
    isVibrating = true;

    this.interval = TimerMixin.setInterval(() => {
      console.log('yoyo')
      counter ++ ;
      this.setState({counter});
      Vibration.vibrate(vTime);
    }, dTime)
    this.setState({counter, isVibrating});
  }

  stopVibration() {
    let {isVibrating} = this.state;
    isVibrating = false;
    TimerMixin.clearInterval(this.interval)
    this.setState({isVibrating});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
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
            <Text>Vibrate</Text>
          </View>
        </TouchableHighlight>

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
    marginBottom: 5,
    fontSize: 20
  },
  wrapper: {
    marginTop: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 10,
  }
});

AppRegistry.registerComponent('buzz', () => buzz);
