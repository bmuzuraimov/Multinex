export interface AudioTimestamp {
  word: string;
  start: number;
  end: number;
}

export class AudioController {
  private audio: HTMLAudioElement | null = null;
  private audioTimestamps: AudioTimestamp[] = [];
  private isPlaying = false;
  private isLoaded = false;

  public setAudioUrl(audioUrl: string): Promise<void> {
    if (this.isLoaded && this.audio?.src === audioUrl) {
      return Promise.resolve();
    }

    const audio = new Audio();
    
    return new Promise((resolve, reject) => {
      audio.addEventListener('canplaythrough', () => {
        this.isLoaded = true;
        resolve();
      }, { once: true });

      audio.addEventListener('error', (e) => {
        console.error('Error loading audio:', e);
        this.isLoaded = false;
        reject(e);
      }, { once: true });

      audio.src = audioUrl;
      this.audio = audio;
    });
  }

  public isAudioLoaded(): boolean {
    return this.isLoaded;
  }

  public setAudioTimestamps(timestamps: AudioTimestamp[]): void {
    this.audioTimestamps = timestamps;
  }

  public playSegment(wordIndex: number): Promise<void> {
    if (!this.audio || !this.audioTimestamps[wordIndex]) {
      return Promise.reject(new Error('Audio or timestamp not available'));
    }
    const { start, end } = this.audioTimestamps[wordIndex];
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

  public setCurrentTime(wordIndex: number | undefined): void {
    if (!this.audio || !wordIndex) {
      return;
    }
    this.audio.currentTime = this.audioTimestamps[wordIndex].start;
  }

  public getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  public getTimeStamp(wordIndex: number | undefined): AudioTimestamp | undefined {
    if (wordIndex === undefined || !this.audioTimestamps[wordIndex]) {
      return undefined;
    }
    return this.audioTimestamps[wordIndex];
  }

  public playUntil(endTime: number): Promise<void> {
    if (!this.audio) {
      return Promise.reject(new Error('Audio or timestamp not available'));
    }
    return new Promise((resolve, reject) => {
      const onTimeUpdate = () => {
        if (!this.audio) {
          reject(new Error('Audio not available'));
          return;
        }
        if (this.audio.currentTime >= endTime) {
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

  public addEventListener(event: string, callback: () => void): void {
    this.audio?.addEventListener(event, callback);
  }

  public removeEventListener(event: string, callback: () => void): void {
    this.audio?.removeEventListener(event, callback);
  }

  public reset(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPlaying = false;
  }
}
