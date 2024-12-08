import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { parseStringPromise } from 'xml2js';

// Helper function to extract text from TXT files
export const extractTextFromTXT = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      resolve(text);
    };
    reader.onerror = () => {
      reject('Error reading TXT file.');
    };
    reader.readAsText(file);
  });
};

// Helper function to extract text from XLSX files
export const extractTextFromXLSX = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        let text = '';
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const sheetText = XLSX.utils
            .sheet_to_json(worksheet, { header: 1, raw: false })
            .map((row) => (row as unknown[]).join(' '))
            .join('\n');
          text += sheetText + '\n';
        });
        resolve(text);
      } catch (error) {
        console.error('Error extracting text from XLSX:', error);
        reject('Failed to extract text from XLSX file.');
      }
    };
    reader.onerror = () => {
      reject('Error reading XLSX file.');
    };
    reader.readAsArrayBuffer(file);
  });
};

// Helper function to extract text from PPTX files
export const extractTextFromPPTX = async (file: File): Promise<string> => {
  try {
    const zip = await JSZip.loadAsync(file);
    const slideFiles = Object.keys(zip.files).filter(
      (filename) => filename.startsWith('ppt/slides/slide') && filename.endsWith('.xml')
    );

    let text = '';
    for (const slideFile of slideFiles) {
      const slideContent = await zip.file(slideFile)?.async('string');
      if (slideContent) {
        const parsed = await parseStringPromise(slideContent);
        const texts = parsed['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp'] || [];
        texts.forEach((sp: any) => {
          const txBody = sp['p:txBody'];
          if (txBody) {
            const paragraphs = txBody[0]['a:p'] || [];
            paragraphs.forEach((p: any) => {
              const runs = p['a:r'] || [];
              runs.forEach((r: any) => {
                const texts = r['a:t'] || [];
                texts.forEach((t: any) => {
                  text += t + ' ';
                });
              });
              text += '\n';
            });
          }
        });
      }
    }
    return text;
  } catch (error) {
    console.error('Error extracting text from PPTX:', error);
    throw new Error('Failed to extract text from PPTX file.');
  }
};