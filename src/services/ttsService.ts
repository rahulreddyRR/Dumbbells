import Tts from 'react-native-tts';

class TTSService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Initialize TTS
      await Tts.getInitStatus();
      
      // iOS: Play audio even if silent switch is on
      try {
        Tts.setIgnoreSilentSwitch("ignore");
      } catch (e) {
        // Ignore error on Android/if unavailable
      }
      
      // Set default settings
      Tts.setDefaultRate(0.5); // Slightly slower for clarity
      Tts.setDefaultPitch(1.0);
      
      this.initialized = true;
      console.log('(TTS) Service initialized successfully');
    } catch (error) {
      console.error('(TTS) Initialization failed:', error);
    }
  }

  async speak(text: string, shouldSpeak: boolean = true) {
    if (!shouldSpeak) {
        console.log('(TTS) Skipped (shouldSpeak=false):', text);
        return;
    }
    
    try {
      await this.initialize();
      console.log('(TTS) Speaking:', text);
      Tts.speak(text);
    } catch (error) {
      console.error('(TTS) Speak failed:', error);
    }
  }

  async announceExercise(exerciseName: string, sets: string, weight: string, shouldSpeak: boolean = true) {
    const message = `${exerciseName}. ${sets} reps. ${weight}`;
    await this.speak(message, shouldSpeak);
  }

  async announceRest(seconds: number, shouldSpeak: boolean = true) {
    const message = `Rest for ${seconds} seconds`;
    await this.speak(message, shouldSpeak);
  }

  async announceRestComplete(shouldSpeak: boolean = true) {
    const message = 'Rest complete. Get ready for your next set';
    await this.speak(message, shouldSpeak);
  }

  async announceWorkoutComplete(shouldSpeak: boolean = true) {
    const message = 'Workout complete. Great job!';
    await this.speak(message, shouldSpeak);
  }

  stop() {
    try {
      Tts.stop();
    } catch (error) {
      console.error('TTS stop failed:', error);
    }
  }
}

export const ttsService = new TTSService();
