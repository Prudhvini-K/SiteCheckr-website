import jsPDF from 'jspdf';
import { SecurityReport } from '../types';

export const generatePDFReport = async (report: SecurityReport): Promise<void> => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Header with logo and title
    pdf.setFillColor(59, 130, 246); // Blue color
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SiteCheckr', margin, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Security Assessment Platform', margin, 35);

    yPosition = 60;

    // Report Information
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Website Security Assessment Report', margin, yPosition);
    yPosition += 20;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(`Website: ${report.url}`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addWrappedText(`Scan Date: ${report.timestamp.toLocaleString()}`, margin, yPosition + 5, pageWidth - 2 * margin);
    yPosition = addWrappedText(`Total Checks: ${report.checks.length}`, margin, yPosition + 5, pageWidth - 2 * margin);
    yPosition += 20;

    // AI Verdict Section
    checkNewPage(60);
    pdf.setFillColor(240, 248, 255); // Light blue background
    pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 50, 'F');
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    const verdictColor = report.aiVerdict.status === 'safe' ? [22, 163, 74] : 
                        report.aiVerdict.status === 'caution' ? [202, 138, 4] : [220, 38, 38];
    pdf.setTextColor(...verdictColor);
    pdf.text('AI Security Verdict', margin + 5, yPosition + 10);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(`Status: ${report.aiVerdict.status.toUpperCase()}`, margin + 5, yPosition + 20, pageWidth - 2 * margin - 10);
    yPosition = addWrappedText(`Confidence: ${report.aiVerdict.confidence}%`, margin + 5, yPosition + 5, pageWidth - 2 * margin - 10);
    yPosition = addWrappedText(`Summary: ${report.aiVerdict.summary}`, margin + 5, yPosition + 5, pageWidth - 2 * margin - 10);
    yPosition += 20;

    // AI Recommendations
    checkNewPage(40);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AI Recommendations:', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    report.aiVerdict.recommendations.forEach((rec, index) => {
      checkNewPage(15);
      yPosition = addWrappedText(`• ${rec}`, margin + 5, yPosition, pageWidth - 2 * margin - 10);
      yPosition += 5;
    });
    yPosition += 10;

    // Detailed Results
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detailed Security Check Results', margin, yPosition);
    yPosition += 15;

    report.checks.forEach((check, index) => {
      checkNewPage(80);
      
      // Check header with background
      const statusColor = check.status === 'safe' ? [220, 252, 231] : 
                         check.status === 'warning' ? [254, 249, 195] : [254, 226, 226];
      pdf.setFillColor(...statusColor);
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25, 'F');
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(check.name, margin + 5, yPosition + 5);
      
      pdf.setFontSize(12);
      const scoreColor = check.score >= 90 ? [22, 163, 74] : check.score >= 70 ? [202, 138, 4] : [220, 38, 38];
      pdf.setTextColor(...scoreColor);
      pdf.text(`${check.score}/100`, pageWidth - margin - 30, yPosition + 5);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      yPosition = addWrappedText(`Status: ${check.status.toUpperCase()}`, margin + 5, yPosition + 15, pageWidth - 2 * margin - 10);
      yPosition += 10;

      // Details
      yPosition = addWrappedText(`Details: ${check.details}`, margin + 5, yPosition, pageWidth - 2 * margin - 10);
      yPosition += 10;

      // Findings
      if (check.findings.length > 0) {
        pdf.setFont('helvetica', 'bold');
        yPosition = addWrappedText('Findings:', margin + 5, yPosition, pageWidth - 2 * margin - 10, 10);
        pdf.setFont('helvetica', 'normal');
        check.findings.forEach(finding => {
          checkNewPage(15);
          yPosition = addWrappedText(`• ${finding}`, margin + 10, yPosition, pageWidth - 2 * margin - 15, 9);
          yPosition += 3;
        });
        yPosition += 5;
      }

      // Recommendations
      if (check.recommendations && check.recommendations.length > 0) {
        checkNewPage(20);
        pdf.setFont('helvetica', 'bold');
        yPosition = addWrappedText('Recommendations:', margin + 5, yPosition, pageWidth - 2 * margin - 10, 10);
        pdf.setFont('helvetica', 'normal');
        check.recommendations.forEach(rec => {
          checkNewPage(15);
          yPosition = addWrappedText(`• ${rec}`, margin + 10, yPosition, pageWidth - 2 * margin - 15, 9);
          yPosition += 3;
        });
      }
      yPosition += 15;
    });

    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated by SiteCheckr Security Assessment Platform - Page ${i} of ${totalPages}`, 
               margin, pageHeight - 10);
      pdf.text(`Report generated on ${new Date().toLocaleString()}`, 
               pageWidth - margin - 60, pageHeight - 10);
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const domain = report.url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `SiteCheckr_Report_${domain}_${timestamp}.pdf`;

    // Save the PDF
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF report. Please try again.');
  }
};