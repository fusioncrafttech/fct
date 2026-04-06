import { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';

interface PDFPreviewProps {
  pdfComponent: React.ReactElement<any>;
  className?: string;
}

export default function PDFPreview({ pdfComponent, className = "" }: PDFPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generatePdfUrl = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Add a small delay to ensure the component is mounted
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Create PDF with error handling
        const doc = pdf(pdfComponent);
        const blob = await doc.toBlob();
        
        if (!blob) {
          throw new Error('Failed to generate PDF blob');
        }
        
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error generating PDF preview:', error);
        let errorMessage = 'Failed to generate PDF preview. Please try again.';
        
        // Provide more specific error messages
        if (error instanceof Error) {
          if (error.message.includes('Buffer')) {
            errorMessage = 'PDF generation failed due to browser compatibility. Please try refreshing the page.';
          } else if (error.message.includes('font')) {
            errorMessage = 'PDF font loading failed. Please try again.';
          } else if (error.message.includes('Network')) {
            errorMessage = 'Network error occurred. Please check your connection and try again.';
          }
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    generatePdfUrl();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfComponent]);

  const handleRetry = () => {
    setError('');
    setIsLoading(true);
    // Trigger regeneration
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center h-96 bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Generating PDF preview...</p>
          <p className="text-sm text-gray-500">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className={`flex flex-col items-center justify-center h-96 bg-red-50 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4 max-w-md">{error || 'Failed to generate PDF preview'}</p>
          <div className="space-x-3">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => setError('')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      <iframe
        src={pdfUrl}
        className="w-full h-96 border-0"
        title="PDF Preview"
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => setIsLoading(false)}
        onError={() => setError('Failed to load PDF preview')}
      />
    </div>
  );
}
