// text-node.ts
export type Mode = 'listen' | 'type' | 'write';

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

  constructor(id: number, value: string, mode: Mode, baseCharClass: string, wordIndex?: number) {
    this.id = id;
    this.value = value;
    this.mode = mode;
    this.baseCharClass = baseCharClass;
    this.wordIndex = wordIndex;
  }

  public highlightText(correct: boolean = true): void {
    this.highlight = true;
    switch (this.mode) {
      case 'listen':
        this.highlightClass = 'bg-listen';
        break;
      case 'type':
        this.highlightClass = correct ? 'bg-type' : 'bg-red-200';
        break;
      case 'write':
        this.highlightClass = 'bg-write';
        break;
    }
  }

  public resetHighlight(): void {
    this.highlight = false;
    this.highlightClass = '';
  }
}
