import { Resend } from 'resend';
import { generateQuoteEmail } from '../../src/lib/generateQuoteEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// This helper remains the same as it's used for the plain-text fallback
const generatePlainTextEmail = ({
  heading,
  name,
  finalPackage,
  consultationTime,
  referralCode,
  featureListText,
}) => {
  let text = `${heading}\n\nHi ${name},\n\n`;

  if (consultationTime) {
    const date = new Date(consultationTime);
    const formattedTime = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Manila',
    });
    text += `Booking Schedule: ${formattedTime} (PHT)\n\n`;
  }

  text += '--- Quote Summary ---\n';
  text += `Tier: ${finalPackage.tier.name}\n`;
  text += `One-Time Setup Fee: ₱${finalPackage.totalSetupFee.toLocaleString()}\n`;
  text += `Monthly Fee: ₱${finalPackage.monthlyFee.toLocaleString()}/month\n\n`;

  // Add the detailed feature list to the plain text version
  text += '--- Included Features & Add-ons ---\n';
  text += featureListText; // The detailed list is inserted here

  if (referralCode) {
    text += `\n\n--- Referral & Share ---\n`;
    text += `Your Referral Code: ${referralCode}\n`;
    text += `Share this link with friends: https://launch.weblitzstack.com\n`;
  }

  text += `\nThanks,\nThe WeblitzStack Team`;
  return text;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Only POST allowed');
  }

  const {
    fullName,
    email: clientEmail,
    finalPackage,
    referralCode,
    consultationTime,
  } = req.body;

  if (!fullName || !clientEmail || !finalPackage) {
    return res.status(400).json({ error: 'Missing required form data.' });
  }

  // --- NEW: Manual Feature List Generation ---
  let featureListHtml = '<ul>';
  let featureListText = '';
  const checkMark = '✓ ';

  // Manually define features based on the tier ID
  if (finalPackage.tier.id === 'standard') {
    const features = [
      '4 essential pages (Home, About, Services, Contact)',
      'CMS (admin panel) for easy updates',
      'Fully managed hosting & database',
      'Domain purchase & yearly renewal included',
      'Mobile responsive design',
      'Basic SEO (meta, alt text, slugs)',
      'HTTPS/SSL security & Google Analytics',
      'Free yearly refresh (minor updates)',
    ];
    features.forEach((f) => {
      featureListHtml += `<li>${checkMark}${f}</li>`;
      featureListText += `- ${f}\n`;
    });
  } else if (finalPackage.tier.id === 'plus') {
    const features = [
      '4 essential pages (Home, About, Services, Contact)',
      'CMS (admin panel) for easy updates',
      'Fully managed hosting & database',
      'Domain purchase & yearly renewal included',
      'Mobile responsive design',
      'Basic SEO (meta, alt text, slugs)',
      'HTTPS/SSL security & Google Analytics',
      'Free yearly refresh (minor updates)',
      'Up to 8 total pages',
      'Blog setup (CMS-enabled)',
      'Inquiry/booking forms',
      'Testimonials carousel / photo gallery',
      'WhatsApp or FB Messenger live chat',
      '1 monthly content upload & Priority support',
      'Quarterly performance reports',
    ];
    features.forEach((f) => {
      featureListHtml += `<li>${checkMark}${f}</li>`;
      featureListText += `- ${f}\n`;
    });
  } else if (finalPackage.tier.id === 'pro') {
    // This list is based on your "Pro Tier Features" screenshot
    const features = [
      '4 essential pages (Home, About, Services, Contact)',
      'CMS (admin panel) for easy updates',
      'Fully managed hosting & database',
      'Domain purchase & yearly renewal included',
      'Mobile responsive design',
      'Basic SEO (meta, alt text, slugs)',
      'HTTPS/SSL security & Google Analytics',
      'Free yearly refresh (minor updates)',
      'Up to 8 total pages',
      'Blog setup (CMS-enabled)',
      'Inquiry/booking forms',
      'Testimonials carousel / photo gallery',
      'WhatsApp or FB Messenger live chat',
      '1 monthly content upload & Priority support',
      'Quarterly performance reports',
      'AI chatbot (FAQ or contact assistant)',
      'Custom quote/survey forms',
      'Online payment gateway integration',
      'Advanced animations, custom UI polish',
      'SEO-ready content structure',
      'Social media feed integrations',
      'Up to 3 monthly content uploads',
      'Monthly SEO & analytics reports',
      'Admin training session for CMS',
    ];
    features.forEach((f) => {
      featureListHtml += `<li>${checkMark}${f}</li>`;
      featureListText += `- ${f}\n`;
    });
  }

  featureListHtml += '</ul>';

  // Manually add selected Add-ons to the list
  if (finalPackage.addOns && finalPackage.addOns.length > 0) {
    featureListHtml += '<br/><p><b>Selected Add-ons:</b></p><ul>';
    featureListText += '\nSelected Add-ons:\n';
    finalPackage.addOns.forEach((addon) => {
      featureListHtml += `<li>${checkMark}${addon.label}</li>`;
      featureListText += `- ${addon.label}\n`;
    });
    featureListHtml += '</ul>';
  }

  try {
    const commonHtmlPayload = {
      finalPackage,
      referralCode,
      consultationTime,
      featureListHtml, // Pass the generated HTML list
    };

    const commonTextPayload = {
      finalPackage,
      consultationTime,
      referralCode,
      featureListText, // Pass the generated text list
    };

    // 1. Send the notification email to the Admin
    await resend.emails.send({
      from: 'WeblitzStack <noreply.inquiries@weblitzstack.com>',
      to: 'josiah@weblitzstack.com',
      subject: `🚨 New Lead: ${fullName}`,
      html: generateQuoteEmail({
        ...commonHtmlPayload,
        heading: 'You Have a New Lead!',
        name: `Lead from: ${fullName}`,
      }),
      text: generatePlainTextEmail({
        ...commonTextPayload,
        heading: `New Lead: ${fullName}`,
        name: 'Josiah',
      }),
    });

    // 2. Send the confirmation email to the Client
    await resend.emails.send({
      from: 'WeblitzStack <noreply.inquiries@weblitzstack.com>',
      to: clientEmail,
      subject:
        '=?UTF-8?B?8J+OiCBZb3VyIFdlYnNpdGUgUXVvdGUgJiBDb25zdWx0YXRpb24gRGV0YWlscw==?=',
      html: generateQuoteEmail({
        ...commonHtmlPayload,
        heading: 'Consultation Booked!',
        name: fullName,
      }),
      text: generatePlainTextEmail({
        ...commonTextPayload,
        heading: 'Consultation Booked!',
        name: fullName,
      }),
    });

    res.status(200).json({ ok: true, message: 'Emails sent successfully.' });
  } catch (error) {
    console.error('[Resend] Email sending error:', error);
    res.status(500).json({ error: error.message });
  }
}
