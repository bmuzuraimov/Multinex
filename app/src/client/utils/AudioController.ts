// AudioController.ts
export interface AudioTimestamp {
  word: string;
  start: number;
  end: number;
}

export class AudioController {
  private audio: HTMLAudioElement | null = null;
  private audioTimestamps: AudioTimestamp[] = [];
  private isPlaying = false;

  public setAudioUrl(audioUrl: string): void {
    const audio = new Audio();
    audio.src = audioUrl;
    audio.onerror = (e) => console.error('Error loading audio:', e);
    this.audio = audio;
  }

  public setAudioTimestamps(timestamps: AudioTimestamp[]): void {
    this.audioTimestamps = timestamps;
  }

  public playSegment(wordIndex: number): Promise<void> {
    if (!this.audio || !this.audioTimestamps[wordIndex]) {
      return Promise.reject(new Error('Audio or timestamp not available'));
    }
    const { start, end } = this.audioTimestamps[wordIndex];
    this.audio.currentTime = start;
    return new Promise((resolve, reject) => {
      const onTimeUpdate = () => {
        if (!this.audio) {
          reject(new Error('Audio not available'));
          return;
        }
        if (this.audio.currentTime >= end) {
          this.audio.pause();
          this.isPlaying = false;
          this.audio.removeEventListener('timeupdate', onTimeUpdate);
          resolve();
        }
      };

      const onError = (e: Event) => {
        this.audio?.removeEventListener('timeupdate', onTimeUpdate);
        reject(e);
      };

      this.audio?.addEventListener('timeupdate', onTimeUpdate);
      this.audio?.addEventListener('error', onError, { once: true });
      this.audio?.play().catch(reject);
      this.isPlaying = true;
    });
  }

  public pause(): void {
    this.audio?.pause();
    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
