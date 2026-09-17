import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import SmilesRenderer from './SmilesRenderer';

const FormattedText = ({ text }) => {
  if (!text) return null;

  // A simple heuristic: if a 10+ char string has lots of equals, rings, or brackets, treat it as a SMILES string to render
  const isSmiles = (str) => {
     const smilesRegex = /^([CNOFSPc1-9\=\#\(\)\[\]\+\-\\]){10,}$/;
     return smilesRegex.test(str.trim());
  };

  // Split the text by the LaTeX $ delimiters
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <div className="text-slate-800 text-lg leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const mathExp = part.slice(1, -1);
          return <InlineMath key={index} math={mathExp} />;
        }
        
        if (isSmiles(part)) {
          return <SmilesRenderer key={index} smilesString={part.trim()} />;
        }
        
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export default FormattedText;