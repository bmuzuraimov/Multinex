import { TextNode, Mode } from './TextNode';
import { AudioController, AudioTimestamp } from './AudioController';

export interface FormattedEssaySection {
  mode: string;
  text: string[];
}

export class TextList {
  private nodeId = 0;
  private isPlaying = false;
  private currentNode: TextNode | null = null;
  private nodes: TextNode[] = [];
  private readonly baseCharClass: Record<Mode, string>;
  private audioController: AudioController | null = null;
  private onUpdate?: () => void;

  constructor(formattedEssay: FormattedEssaySection[], textSize: string, progressCursor: number, onUpdate?: () => void) {
    this.baseCharClass = {
      hear: `text-${textSize} cursor-pointer tracking-wider font-montserrat text-blue-900 dark:text-gray-300`,
      type: `text-${textSize} cursor-pointer tracking-wider font-manrope text-green-900 dark:text-gray-300`,
      write: `text-${textSize} cursor-pointer tracking-wider font-courgette text-red-900 dark:text-gray-300`,
    };
    this.onUpdate = onUpdate;
    this.nodes = this.buildNodes(formattedEssay);
    this.currentNode = this.nodes[progressCursor] || this.nodes[0] || null;
    if (this.currentNode) {
      this.currentNode.currentClass = 'border-b-2 border-sky-400';
    }
  }

  private buildNodes(sections: FormattedEssaySection[]): TextNode[] {
    let previous: TextNode | undefined;
    let hearWordIndex = 0;
    const nodes: TextNode[] = [];

    sections.forEach((section) => {
      const mode = section.mode as Mode;
      section.text.forEach((text) => {
        let wordIndex: number | undefined;
        if (mode === 'hear' && text.trim() && /[a-zA-Z0-9]/.test(text)) {
          wordIndex = hearWordIndex++;
        }
        const node = new TextNode(
          this.nodeId++,
          text,
          mode,
          `${this.baseCharClass[mode]}${text === ' ' ? ' mx-0.5' : ''}`,
          wordIndex
        );
        nodes.push(node);
        if (previous) {
          previous.next = node;
          node.prev = previous;
        }
        previous = node;
      });
    });

    return nodes;
  }

  // Cursor management
  public moveCursor(next: boolean = true): boolean {
    // Handle case where there is no current node
    if (!this.currentNode) {
      // Try to set cursor to first/last node if available
      const targetNode = next ? this.nodes[0] : this.nodes[this.nodes.length - 1];
      if (!targetNode) return false;
      
      this.currentNode = targetNode;
      if (!(this.currentNode.mode === 'hear')) {
        this.currentNode.currentClass = 'border-b-2 border-sky-400';
      }
      return true;
    }

    // Clear current node styling
    this.currentNode.currentClass = '';

    // Reset highlight when moving backwards
    if (!next) {
      // Check if prev exists before resetting highlight
      if (this.currentNode.prev) {
        this.currentNode.prev.resetHighlight();
      }
    }

    // Get next node in sequence
    const newNode = next ? this.currentNode.next : this.currentNode.prev;
    
    // Handle reaching start/end of list
    if (!newNode) {
      // Keep current node highlighted
      if (!(this.currentNode.mode === 'hear')) {
        this.currentNode.currentClass = 'border-b-2 border-sky-400';
      }
      return false;
    }

    // Update cursor
    this.currentNode = newNode;
    if (!(this.currentNode.mode === 'hear')) {
      this.currentNode.currentClass = 'border-b-2 border-sky-400';
    }
    return true;
  }

  public getCursor(): TextNode | null {
    return this.currentNode;
  }

  public setCursor(node: TextNode): void {
    this.isPlaying = false;
    this.audioController?.pause();
    if (this.currentNode) {
      this.currentNode.currentClass = '';
    }
    this.currentNode = node;
    this.currentNode.currentClass = 'border-b-2 border-sky-400';
  }

  // Audio integration
  public async setAudio(audioUrl: string, audioTimestamps: AudioTimestamp[]): Promise<void> {
    if (!this.audioController) {
      this.audioController = new AudioController();
    }
    
    try {
      await this.audioController.setAudioUrl(audioUrl);
      this.audioController.setAudioTimestamps(audioTimestamps);
    } catch (error) {
      console.error('Failed to load audio:', error);
      throw error;
    }
  }

  public togglePlayback(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      // TODO: Implement automated playback loop using audioTimestamps
    } else {
      this.audioController?.pause();
    }
  }

  // Key handling
  public async handleKeyDown(e: KeyboardEvent): Promise<void> {
    if (!this.currentNode) return;

    switch (this.currentNode.mode) {
      case 'hear':
        await this.handleHearMode(e);
        break;
      case 'type':
        this.handleTypeMode(e);
        break;
      case 'write':
        this.handleWriteMode(e);
        break;
    }
  }

  private async handleHearMode(e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      while (this.currentNode?.prev?.value === ' ') {
        this.moveCursor(false);
      }
      this.moveCursor(false);
      return;
    }

    let startNode = this.currentNode;
    while (startNode && startNode.wordIndex === undefined) {
      if (!startNode.next) break;
      startNode = startNode.next;
    }
    this.audioController?.setCurrentTime(startNode?.wordIndex);

    let lastNode = this.currentNode;
    let playEnd = 0;
    while (lastNode && lastNode.mode === 'hear') {
      if (lastNode.wordIndex !== undefined) {
        playEnd = this.audioController?.getTimeStamp(lastNode.wordIndex)?.end || 0;
      }
      if (!lastNode.next) break;
      lastNode = lastNode.next;
    }

    // Create an audio update callback
    const onAudioUpdate = () => {
      const currentTime = this.audioController?.getCurrentTime() || 0;
      let node = this.currentNode;
      
      while (node && node.mode === 'hear') {
        const timestamp = node.wordIndex !== undefined ? 
          this.audioController?.getTimeStamp(node.wordIndex) : undefined;
        
        if (timestamp && currentTime >= timestamp.start) {
          node.highlightText();
          this.moveCursor(true);
          this.onUpdate?.();
        }
        node = node.next || null;
      }
    };

    // Add the update listener to AudioController
    this.audioController?.addEventListener('timeupdate', onAudioUpdate);

    try {
      await this.audioController?.playUntil(playEnd);
    } finally {
      // Clean up the listener
      this.audioController?.removeEventListener('timeupdate', onAudioUpdate);
      
      // Move cursor to first non-hear mode node if still in hear mode
      while (this.currentNode?.mode === 'hear' && this.currentNode.next) {
        this.moveCursor(true);
      }
    }
  }

  private handleTypeMode(e: KeyboardEvent): void {
    if (!this.currentNode) return;

    switch (e.key) {
      case ' ':
        this.currentNode.highlightText(e.key === this.currentNode.value);
        this.moveCursor(true);
        break;
      case 'Backspace':
        this.moveCursor(false);
        break;
      case 'Enter':
        this.currentNode.highlightText(this.currentNode.value === '\n');
        this.moveCursor(true);
        break;
      case 'Tab':
        while (this.currentNode && this.currentNode.value !== ' ' && this.currentNode.value !== '\n') {
          this.currentNode.highlightText();
          if (!this.moveCursor(true)) break;
        }
        break;
      default:
        if (e.key.length === 1) {
          this.currentNode.highlightText(e.key === this.currentNode.value);
          this.moveCursor(true);
        }
        break;
    }
  }

  private handleWriteMode(e: KeyboardEvent): void {
    if (!this.currentNode) return;
    if (e.key === 'Backspace') {
      this.moveCursor(false);
    } else {
      this.currentNode.highlightText();
      this.moveCursor(true);
    }
  }

  public getNodes(): TextNode[] {
    return this.nodes;
  }
}
