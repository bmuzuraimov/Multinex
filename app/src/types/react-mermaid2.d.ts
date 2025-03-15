declare module 'react-mermaid2' {
  import React from 'react';
  
  interface MermaidProps {
    chart: string;
    config?: {
      securityLevel?: string;
      theme?: string;
      [key: string]: any;
    };
    className?: string;
  }
  
  const Mermaid: React.FC<MermaidProps>;
  
  export default Mermaid;
} 