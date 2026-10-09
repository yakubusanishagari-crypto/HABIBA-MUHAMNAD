/**
 * Currency and WhatsApp helper utilities for Habeevatussunnah Online Business
 */

export const formatPrice = (amount: number): string => {
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
};

export const createWhatsAppOrderUrl = (
  whatsappNumber: string,
  orderId: string,
  customerName: string,
  totalAmount: number
): string => {
  // Clean phone number (e.g. +2348034343283 -> 2348034343283)
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const message = `Hello, I have made my payment for your product. Kindly confirm and get back to me.

Order ID: ${orderId}
Customer Name: ${customerName}
Amount: ${formatPrice(totalAmount)}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};

export const createGeneralWhatsAppUrl = (whatsappNumber: string, customText?: string): string => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const message = customText || 'Hello Habeevatussunnah Online Business, I would like to make an inquiry about your products.';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
};
