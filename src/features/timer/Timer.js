import React, { useState, useEffect } from "react";
import { View, StyleSheet, Vibration } from "react-native";
import { ProgressBar, Text } from "react-native-paper";
import { Audio } from "expo-av";
import { useKeepAwake } from "expo-keep-awake";

import { RoundedButton } from "../../components/RoundedButton";
import { Countdown } from "../../components/Countdown";
import { Timing } from "./Timing";

export const Timer = ({ subject, clearSubject, onTimerEnd }) => {
  useKeepAwake();
  
  const soundObject = new Audio.Sound();

  const [minutes, setMinutes] = useState(0.1);
  const [isStarted, setStarted] = useState(false);
  const [pauseCounter, setPauseCounter] = useState(0);
  const [progress, setProgress] = useState(1);

  const onProgress = (p) => {
    setProgress(p / 100);
  };

  const onPause = () => {
    setPauseCounter(pauseCounter + 1);
  };

  const onEnd = async () => {
    try {
      await soundObject.loadAsync(require("../../../assets/bell.mp3"));
      await soundObject.playAsync();
      const interval = setInterval(() => Vibration.vibrate(5000), 1000);
      setTimeout(() => {
        clearInterval(interval);
      }, 10000);
    } catch (error) {
      console.log(error);
    }

    setProgress(1);
    setStarted(false);
    setMinutes(20);
    onTimerEnd();
  };

  const changeTime = (min) => () => {
    setProgress(1);
    setStarted(false);
    setMinutes(min);
  };

  useEffect(() => {
    return async () => {
      await soundObject.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          onPause={onPause}
          onEnd={onEnd}
          onProgress={onProgress}
        />
        <View style={{ padding: 50 }}>
          <Text style={styles.title}>Focusing on:</Text>
          <Text style={styles.task}>{subject}</Text>
        </View>
      </View>
      <View>
        <ProgressBar
          progress={progress}
          color="#5E84E2"
          style={{ height: 10 }}
        />
      </View>

      <View style={styles.buttonWrapper()}>
        <Timing changeTime={changeTime} />
      </View>

      <View style={styles.buttonWrapper({ flex: 0.3 })}>
        {!isStarted ? (
          <RoundedButton title="start" onPress={() => setStarted(true)} />
        ) : (
          <RoundedButton title="pause" onPress={() => setStarted(false)} />
        )}
      </View>
      <View style={styles.clearSubject}>
        <RoundedButton title="-" size={50} onPress={() => clearSubject()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#252250",
    flex: 1,
  },
  countdown: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "white", textAlign: "center" },
  task: { color: "white", fontWeight: "bold", textAlign: "center" },
  buttonWrapper: ({
    flex = 0.25,
    padding = 15,
    justifyContent = "center",
  } = {}) => ({
    flex,
    flexDirection: "row",
    alignItems: "center",
    justifyContent,
    padding,
  }),
  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 25,
  },
});
