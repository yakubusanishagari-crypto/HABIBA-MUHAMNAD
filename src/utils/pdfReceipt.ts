import { jsPDF } from 'jspdf';
import { Order, SiteSettings } from '../types';
import { OFFICIAL_LOGO_URL, OFFICIAL_LOGO_REMOTE, loadImageAsDataUrl } from './imageUpload';

/**
 * Generates and downloads a clean, luxury, professional PDF receipt
 * for an order featuring the official HABEEBATUSSUNNAH green-and-gold logo.
 */
export const downloadOrderReceiptPDF = async (order: Order, settings: SiteSettings): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Primary Palette: Brand Emerald Green, Lustrous Gold, Clean Slate
  const brandEmeraldDark = [6, 78, 59];    // #064E3B (Deep Emerald)
  const brandEmeraldMid = [5, 150, 105];   // #059669
  const brandGold = [217, 119, 6];         // #D97706 (Rich Gold)
  const brandGoldLight = [254, 243, 199];  // #FEF3C7
  const slate900 = [15, 23, 42];           // #0F172A
  const slate600 = [71, 85, 105];          // #475569
  const borderGray = [226, 232, 240];      // #E2E8F0
  const lightGray = [248, 250, 252];       // #F8FAFC

  // 1. TOP HEADER BANNER (Deep Emerald Green + Gold accent strip)
  doc.setFillColor(brandEmeraldDark[0], brandEmeraldDark[1], brandEmeraldDark[2]);
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Gold accent separator bar
  doc.setFillColor(brandGold[0], brandGold[1], brandGold[2]);
  doc.rect(0, 44, pageWidth, 2, 'F');

  // Try to load and embed the official logo image
  let hasEmbeddedLogo = false;
  try {
    const logoDataUrl = await Promise.race([
      loadImageAsDataUrl(OFFICIAL_LOGO_URL),
      new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
    ]).catch(() => loadImageAsDataUrl(OFFICIAL_LOGO_REMOTE));

    if (logoDataUrl) {
      // Draw circular/emblem logo at top left
      doc.addImage(logoDataUrl, 'PNG', margin, 7, 28, 28);
      hasEmbeddedLogo = true;
    }
  } catch (err) {
    console.warn('Could not load logo image for PDF receipt, using vector fallback', err);
  }

  const textStartX = hasEmbeddedLogo ? margin + 33 : margin;

  // Official Brand Typography
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('HABEEBATUSSUNNAH ONLINE BUSINESS', textStartX, 17);

  // Subtitle / Verified Stamp
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(brandGoldLight[0], brandGoldLight[1], brandGoldLight[2]);
  doc.text('OFFICIAL PAYMENT RECEIPT & VERIFIED ORDER INVOICE', textStartX, 24);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229); // emerald-100
  doc.text(
    `Tel: ${settings.phone_number || '+2348034343283'}  |  WhatsApp: ${settings.whatsapp_number || '+2348034343283'}  |  Nationwide Nigeria Logistics`,
    textStartX,
    31
  );

  // Status Badge on Right Header
  const badgeWidth = 48;
  const badgeHeight = 12;
  const badgeX = pageWidth - margin - badgeWidth;
  doc.setFillColor(brandGold[0], brandGold[1], brandGold[2]);
  doc.roundedRect(badgeX, 13, badgeWidth, badgeHeight, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PAYMENT CONFIRMED', badgeX + badgeWidth / 2, 20.5, { align: 'center' });

  // 2. RECEIPT METADATA BAR
  let currentY = 52;

  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('ORDER NUMBER', margin + 6, currentY + 7);
  doc.text('DATE ISSUED', margin + 55, currentY + 7);
  doc.text('PAYMENT METHOD', margin + 100, currentY + 7);
  doc.text('TRACKING STAGE', margin + 145, currentY + 7);

  doc.setFontSize(9);
  doc.setFont('courier', 'bold');
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text(order.id, margin + 6, currentY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  doc.text(formattedDate, margin + 55, currentY + 16);

  doc.text(`${settings.payment_provider || 'OPAY'} Transfer`, margin + 100, currentY + 16);

  doc.setTextColor(brandEmeraldMid[0], brandEmeraldMid[1], brandEmeraldMid[2]);
  doc.text(order.tracking_stage || 'SELLER CONFIRMED', margin + 145, currentY + 16);

  // 3. CUSTOMER & DELIVERY INFORMATION
  currentY += 29;

  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, currentY, contentWidth, 29, 2, 2, 'D');

  doc.setFillColor(brandEmeraldDark[0], brandEmeraldDark[1], brandEmeraldDark[2]);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CUSTOMER & DELIVERY DISPATCH INFORMATION', margin + 4, currentY + 5);

  const colWidth = contentWidth / 2;
  doc.setFontSize(8);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Customer Name:', margin + 6, currentY + 13);
  doc.text('Phone / WhatsApp:', margin + 6, currentY + 19);
  doc.text('Email Address:', margin + 6, currentY + 25);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text(order.customer.full_name, margin + 35, currentY + 13);
  doc.text(
    `${order.customer.phone_number} / ${order.customer.whatsapp_number}`,
    margin + 35,
    currentY + 19
  );
  doc.text(order.customer.email || 'N/A', margin + 35, currentY + 25);

  // Right column: Delivery Destination Address
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Delivery Address:', margin + colWidth + 4, currentY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  const addressLine = `${order.customer.delivery_address}`;
  const splitAddress = doc.splitTextToSize(addressLine, colWidth - 8);
  doc.text(splitAddress, margin + colWidth + 4, currentY + 18);
  doc.text(
    `Destination: ${order.customer.city}, ${order.customer.state}`,
    margin + colWidth + 4,
    currentY + 26
  );

  // 4. ITEM DETAILS TABLE
  currentY += 34;

  // Table Header
  doc.setFillColor(brandEmeraldDark[0], brandEmeraldDark[1], brandEmeraldDark[2]);
  doc.rect(margin, currentY, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('ITEM DESCRIPTION', margin + 4, currentY + 5.5);
  doc.text('QTY', margin + 110, currentY + 5.5, { align: 'center' });
  doc.text('UNIT PRICE (NGN)', margin + 140, currentY + 5.5, { align: 'right' });
  doc.text('SUBTOTAL (NGN)', margin + contentWidth - 4, currentY + 5.5, { align: 'right' });

  currentY += 8;

  // Table Rows
  order.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const rowHeight = 10;

    if (isEven) {
      doc.setFillColor(252, 252, 253);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    }

    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);

    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    const title = item.product_name.length > 45 ? `${item.product_name.substring(0, 42)}...` : item.product_name;
    doc.text(title, margin + 4, currentY + 4.5);

    const options = [
      item.selected_size ? `Size: ${item.selected_size}` : '',
      item.selected_color ? `Color: ${item.selected_color}` : ''
    ].filter(Boolean).join('  |  ');

    if (options) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(slate600[0], slate600[1], slate600[2]);
      doc.text(options, margin + 4, currentY + 8.5);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text(item.quantity.toString(), margin + 110, currentY + 6, { align: 'center' });

    doc.text(item.unit_price.toLocaleString(), margin + 140, currentY + 6, { align: 'right' });
    doc.text(item.subtotal.toLocaleString(), margin + contentWidth - 4, currentY + 6, { align: 'right' });

    currentY += rowHeight;
  });

  // 5. TOTALS SECTION
  currentY += 4;
  const totalsWidth = 84;
  const totalsX = margin + contentWidth - totalsWidth;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Items Subtotal:', totalsX, currentY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text(`NGN ${order.subtotal.toLocaleString()}`, margin + contentWidth - 4, currentY + 5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Nationwide Delivery:', totalsX, currentY + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text(`NGN ${order.delivery_fee.toLocaleString()}`, margin + contentWidth - 4, currentY + 11, { align: 'right' });

  // Grand Total Box (Deep Emerald with Gold Border)
  currentY += 16;
  doc.setFillColor(brandEmeraldDark[0], brandEmeraldDark[1], brandEmeraldDark[2]);
  doc.setDrawColor(brandGold[0], brandGold[1], brandGold[2]);
  doc.roundedRect(totalsX - 4, currentY, totalsWidth + 4, 11, 2, 2, 'FD');

  doc.setTextColor(brandGoldLight[0], brandGoldLight[1], brandGoldLight[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TOTAL PAID:', totalsX, currentY + 7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`NGN ${order.total_amount.toLocaleString()}`, margin + contentWidth - 4, currentY + 7.5, { align: 'right' });

  // 6. OFFICIAL VERIFICATION & TIMELINE SUMMARY
  currentY += 17;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, currentY, contentWidth, 23, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(brandEmeraldDark[0], brandEmeraldDark[1], brandEmeraldDark[2]);
  doc.text('OFFICIAL VERIFICATION & TRACKING TIMELINE', margin + 6, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(
    'SELLER CONFIRMED  >>  PACKAGING  >>  HANDED TO LOGISTICS  >>  IN TRANSIT  >>  OUT FOR DELIVERY  >>  DELIVERED',
    margin + 6,
    currentY + 12
  );

  doc.setFontSize(7.5);
  doc.setTextColor(brandEmeraldMid[0], brandEmeraldMid[1], brandEmeraldMid[2]);
  doc.text(
    `Official Stamp: Payment verified by HABEEBATUSSUNNAH. Current Stage: [${order.tracking_stage || 'SELLER CONFIRMED'}]`,
    margin + 6,
    currentY + 18.5
  );

  // 7. FOOTER
  const footerY = pageHeight - 12;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(
    `© ${new Date().getFullYear()} HABEEBATUSSUNNAH ONLINE BUSINESS. All rights reserved. Generated on ${new Date().toLocaleString()}`,
    margin,
    footerY
  );
  doc.text(
    `For tracking inquiries, contact WhatsApp: ${settings.whatsapp_number}`,
    pageWidth - margin,
    footerY,
    { align: 'right' }
  );

  // Save / trigger browser download
  doc.save(`Receipt_${order.id}.pdf`);
};
