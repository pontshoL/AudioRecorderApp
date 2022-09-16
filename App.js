import { StatusBar } from 'expo-status-bar';
import React,{useState, useEffect} from 'react';
import { Alert, Button, Pressable, StyleSheet,Image, Text, View, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import pic from './assets/microPhone.png' 
import play from './assets/R.png'


export default function App() {
  const [recording,  setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState("");

  async function startRecording(){
      try {
         const permission = await Audio.requestPermissionsAsync();
         if (permission.status === "granted") {
            await Audio.setAudioModeAsync({
               allowsRecordingIOS: true,
               playsInSilentModeIOS: true,
            });
            const {recording} = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );

            setRecording(recording);
         }else{
          setMessage("Please grant permission to app to access microphone")
         }
      }catch (err) {
        console.error('failed to start recording', err);
      }
  }

  async function stopRecording(){
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });

    setRecordings(updatedRecordings);
  }
  function getDurationFormatted(millis){
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play" ></Button>
          {/* <Button style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} title="Share"></Button> */}
        </View>
      );
    });
  }

  return (
       <>
       <View style={styles.container}>
      <Text style={{color:'#f90281', marginBottom:40, alignSelf: "center",fontSize: 20}}>AUDIO RECORDER</Text>
      <Text>{message}</Text>
      <View style={styles.view}>
      
        <Pressable onPress={recording ? stopRecording : startRecording} title={recording ? 'stop Recording' : 'start Recording'}>
        <View style={{borderWidth:1,
          borderColor:'black',
           borderRadius:150,
           padding:30,
           backgroundColor:'#f90281'
           ,height:250,width:250, 
           alignContent:'center'}}>
            {
                recording ? (
                  <Image source={play} style={{height: 250, width:250, borderRadius: 150, alignItems: 'center', }}/>
                ):(
                
                  <Image source={pic} style={{height: 250, width:250, borderRadius: 150, alignItems: 'center' }}/>
                  
                )
            }
        </View>   
        {getRecordingLines()}
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </View>
       </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  
  },
  view: {

    width: 300,
    height: 300,
    borderRadius: 150
  },
 
   
});
