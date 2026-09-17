import React, { useEffect, useRef } from 'react';
import SmilesDrawer from 'smiles-drawer';

const SmilesRenderer = ({ smilesString }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && smilesString) {
      // Configure drawing settings for a clean, modern look
      const options = { 
        width: 300, 
        height: 300,
        bondThickness: 1.5,
        fontSizeLarge: 7,
        padding: 5
      };
      
      const drawer = new SmilesDrawer.Drawer(options);
      
      SmilesDrawer.parse(smilesString, (tree) => {
        // 'light' theme maps well to standard paper
        drawer.draw(tree, canvasRef.current, 'light', false);
      }, (err) => {
        console.error('Error drawing SMILES:', err);
      });
    }
  }, [smilesString]);

  if (!smilesString) return null;

  return (
    <div className="flex justify-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm my-4">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SmilesRenderer;