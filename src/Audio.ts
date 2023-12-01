export const audioContext = new AudioContext();

export const mainVolume = audioContext.createGain();

mainVolume.connect(audioContext.destination);

export const sound: {
  source: AudioBufferSourceNode,
  volume: GainNode,
  panner: PannerNode,
  buffer: AudioBuffer | null,
} = {
  source: audioContext.createBufferSource(),
  volume: audioContext.createGain(),
  panner: audioContext.createPanner(),
  buffer: null,
}

sound.source.connect(sound.volume);

sound.volume.connect(sound.panner);

sound.panner.connect(mainVolume);
sound.panner.panningModel = 'HRTF';

var request = new XMLHttpRequest();
// request.open("GET", "GunShot.wav", true);
request.open("GET", "GunShot.wav", true);
request.responseType = "arraybuffer";
request.onload = function(e) {

  // Create a buffer from the response ArrayBuffer.
  audioContext.decodeAudioData(this.response, function onSuccess(buffer) {
    sound.buffer = buffer;

    // Make the sound source use the buffer and start playing it.
    sound.source.buffer = sound.buffer;
  }, function onFailure() {
    alert("Decoding the audio buffer failed");
  });
};

request.send();
