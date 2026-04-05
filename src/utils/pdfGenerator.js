import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ═══════════════════════════════════════════
//  PDF 報價單 / 建議規格書 生成器
// ═══════════════════════════════════════════

const COMPANY = {
  name: "大正油壓機械股份有限公司",
  nameEn: "Propiston Hydraulic Machinery Co., Ltd.",
  address: "412台中市大里區夏田路23號",
  phone: "886-4-2407-3898",
  email: "info@propiston.com",
};

function formatDate() {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
}

function formatDateCompact() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}

function createDoc() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  // Use helvetica as base font (supports ASCII), Chinese will use unicode fallback
  doc.setFont('helvetica');
  return doc;
}

function collectPropistonProducts(matchResults) {
  const items = [];
  let itemNo = 1;

  // Pumps
  const pumpMatch = matchResults.pumps?.propiston;
  if (pumpMatch && !pumpMatch.noMatch) {
    for (const m of pumpMatch.matches) {
      items.push({
        no: itemNo++,
        model: m.matched.model,
        spec: `${m.series} / ${m.matched.displacement} cc/rev / ${m.matched.maxPressure} MPa`,
        qty: 1,
        price: m.matched.price || 0,
      });
    }
  }

  // Directional valves
  const dvMatch = matchResults.directionalValves?.propiston;
  if (dvMatch && !dvMatch.noMatch) {
    for (const m of dvMatch.matches) {
      items.push({
        no: itemNo++,
        model: m.matched.model,
        spec: `${m.series} / ${m.matched.maxFlow} L/min / ${m.matched.maxPressure} MPa`,
        qty: 1,
        price: m.matched.price || 0,
      });
    }
  }

  // Relief valves
  const rvMatch = matchResults.reliefValves?.propiston;
  if (rvMatch && !rvMatch.noMatch) {
    for (const m of rvMatch.matches) {
      items.push({
        no: itemNo++,
        model: m.matched.model,
        spec: `${m.series} / ${m.matched.maxFlow} L/min / ${m.matched.maxPressure} MPa`,
        qty: 1,
        price: m.matched.price || 0,
      });
    }
  }

  // Cylinders
  const cylMatch = matchResults.cylinders?.propiston;
  if (cylMatch && !cylMatch.noMatch) {
    for (const m of cylMatch.matches) {
      items.push({
        no: itemNo++,
        model: m.matched.displayModel || m.matched.model,
        spec: `${m.series} / Bore ${m.matched.bore}mm / Stroke ${m.matched.actualStroke || m.matched.maxStroke}mm`,
        qty: 1,
        price: m.matched.price || 0,
      });
    }
  }

  return items;
}

function collectBrandProducts(matchResults, brandKey) {
  const items = [];
  let itemNo = 1;

  const sections = [
    { key: 'pumps', label: 'Pump' },
    { key: 'directionalValves', label: 'Directional Valve' },
    { key: 'reliefValves', label: 'Relief Valve' },
    { key: 'cylinders', label: 'Cylinder' },
    { key: 'motors', label: 'Motor' },
  ];

  for (const section of sections) {
    const data = matchResults[section.key]?.[brandKey];
    if (data && !data.noMatch) {
      for (const m of data.matches) {
        let spec = m.series;
        const matched = m.matched;
        if (matched.displacement) spec += ` / ${matched.displacement} cc/rev`;
        if (matched.maxFlow) spec += ` / ${matched.maxFlow} L/min`;
        if (matched.maxPressure) spec += ` / ${matched.maxPressure} MPa`;
        if (matched.bore) spec += ` / Bore ${matched.bore}mm`;
        if (matched.power_kW) spec += ` / ${matched.power_kW} kW`;
        if (matched.ratedTorque_Nm) spec += ` / ${matched.ratedTorque_Nm} N.m`;
        if (matched.servoDriver) spec += ` + ${matched.servoDriver}`;
        items.push({
          no: itemNo++,
          model: matched.displayModel || matched.model,
          spec,
          qty: 1,
        });
      }
    }
  }
  return items;
}

// ─── Propiston 正式報價單 ─────────────────
export function generateQuotationPDF(matchResults, customerName) {
  const doc = createDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 15;

  // Header - Company info
  doc.setFillColor(0, 51, 102); // #003366
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('PROPISTON', margin, 18);
  doc.setFontSize(9);
  doc.text(COMPANY.nameEn, margin, 25);
  doc.text(COMPANY.address, margin, 31);
  doc.text(`TEL: ${COMPANY.phone}  |  ${COMPANY.email}`, margin, 37);

  // Quotation title
  y = 52;
  doc.setTextColor(0, 51, 102);
  doc.setFontSize(20);
  doc.text('QUOTATION', pageWidth / 2, y, { align: 'center' });

  // Quote info
  y = 64;
  doc.setFontSize(10);
  doc.setTextColor(51, 51, 51);

  doc.text(`Date: ${formatDate()}`, margin, y);
  doc.text(`Valid: 30 days`, pageWidth - margin, y, { align: 'right' });
  y += 8;
  doc.text(`Customer: ${customerName || 'N/A'}`, margin, y);

  // Divider
  y += 6;
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  // Products table
  y += 4;
  const items = collectPropistonProducts(matchResults);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const tableData = items.map(item => [
    item.no,
    item.model,
    item.spec,
    item.qty,
    item.price > 0 ? `NT$ ${item.price.toLocaleString()}` : 'TBD',
    item.price > 0 ? `NT$ ${(item.price * item.qty).toLocaleString()}` : 'TBD',
  ]);

  doc.autoTable({
    startY: y,
    head: [['No.', 'Model', 'Specification', 'Qty', 'Unit Price', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 51, 51],
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 42 },
      2: { cellWidth: 58 },
      3: { cellWidth: 14, halign: 'center' },
      4: { cellWidth: 28, halign: 'right' },
      5: { cellWidth: 28, halign: 'right' },
    },
    margin: { left: margin, right: margin },
  });

  // Total
  y = doc.lastAutoTable.finalY + 6;
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  if (total > 0) {
    doc.text(`Total: NT$ ${total.toLocaleString()}`, pageWidth - margin, y, { align: 'right' });
  } else {
    doc.text('Total: Please contact sales', pageWidth - margin, y, { align: 'right' });
  }

  // Notes
  y += 14;
  doc.setFontSize(9);
  doc.setTextColor(102, 102, 102);
  doc.text('Notes:', margin, y);
  y += 6;
  const notes = [
    '1. This quotation is valid for 30 days from the date of issue.',
    '2. Delivery time to be confirmed by sales representative.',
    '3. Prices are subject to change without prior notice.',
    '4. Specifications are recommendations based on calculation results.',
    '   Actual selection should be confirmed by our engineering team.',
  ];
  for (const note of notes) {
    doc.text(note, margin, y);
    y += 5;
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  doc.setFontSize(7);
  doc.setTextColor(153, 153, 153);
  doc.text(
    `${COMPANY.nameEn} | ${COMPANY.address} | TEL: ${COMPANY.phone}`,
    pageWidth / 2, pageHeight - 10, { align: 'center' }
  );

  // Download
  doc.save(`Propiston_Quotation_${formatDateCompact()}.pdf`);
}

// ─── 其他品牌建議規格書 ─────────────────
export function generateSpecSheetPDF(matchResults, brandKey, brandName) {
  const doc = createDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 15;

  // Header
  doc.setFillColor(248, 249, 250);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(0, 30, pageWidth, 30);

  doc.setTextColor(0, 51, 102);
  doc.setFontSize(16);
  doc.text('Hydraulic System Specification Sheet', pageWidth / 2, 14, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text(`Brand: ${brandName}`, pageWidth / 2, 23, { align: 'center' });

  // Date
  y = 38;
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
  doc.text(`Date: ${formatDate()}`, margin, y);

  // Products table (no price)
  y += 8;
  const items = collectBrandProducts(matchResults, brandKey);

  const tableData = items.map(item => [
    item.no,
    item.model,
    item.spec,
    item.qty,
  ]);

  doc.autoTable({
    startY: y,
    head: [['No.', 'Model', 'Specification', 'Qty']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 51, 51],
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 100 },
      3: { cellWidth: 16, halign: 'center' },
    },
    margin: { left: margin, right: margin },
  });

  // Disclaimer
  y = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(8);
  doc.setTextColor(153, 153, 153);
  doc.text(
    'This is a recommended specification sheet, not an official quotation.',
    pageWidth / 2, y, { align: 'center' }
  );
  y += 5;
  doc.text(
    'For actual specifications and pricing, please contact the brand distributor.',
    pageWidth / 2, y, { align: 'center' }
  );

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text(
    'Generated by HydroSelect - Hydraulic System Selection Platform',
    pageWidth / 2, pageHeight - 10, { align: 'center' }
  );

  doc.save(`SpecSheet_${brandName.replace(/\s/g,'_')}_${formatDateCompact()}.pdf`);
}
