import { toast } from "sonner";

export interface AudioTimestamp {
  word: string;
  start: number;
  end: number;
}

export class AudioController {
  private audio: HTMLAudioElement | null = null;
  private audioUrl: string | null = null;
  private audioTimestamps: AudioTimestamp[] = [];
  private isPlaying = false;
  private isLoaded = false;
  private timestampCache: Map<number, AudioTimestamp> = new Map();
  private activeListeners: Map<string, Set<() => void>> = new Map();

  public setAudioUrl(audioUrl: string): Promise<void> {
    if (this.isLoaded && this.audioUrl === audioUrl) {
      return Promise.resolve();
    }

    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
    }

    const audio = new Audio();
    
    return new Promise((resolve, reject) => {
      audio.addEventListener('canplaythrough', () => {
        this.isLoaded = true;
        resolve();
      }, { once: true });
      audio.addEventListener('error', (e) => {
        this.isLoaded = false;
        reject(e);
      }, { once: true });

      audio.preload = 'auto';
      audio.src = audioUrl;
      this.audio = audio;
      this.audioUrl = audioUrl;
    });
  }

  public isAudioLoaded(): boolean {
    return this.isLoaded;
  }

  public setAudioTimestamps(timestamps: AudioTimestamp[]): void {
    this.audioTimestamps = timestamps;
    this.timestampCache.clear();
    timestamps.forEach((timestamp, index) => {
      this.timestampCache.set(index, timestamp);
    });
  }

  public playSegment(wordIndex: number): Promise<void> {
    if (!this.audio || !this.getTimeStamp(wordIndex)) {
      return Promise.reject(new Error('Audio or timestamp not available'));
    }
    
    const timestamp = this.getTimeStamp(wordIndex);
    if (!timestamp) return Promise.reject(new Error('Timestamp not found'));
    
    const { start, end } = timestamp;
    
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

      if (this.audio) {
        this.audio.currentTime = start;
        this.audio.addEventListener('timeupdate', onTimeUpdate);
        this.audio.addEventListener('error', onError, { once: true });
        
        this.audio.play().catch(reject);
        this.isPlaying = true;
      }
    });
  }

  public pause(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setCurrentTime(wordIndex: number | undefined): void {
    if (!this.audio || wordIndex === undefined) {
      return;
    }
    
    const timestamp = this.getTimeStamp(wordIndex);
    if (timestamp) {
      this.audio.currentTime = timestamp.start;
    }
  }

  public getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  public getTimeStamp(wordIndex: number | undefined): AudioTimestamp | undefined {
    if (wordIndex === undefined) {
      return undefined;
    }
    
    if (this.timestampCache.has(wordIndex)) {
      return this.timestampCache.get(wordIndex);
    }
    
    const timestamp = this.audioTimestamps[wordIndex];
    if (timestamp) {
      this.timestampCache.set(wordIndex, timestamp);
    }
    
    return timestamp;
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

      if (this.audio) {
        this.audio.addEventListener('timeupdate', onTimeUpdate);
        this.audio.addEventListener('error', onError, { once: true });
        
        this.audio.play().catch(reject);
        this.isPlaying = true;
      }
    });
  }

  public addEventListener(event: string, callback: () => void): void {
    if (!this.audio) return;
    
    if (!this.activeListeners.has(event)) {
      this.activeListeners.set(event, new Set());
    }
    
    this.activeListeners.get(event)?.add(callback);
    this.audio.addEventListener(event, callback);
  }

  public removeEventListener(event: string, callback: () => void): void {
    if (!this.audio) return;
    
    this.audio.removeEventListener(event, callback);
    
    const listeners = this.activeListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  public reset(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      
      this.activeListeners.forEach((listeners, event) => {
        listeners.forEach(callback => {
          this.audio?.removeEventListener(event, callback);
        });
        listeners.clear();
      });
    }
    this.isPlaying = false;
  }
}
