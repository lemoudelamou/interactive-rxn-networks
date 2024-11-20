import React from 'react';
import html2canvas from 'html2canvas';
import '../style/Controls.css'

const Controls = ({ isFullscreen, setIsFullscreen, networkRef, graphContainerRef }) => {
  const zoomIn = () => {
    const network = networkRef.current;
    network?.getScale() && network.moveTo({ scale: network.getScale() + 0.1 });
  };

  const zoomOut = () => {
    const network = networkRef.current;
    network?.getScale() && network.moveTo({ scale: network.getScale() - 0.1 });
  };

  const captureScreenshot = () => {
    const graphCanvas = graphContainerRef.current.querySelector('canvas');
    const legendContainer = document.querySelector('.legend');
  
    if (graphCanvas && legendContainer) {
      const originalFontSize = window.getComputedStyle(legendContainer).fontSize;
  
      legendContainer.style.fontSize = '18px';  
  
      const graphHeight = graphCanvas.height;
      const graphWidth = graphCanvas.width;
      const legendHeight = legendContainer.offsetHeight;
      const legendWidth = legendContainer.offsetWidth;
  
      const newCanvas = document.createElement('canvas');
      newCanvas.width = graphWidth;
      newCanvas.height = graphHeight + legendHeight;
      const context = newCanvas.getContext('2d');
  
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, newCanvas.width, newCanvas.height);
  
      context.drawImage(graphCanvas, 0, 0);
  
      html2canvas(legendContainer, { scale: 1, useCORS: true }).then((legendCanvas) => {
        context.drawImage(legendCanvas, 0, 0);
  
        const image = newCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'graph.png';
        link.click();
  
        legendContainer.style.fontSize = originalFontSize;
      });
    }
  };
  
  

  return (
    <div className="controls">
      <button onClick={() => setIsFullscreen(!isFullscreen)}>
        <i className={isFullscreen ? 'fas fa-compress' : 'fas fa-expand'}></i>
      </button>
      <button onClick={zoomIn}>
        <i className="fas fa-search-plus"></i>
      </button>
      <button onClick={zoomOut}>
        <i className="fas fa-search-minus"></i>
      </button>
      <button onClick={captureScreenshot}>
        <i className="fas fa-camera"></i>
      </button>
    </div>
  );
};

export default Controls;
