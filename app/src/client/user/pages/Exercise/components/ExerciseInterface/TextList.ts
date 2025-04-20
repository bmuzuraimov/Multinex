import { TextNode } from './TextNode';
import { AudioController, AudioTimestamp } from './AudioController';
import { SensoryMode } from '../../../../../../shared/types';

export interface FormattedEssaySection {
  mode: string;
  text: string[];
}

export class TextList {
  private nodeId = 0;
  private isPlaying = false;
  private currentNode: TextNode | null = null;
  private nodes: TextNode[] = [];
  private readonly baseCharClass: Record<SensoryMode, string>;
  private audioController: AudioController | null = null;
  private onUpdate?: () => void;

  constructor(formattedEssay: FormattedEssaySection[], textSize: string, progressCursor: number, onUpdate?: () => void) {
    this.baseCharClass = {
      listen: `text-${textSize} cursor-pointer tracking-wider font-montserrat text-blue-900 dark:text-gray-300`,
      type: `text-${textSize} cursor-pointer tracking-wider font-manrope text-green-900 dark:text-gray-300`,
      write: `text-${textSize} cursor-pointer tracking-wider font-courgette text-red-900 dark:text-gray-300`,
      mermaid: `text-${textSize} cursor-pointer tracking-wider font-manrope text-gray-900 dark:text-gray-300`,
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
    let listenWordIndex = 0;
    const nodes: TextNode[] = [];

    sections.forEach((section) => {
      const mode = section.mode as SensoryMode;
      section.text.forEach((text) => {
        let wordIndex: number | undefined;
        if (mode === 'listen' && text.trim() && /[a-zA-Z0-9]/.test(text)) {
          wordIndex = listenWordIndex++;
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
      if (!(this.currentNode.mode === 'listen')) {
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
    let newNode = next ? this.currentNode.next : this.currentNode.prev;
    
    // Skip over mermaid nodes
    while (newNode?.mode === 'mermaid') {
      newNode = next ? newNode.next : newNode.prev;
    }
    
    // Handle reaching start/end of list
    if (!newNode) {
      // Keep current node highlighted
      if (!(this.currentNode.mode === 'listen')) {
        this.currentNode.currentClass = 'border-b-2 border-sky-400';
      }
      return false;
    }

    // Update cursor
    this.currentNode = newNode;
    if (!(this.currentNode.mode === 'listen')) {
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
    if (!audioUrl) return;

    if (!this.audioController) {
      this.audioController = new AudioController();
    }

    try {
      await this.audioController.setAudioUrl(audioUrl);
      this.audioController.setAudioTimestamps(audioTimestamps);
    } catch (error) {
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

    // Cache the current mode to avoid repeated property access
    const currentMode = this.currentNode.mode;
    
    switch (currentMode) {
      case 'listen':
        await this.handleListenMode(e);
        break;
      case 'type':
        this.handleTypeMode(e);
        break;
      case 'write':
        this.handleWriteMode(e);
        break;
      case 'mermaid':
        this.handleMermaidMode(e);
        break;
    }
  }

  private async handleListenMode(e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      // Optimize backspace handling by checking conditions first
      if (this.currentNode?.prev?.value === ' ') {
        do {
          this.moveCursor(false);
        } while (this.currentNode?.prev?.value === ' ');
      }
      this.moveCursor(false);
      return;
    }

    // Find the start node more efficiently
    let startNode = this.currentNode;
    if (startNode && startNode.wordIndex === undefined) {
      let nextNode = startNode.next;
      while (nextNode && nextNode.wordIndex === undefined) {
        nextNode = nextNode.next;
      }
      if (nextNode) startNode = nextNode;
    }
    
    // Set audio time only if we have a valid wordIndex
    if (startNode?.wordIndex !== undefined) {
      this.audioController?.setCurrentTime(startNode.wordIndex);
    }

    // Find the last node and playEnd time more efficiently
    let lastNode = this.currentNode;
    let playEnd = 0;
    
    // Pre-calculate the end time to avoid doing this in the audio update loop
    while (lastNode && lastNode.mode === 'listen') {
      if (lastNode.wordIndex !== undefined) {
        const timestamp = this.audioController?.getTimeStamp(lastNode.wordIndex);
        if (timestamp && timestamp.end > playEnd) {
          playEnd = timestamp.end;
        }
      }
      if (!lastNode.next) break;
      lastNode = lastNode.next;
    }

    // Create an optimized audio update callback
    const onAudioUpdate = () => {
      const currentTime = this.audioController?.getCurrentTime() || 0;
      let node = this.currentNode;
      
      // Process nodes in batches to reduce UI updates
      const nodesToUpdate: TextNode[] = [];
      
      while (node && node.mode === 'listen') {
        const timestamp = node.wordIndex !== undefined ? 
          this.audioController?.getTimeStamp(node.wordIndex) : undefined;
        
        if (timestamp && currentTime >= timestamp.start) {
          nodesToUpdate.push(node);
        }
        node = node.next || null;
      }
      
      // Batch process all nodes that need updating
      if (nodesToUpdate.length > 0) {
        for (const node of nodesToUpdate) {
          node.highlightText();
          this.moveCursor(true);
        }
        // Call onUpdate only once after processing all nodes
        this.onUpdate?.();
      }
    };

    // Add the update listener to AudioController
    this.audioController?.addEventListener('timeupdate', onAudioUpdate);

    try {
      await this.audioController?.playUntil(playEnd);
    } finally {
      // Clean up the listener
      this.audioController?.removeEventListener('timeupdate', onAudioUpdate);
      
      // Move cursor to first non-listen mode node if still in listen mode
      if (this.currentNode?.mode === 'listen') {
        let nextNonListenNode = this.currentNode;
        while (nextNonListenNode.mode === 'listen' && nextNonListenNode.next) {
          nextNonListenNode = nextNonListenNode.next;
        }
        
        // Skip over any mermaid nodes
        while (nextNonListenNode.next && nextNonListenNode.next.mode === 'mermaid') {
          nextNonListenNode = nextNonListenNode.next;
        }
        
        // If we found a non-listen node, move to it directly instead of stepping through each node
        if (nextNonListenNode !== this.currentNode && nextNonListenNode.mode !== 'listen') {
          this.setCursor(nextNonListenNode);
        }
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
        // Optimize tab handling by finding the end of the word directly
        const startNode = this.currentNode;
        let currentNode = startNode;
        
        while (currentNode && currentNode.value !== ' ' && currentNode.value !== '\n') {
          currentNode.highlightText();
          if (!currentNode.next) break;
          currentNode = currentNode.next;
        }
        
        // Skip over any mermaid nodes
        while (currentNode.next?.mode === 'mermaid') {
          currentNode = currentNode.next;
        }
        
        // Set cursor directly to the end node instead of stepping through
        if (currentNode !== startNode) {
          this.setCursor(currentNode);
        } else {
          this.moveCursor(true);
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

  private handleMermaidMode(e: KeyboardEvent): void {
    if (e.key === 'Backspace') {
      this.moveCursor(false);
    } else {
      this.moveCursor(true);
    }
  }

  public getNodes(): TextNode[] {
    return this.nodes;
  }
}
