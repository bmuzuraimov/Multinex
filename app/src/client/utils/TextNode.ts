// text-node.ts
export type Mode = 'hear' | 'type' | 'write';

export class TextNode {
  public id: number;
  public highlight = false;
  public highlightClass = '';
  public currentClass = '';
  public value: string;
  public mode: Mode;
  public baseCharClass: string;
  public wordIndex?: number;
  public prev?: TextNode;
  public next?: TextNode;

  constructor(
    id: number,
    value: string,
    mode: Mode,
    baseCharClass: string,
    wordIndex?: number
  ) {
    this.id = id;
    this.value = value;
    this.mode = mode;
    this.baseCharClass = baseCharClass;
    this.wordIndex = wordIndex;
  }

  public highlightText(correct: boolean = true): void {
    this.highlight = true;
    switch (this.mode) {
      case 'hear':
        this.highlightClass = 'bg-gray-200 dark:bg-gray-700';
        break;
      case 'type':
        this.highlightClass = correct 
          ? 'bg-lime-200 dark:bg-lime-900/50' 
          : 'bg-red-200 dark:bg-red-900/50';
        break;
      case 'write':
        this.highlightClass = 'bg-red-200 dark:bg-red-900/50';
        break;
    }
  }

  public resetHighlight(): void {
    this.highlight = false;
    this.highlightClass = '';
  }
}