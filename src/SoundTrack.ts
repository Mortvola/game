import { audioContext, mainVolume } from "./Audio";

const sound: {
  source: AudioBufferSourceNode,
  volume: GainNode,
  buffer: AudioBuffer | null,
} = {
  source: audioContext.createBufferSource(),
  volume: audioContext.createGain(),
  buffer: null,
}

sound.source.connect(sound.volume);
sound.volume.connect(mainVolume);

sound.source.loop = true;

var request = new XMLHttpRequest();
// request.open("GET", "GunShot.wav", true);
request.open("GET", "outfoxing.mp3", true);
request.responseType = "arraybuffer";
request.onload = function(e) {

  // Create a buffer from the response ArrayBuffer.
  audioContext.decodeAudioData(this.response, function onSuccess(buffer) {
    sound.buffer = buffer;

    // Make the sound source use the buffer and start playing it.
    sound.source.buffer = sound.buffer;
    sound.source.start(audioContext.currentTime);
  }, function onFailure() {
    alert("Decoding the audio buffer failed");
  });
};

request.send();
