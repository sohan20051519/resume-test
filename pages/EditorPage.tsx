import React, { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import EditorForm from '../components/editor/EditorForm';
import ResumePreview from '../components/resume/ResumePreview';
import { TEMPLATES } from '../constants';

// --- Mobile Preview Modal Component ---
// This component is defined here to avoid creating new files, as per constraints.
interface MobileResumePreviewModalProps {
    onClose: () => void;
    onDownload: () => void;
    isGenerating: boolean;
    previewRef: React.RefObject<HTMLDivElement>;
}

const MobileResumePreviewModal: React.FC<MobileResumePreviewModalProps> = ({ onClose, onDownload, isGenerating, previewRef }) => {
    const { state } = useResume();
    const { data, templateId } = state;
    const SelectedTemplate = TEMPLATES.find(t => t.id === templateId)?.component;
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0);

    useLayoutEffect(() => {
        const calculateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                setScale(containerWidth / 850);
            }
        };

        const observer = new ResizeObserver(calculateScale);
        if (containerRef.current) {
            observer.observe(containerRef.current);
            calculateScale(); // Initial calculation
        }
        return () => observer.disconnect();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center p-2 md:hidden" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-md h-full max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-3 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800">Preview</h3>
                    <div className="flex items-center gap-2">
                         <button
                            onClick={onDownload}
                            disabled={isGenerating}
                            className="flex items-center justify-center gap-2 px-4 py-2 text-xs bg-brand-primary text-white font-bold rounded-full shadow-md hover:bg-brand-secondary disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            <span>Download PDF</span>
                        </button>
                        <button onClick={onClose} className="text-2xl p-1 rounded-full text-gray-500 hover:bg-gray-200" aria-label="Close">
                            &times;
                        </button>
                    </div>
                </header>
                <div className="flex-grow overflow-auto p-2 bg-gray-200">
                    <div ref={containerRef} className="aspect-[8.5/11] w-full bg-white shadow-inner overflow-hidden rounded-md">
                        {scale > 0 && (
                            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                {/* This is the div that needs the ref for printing */}
                                <div ref={previewRef} className="w-[850px] h-[1100px] bg-white">
                                    {SelectedTemplate ? <SelectedTemplate data={data} /> : <div>Template not found.</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const EditorPage: React.FC = () => {
    const navigate = useNavigate();
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const handleDownload = () => {
        const source = resumePreviewRef.current;
        if (!source) {
            alert("Could not find resume content to generate the document.");
            return;
        }

        setIsGenerating(true);

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow!.document;
        const resumeHTML = source.innerHTML;

        // Hardcode the Tailwind script and config to ensure styles are applied reliably in the iframe.
        // This is the most robust way to handle printing across all browsers, especially mobile.
        const printContent = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Resume</title>
                <script src="https://cdn.tailwindcss.com"><\/script>
                <script>
                  tailwind.config = {
                    theme: {
                      extend: {
                        boxShadow: {
                          'neumorphic-sm': '4px 4px 8px #c7c7c7, -4px -4px 8px #ffffff',
                          'neumorphic-sm-inset': 'inset 4px 4px 8px #c7c7c7, inset -4px -4px 8px #ffffff',
                          'neumorphic': '8px 8px 16px #c7c7c7, -8px -8px 16px #ffffff',
                          'neumorphic-inset': 'inset 8px 8px 16px #c7c7c7, inset -8px -8px 16px #ffffff',
                        },
                        colors: {
                           'brand-primary': '#4f46e5',
                           'brand-secondary': '#7c3aed',
                        }
                      }
                    }
                  }
                <\/script>
                <style>
                    /* Print-specific styles for perfect layout */
                    @media print {
                        @page {
                            size: letter;
                            margin: 0;
                        }
                        html, body {
                            width: 8.5in;
                            height: 11in;
                            margin: 0;
                            padding: 0;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                    body {
                        margin: 0;
                    }
                </style>
              </head>
              <body>
                ${resumeHTML}
              </body>
            </html>
        `;

        iframeDoc.open();
        iframeDoc.write(printContent);
        iframeDoc.close();

        const printAndCleanup = () => {
            try {
                iframe.contentWindow!.focus(); // focus is important for some browsers
                iframe.contentWindow!.print();
            } catch (e) {
                console.error("Printing failed:", e);
                alert("An error occurred while trying to print. Your browser may be blocking it.");
            } finally {
                // Cleanup needs to happen after print dialog is closed, but there's no event for that.
                // A delay is the most reliable cross-browser approach.
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    setIsGenerating(false);
                }, 1000);
            }
        };

        // Use a longer timeout to ensure Tailwind's CDN script has time to fetch, run, and apply styles.
        setTimeout(printAndCleanup, 1000);
    };

    const GeneratingIndicator = (
         <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-neumorphic text-center max-w-sm">
                <svg className="animate-spin h-10 w-10 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Preparing your document...</h3>
                <p className="text-gray-600 mt-2 text-sm">Your browser's print dialog will open. Please select 'Save as PDF'.</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-200">
            {isGenerating && GeneratingIndicator}

            {isPreviewModalOpen && (
                <MobileResumePreviewModal
                    onClose={() => setIsPreviewModalOpen(false)}
                    onDownload={handleDownload}
                    isGenerating={isGenerating}
                    previewRef={resumePreviewRef}
                />
            )}

            {/* Left Side: Editor Form */}
            <div className="w-full md:w-1/2 lg:w-2/5 p-4 md:p-6 lg:p-8">
                <div className="bg-gray-100 rounded-2xl shadow-neumorphic-inset p-6">
                    <EditorForm />
                </div>
            </div>

            {/* Right Side: Resume Preview (Hidden on mobile) */}
            <div className="hidden md:block w-full md:w-1/2 lg:w-3/5 p-4 md:p-6 lg:p-8">
                <div className="sticky top-24">
                    <div className="mb-4 flex flex-col sm:flex-row justify-end gap-3">
                         <button
                            onClick={() => navigate('/templates')}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold rounded-full shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transform hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            <span>Change Template</span>
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span>Download PDF</span>
                        </button>
                    </div>
                    <ResumePreview ref={resumePreviewRef} />
                </div>
            </div>

            {/* Floating Action Button (Visible only on mobile) */}
             <button
                onClick={() => setIsPreviewModalOpen(true)}
                className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white p-4 rounded-full shadow-lg z-30 transform hover:scale-110 transition-transform"
                aria-label="Preview and Download Resume"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </button>
        </div>
    );
};

export default EditorPage;
