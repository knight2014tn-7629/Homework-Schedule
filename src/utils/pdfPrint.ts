import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function oklchToRgbStr(cssText: string): string {
  return cssText.replace(
    /oklch\(\s*([0-9.%+-]+)(?:[\s,]+)([0-9.%+-]+)(?:[\s,]+)([0-9.a-z%+-]+)(?:\s*(?:\/|,)\s*([0-9.%+-]+))?\s*\)/gi,
    (match, rawL, rawC, rawH, rawA) => {
      try {
        let L = parseFloat(rawL);
        if (rawL.endsWith('%')) L /= 100;

        let C = parseFloat(rawC);
        if (rawC.endsWith('%')) C = (C / 100) * 0.4;

        let H = parseFloat(rawH);
        if (typeof rawH === 'string') {
          if (rawH.endsWith('deg')) H = parseFloat(rawH);
          else if (rawH.endsWith('rad')) H = parseFloat(rawH) * (180 / Math.PI);
          else if (rawH.endsWith('turn')) H = parseFloat(rawH) * 360;
        }
        if (isNaN(H)) H = 0;

        let alpha = 1;
        if (rawA !== undefined) {
          alpha = parseFloat(rawA);
          if (rawA.endsWith('%')) alpha /= 100;
        }

        const radH = (H * Math.PI) / 180;
        const a = C * Math.cos(radH);
        const b = C * Math.sin(radH);

        const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

        const l = l_ * l_ * l_;
        const m = m_ * m_ * m_;
        const s = s_ * s_ * s_;

        const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

        const transfer = (c: number) =>
          c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055;

        const R = Math.min(255, Math.max(0, Math.round(transfer(r_lin) * 255)));
        const G = Math.min(255, Math.max(0, Math.round(transfer(g_lin) * 255)));
        const B = Math.min(255, Math.max(0, Math.round(transfer(b_lin) * 255)));

        if (alpha < 1) {
          return `rgba(${R}, ${G}, ${B}, ${alpha.toFixed(3)})`;
        }
        return `rgb(${R}, ${G}, ${B})`;
      } catch {
        return 'rgb(120, 120, 120)';
      }
    }
  );
}

function oklabToRgbStr(cssText: string): string {
  return cssText.replace(
    /oklab\(\s*([0-9.%+-]+)(?:[\s,]+)([-0-9.%+-]+)(?:[\s,]+)([-0-9.%+-]+)(?:\s*(?:\/|,)\s*([0-9.%+-]+))?\s*\)/gi,
    (match, rawL, rawA, rawB, rawAlpha) => {
      try {
        let L = parseFloat(rawL);
        if (rawL.endsWith('%')) L /= 100;

        let a = parseFloat(rawA);
        if (rawA.endsWith('%')) a = (a / 100) * 0.4;

        let b = parseFloat(rawB);
        if (rawB.endsWith('%')) b = (b / 100) * 0.4;

        let alpha = 1;
        if (rawAlpha !== undefined) {
          alpha = parseFloat(rawAlpha);
          if (rawAlpha.endsWith('%')) alpha /= 100;
        }

        const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

        const l = l_ * l_ * l_;
        const m = m_ * m_ * m_;
        const s = s_ * s_ * s_;

        const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

        const transfer = (c: number) =>
          c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055;

        const R = Math.min(255, Math.max(0, Math.round(transfer(r_lin) * 255)));
        const G = Math.min(255, Math.max(0, Math.round(transfer(g_lin) * 255)));
        const B = Math.min(255, Math.max(0, Math.round(transfer(b_lin) * 255)));

        if (alpha < 1) {
          return `rgba(${R}, ${G}, ${B}, ${alpha.toFixed(3)})`;
        }
        return `rgb(${R}, ${G}, ${B})`;
      } catch {
        return 'rgb(120, 120, 120)';
      }
    }
  );
}

function cleanCss(css: string): string {
  if (!css) return css;
  let result = css;
  if (result.includes('oklch')) {
    result = oklchToRgbStr(result);
    result = result.replace(/oklch\([^)]+\)/gi, 'rgb(120, 120, 120)');
  }
  if (result.includes('oklab')) {
    result = oklabToRgbStr(result);
    result = result.replace(/oklab\([^)]+\)/gi, 'rgb(120, 120, 120)');
  }
  return result;
}

export async function exportElementToPdf(
  element: HTMLElement,
  filename: string = '課表.pdf',
  titleStr: string = '課表'
): Promise<boolean> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // Convert all oklch and oklab colors in style sheets and style tags
        Array.from(clonedDoc.styleSheets).forEach((sheet) => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            const cssText = rules.map((r) => r.cssText).join('\n');
            if (cssText.includes('oklch') || cssText.includes('oklab')) {
              const cleaned = cleanCss(cssText);
              const newStyle = clonedDoc.createElement('style');
              newStyle.textContent = cleaned;
              clonedDoc.head.appendChild(newStyle);
              if (sheet.ownerNode && sheet.ownerNode.parentNode) {
                sheet.ownerNode.parentNode.removeChild(sheet.ownerNode);
              }
            }
          } catch {
            // Ignore cross-origin stylesheet errors
          }
        });

        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach((style) => {
          if (style.textContent && (style.textContent.includes('oklch') || style.textContent.includes('oklab'))) {
            style.textContent = cleanCss(style.textContent);
          }
        });

        // Convert inline style attributes and computed oklch/oklab colors on all elements
        const colorProps = [
          'color',
          'background-color',
          'border-color',
          'border-top-color',
          'border-right-color',
          'border-bottom-color',
          'border-left-color',
          'outline-color',
          'fill',
          'stroke',
        ];

        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((node) => {
          if (node instanceof HTMLElement || node instanceof SVGElement) {
            // Check style attribute
            const styleAttr = node.getAttribute('style');
            if (styleAttr && (styleAttr.includes('oklch') || styleAttr.includes('oklab'))) {
              node.setAttribute('style', cleanCss(styleAttr));
            }

            // Check computed styles
            if (node instanceof HTMLElement && clonedDoc.defaultView) {
              const computed = clonedDoc.defaultView.getComputedStyle(node);
              if (computed) {
                colorProps.forEach((prop) => {
                  const val = computed.getPropertyValue(prop);
                  if (val && (val.includes('oklch') || val.includes('oklab'))) {
                    node.style.setProperty(prop, cleanCss(val));
                  }
                });
              }
            }
          }
        });

        // Ensure cloned element is visible and formatted for capture
        const target = clonedDoc.querySelector(`[data-pdf-target]`) as HTMLElement;
        if (target) {
          target.style.padding = '20px';
          target.style.width = '1200px';
          target.style.margin = '0 auto';
        }
      },
    });

    const imgData = canvas.toDataURL('image/png');
    
    // A4 landscape dimensions in mm: 297 x 210
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const margin = 10; // 10mm margins
    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

    let renderWidth = availableWidth;
    let renderHeight = (imgHeight * renderWidth) / imgWidth;

    if (renderHeight > availableHeight) {
      renderHeight = availableHeight;
      renderWidth = (imgWidth * renderHeight) / imgHeight;
    }

    const xPos = (pdfWidth - renderWidth) / 2;
    const yPos = (pdfHeight - renderHeight) / 2;

    pdf.addImage(imgData, 'PNG', xPos, yPos, renderWidth, renderHeight);
    
    // Add document footer
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    const dateStr = new Date().toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    pdf.text(`匯出時間：${dateStr} | ${titleStr} | 國民小學課表系統`, margin, pdfHeight - 4);

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF 匯出失敗:', error);
    alert('PDF 匯出失敗，將為您啟動列印功能。');
    window.print();
    return false;
  }
}

export function triggerPrint() {
  window.print();
}

