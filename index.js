const record = require('node-mic-record');
const Speech = require('@google-cloud/speech');
const fs = require('fs');

const speech = new Speech.SpeechClient();

const fileName = 'test.wav';
const file = fs.createWriteStream(fileName);

const config = {
  sampleRate : 16000,
  verbose : true
};

const micStream = record.start(config).pipe(file);

setTimeout(() => {
  // Stop the microphone recording
  record.stop(micStream);

  console.log('Recording stopped. Transcribing audio...');

  // Transcribe the recorded audio
  const audio = {
    content: fs.readFileSync(fileName).toString('base64'),
  };

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };

  const request = {
    audio: audio,
    config: config,
  };

  // Send the transcribe request to the Speech-to-Text API
  speech
    .recognize(request)
    .then(([response]) => {
      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join('\n');

      console.log('Transcription:');
      console.log(transcription);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}, 5000); // Adjust the timeout value based on your recording duration