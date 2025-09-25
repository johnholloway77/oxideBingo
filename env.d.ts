declare module  'https://unpkg.com/html-to-image@1.11.11/es/index.js' {
  export function toBlob(
      node: HTMLElement,
      options?: {
        pixelRatio?: number;
        cacheBust?: boolean;
        backgroundColor?: string;
      }
  ): Promise<Blob | null>;

  export function toJpeg(
      node: HTMLElement,
      options?: {
        quality?: number;
        pixelRatio?: number;
        cacheBust?: boolean;
        backgroundColor?: string;
      }
  ): Promise<string>;

}