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

  constructor(
    formattedEssay: FormattedEssaySection[],
    textSize: string,
    progressCursor: number
  ) {
    this.baseCharClass = {
      hear: `text-${textSize} cursor-pointer tracking-wider font-montserrat text-blue-900 dark:text-gray-300`,
      type: `text-${textSize} cursor-pointer tracking-wider font-manrope text-green-900 dark:text-gray-300`, 
      write: `text-${textSize} cursor-pointer tracking-wider font-courgette text-red-900 dark:text-gray-300`,
    };

    this.nodes = this.buildNodes(formattedEssay);
    this.currentNode = this.nodes[progressCursor] || this.nodes[0] || null;
    if (this.currentNode) {
      this.currentNode.currentClass = 'border-b-4 border-sky-400';
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
    if (!this.currentNode) return false;

    // Clear current node styling
    this.currentNode.currentClass = '';

    // Reset highlight when moving backwards
    if (!next) {
      this.currentNode.prev?.resetHighlight();
    }

    // Get next node in sequence
    const newNode = next ? this.currentNode.next : this.currentNode.prev;
    if (!newNode) return false;

    // Update cursor
    this.currentNode = newNode;
    this.currentNode.currentClass = 'border-b-4 border-sky-400';
    return true;
  }

  public moveCursorTo(node: TextNode): void {
    if (this.currentNode) {
      this.currentNode.currentClass = '';
    }
    this.currentNode = node;
    this.currentNode.currentClass = 'border-b-4 border-sky-400';
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
    this.currentNode.currentClass = 'border-b-4 border-sky-400';
    if (
      this.currentNode.mode === 'hear' &&
      this.audioController &&
      this.currentNode.wordIndex !== undefined
    ) {
      this.audioController
        .playSegment(this.currentNode.wordIndex)
        .catch((err) => console.error(err));
    }
  }

  // Audio integration
  public setAudio(audioUrl: string, audioTimestamps: AudioTimestamp[]): void {
    if (!this.audioController) {
      this.audioController = new AudioController();
    }
    this.audioController.setAudioUrl(audioUrl);
    this.audioController.setAudioTimestamps(audioTimestamps);
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

  private async handleHearMode(e: KeyboardEvent): Promise<void> {
    if (e.key === 'Backspace') {
      while (this.currentNode?.prev?.value === ' ') {
        this.moveCursor(false);
      }
      this.moveCursor(false);
      return;
    }

    while (this.currentNode && this.currentNode.mode === 'hear') {
      if (this.currentNode.wordIndex === undefined) {
        this.currentNode.highlightText();
        if (!this.moveCursor(true)) break;
        continue;
      }
      try {
        this.isPlaying = true;
        if (this.audioController) {
          await this.audioController.playSegment(this.currentNode.wordIndex);
        }
        this.currentNode.highlightText();
        if (this.currentNode.prev) {
          this.currentNode.prev.currentClass = '';
        }
        if (!this.moveCursor(true)) break;
      } catch (error) {
        console.error('Audio playback error:', error);
        this.isPlaying = false;
        break;
      }
    }
    this.isPlaying = false;
    this.audioController?.pause();
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
        this.currentNode.highlightText();
        this.moveCursor(true);
        break;
      case 'Tab':
        while (
          this.currentNode &&
          this.currentNode.value !== ' ' &&
          this.currentNode.value !== '\n'
        ) {
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