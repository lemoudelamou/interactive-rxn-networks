import React from 'react';
import { Button } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import '../style/Controls.css';

const Controls = ({ isFullscreen, setIsFullscreen, networkRef, graphContainerRef }) => {
  const adjustZoom = (zoomChange) => {
    const network = networkRef.current;
    if (network?.getScale) {
      const currentScale = network.getScale();
      const newScale = currentScale + zoomChange;

      if (newScale > 0) {
        network.moveTo({ scale: newScale });
      } else {
        console.warn("Zoom scale must be greater than zero.");
      }
    }
  };

  const captureScreenshot = async () => {
    const graphCanvas = graphContainerRef.current?.querySelector('canvas');
    const legendContainer = document.querySelector('.legend');
  
    if (!graphCanvas || !legendContainer) return;
  
    const originalFontSize = legendContainer.style.fontSize;
    legendContainer.style.fontSize = '14px'; 
  
    try {
      const graphHeight = graphCanvas.height;
      const graphWidth = graphCanvas.width;
  
      const legendCanvas = await html2canvas(legendContainer, { 
        scale: Math.max(1, window.devicePixelRatio), 
        useCORS: true 
      });
  
      const newCanvas = document.createElement('canvas');
      newCanvas.width = Math.max(graphWidth, legendCanvas.width);
      newCanvas.height = graphHeight + legendCanvas.height;
  
      const context = newCanvas.getContext('2d');
  
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, newCanvas.width, newCanvas.height);
  
      context.drawImage(graphCanvas, 0, 0);
  
      const legendXOffset = (newCanvas.width - legendCanvas.width);
      context.drawImage(legendCanvas, legendXOffset, graphHeight);
  
      const image = newCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'graph_with_legend.png';
      link.click();
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    } finally {
      legendContainer.style.fontSize = originalFontSize; 
    }
  };
  

  return (
    <div className="controls">
      <Button onClick={() => setIsFullscreen((prev) => !prev)} className="control-btn">
        <i className={isFullscreen ? 'fas fa-compress' : 'fas fa-expand'}></i>
      </Button>
      <Button onClick={() => adjustZoom(0.1)} className="control-btn">
        <i className="fas fa-search-plus"></i>
      </Button>
      <Button onClick={() => adjustZoom(-0.1)} className="control-btn">
        <i className="fas fa-search-minus"></i>
      </Button>
      <Button onClick={captureScreenshot} className="control-btn">
        <i className="fas fa-camera"></i>
      </Button>
    </div>
  );
};

export default Controls;
