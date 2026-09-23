declare module 'jspdf' {
  export class jsPDF {
    constructor(options?: { orientation?: string; unit?: string; format?: string });
    internal: {
      pageSize: { getWidth(): number; getHeight(): number };
    };
    save(filename: string): void;
    addPage(): void;
    setTextColor(r: number, g: number, b: number): void;
    setDrawColor(r: number, g: number, b: number): void;
    setFillColor(r: number, g: number, b: number): void;
    setFont(font: string, style: string): void;
    setFontSize(size: number): void;
    setLineWidth(width: number): void;
    line(x1: number, y1: number, x2: number, y2: number): void;
    rect(x: number, y: number, w: number, h: number, style?: string): void;
    text(content: string | string[], x: number, y: number, options?: object): void;
    splitTextToSize(text: string, maxWidth: number): string[];
  }
}