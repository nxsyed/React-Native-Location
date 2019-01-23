import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity
} from "react-native";

import MapView from 'react-native-maps';

import PubNubReact from 'pubnub-react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

export default class App extends Component {
  state = {
    location: null,
    locations: []
  };

  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
        publishKey: 'pub-c-09557b6c-9513-400f-a915-658c0789e264',
        subscribeKey: 'sub-c-87dbd99c-e470-11e8-8d80-3ee0fe19ec50'
    });

    this.pubnub.init(this);
  }

  componentWillMount() {
    this.pubnub.subscribe({
        channel: 'Locations',
        withPresence: true
    });
}

  componentWillUnmount() {
      this.pubnub.unsubscribe({
          channel_group: 'Locations'
      });

      this.pubnub.getMessage('Locations', (msg) => {
        const { latitude, longitude } = msg
        state.locations.append({
          "latitude":latitude, 
          "longitude":longitude
      })
        console.log(msg);
      });

      this.pubnub.getStatus((st) => {
          this.pubnub.publish({
              message: [this.state.location.latitude, this.state.location.longitude],
              channel: 'Locations'
          });
      });
  }

  onViewMore = (channel) => {
    this.props.navigation.navigate('Analytics', channel)
  }

  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);

        this.setState({ location });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          {this.state.locations.map(marker => (
            <Marker
              coordinate={marker.locations}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
        <TouchableOpacity onPress={this.findCoordinates}>
          <Text style={styles.welcome}>Find My Coords?</Text>
          <Text>Location: {this.state.location}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}