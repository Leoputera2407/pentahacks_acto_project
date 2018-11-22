# OpenVokaWavMean-mac64.py
# public-domain sample code by Vokaturi, 2018-02-20
#
# A sample script that uses the VokaturiPlus library to extract the emotions from
# a wav file on disk. The file has to contain a mono recording.
#
# Call syntax:
#   python3 OpenVokaWavMean-mac64.py path_to_sound_file.wav
#
# For the sound file hello.wav that comes with OpenVokaturi, the result should be:
#	Neutral: 0.760
#	Happy: 0.000
#	Sad: 0.238
#	Angry: 0.001
#	Fear: 0.000

import sys
import scipy.io.wavfile

sys.path.append("../api")
import Vokaturi
import json


Vokaturi.load("../lib/open/macos/OpenVokaturi-3-0-mac64.dylib")



file_name = sys.argv[1]
(sample_rate, samples) = scipy.io.wavfile.read(file_name)



buffer_length = len(samples)

c_buffer = Vokaturi.SampleArrayC(buffer_length)
if samples.ndim == 1:  # mono
	c_buffer[:] = samples[:] / 32768.0
else:  # stereo
	c_buffer[:] = 0.5*(samples[:,0]+0.0+samples[:,1]) / 32768.0


voice = Vokaturi.Voice (sample_rate, buffer_length)


voice.fill(buffer_length, c_buffer)


quality = Vokaturi.Quality()
emotionProbabilities = Vokaturi.EmotionProbabilities()
voice.extract(quality, emotionProbabilities)

if quality.valid:
    data = {'Neutral': str(emotionProbabilities.neutrality), 'Happy': str(emotionProbabilities.happiness), 'Sad': str(emotionProbabilities.sadness), 'Angry': str(emotionProbabilities.anger), 'Fear': str(emotionProbabilities.fear)}
    print(json.dumps(data))
else:
	print ("Not enough sonorancy to determine emotions")

voice.destroy()
