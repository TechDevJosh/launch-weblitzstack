import { Resend } from 'resend';
import { generateQuoteEmail } from '../../src/lib/generateQuoteEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ UPDATED: The TIER_FEATURES map now includes the 'enterprise' tier.
const TIER_FEATURES = {
  standard: [
    '4 essential pages (Home, About, Services, Contact)',
    'CMS (admin panel) for easy updates',
    'Fully managed hosting & database',
    'Domain purchase & yearly renewal included',
    'Mobile responsive design',
    'Basic SEO (meta, alt text, slugs)',
    'HTTPS/SSL security & Google Analytics',
    'Free yearly refresh (minor updates)',
  ],
  plus: [
    'All features from Standard Tier',
    'Up to 8 total pages',
    'Blog setup (CMS-enabled)',
    'Inquiry/booking forms',
    'Testimonials carousel / photo gallery',
    'WhatsApp or FB Messenger live chat',
    '1 monthly content upload & Priority support',
    'Quarterly performance reports',
  ],
  pro: [
    'All features from Plus Tier',
    'AI chatbot (FAQ or contact assistant)',
    'Custom quote/survey forms',
    'Online payment gateway integration',
    'Advanced animations, custom UI polish',
    'SEO-ready content structure',
    'Social media feed integrations',
    'Up to 3 monthly content uploads',
    'Monthly SEO & analytics reports',
    'Admin training session for CMS',
  ],
  enterprise: [
    'Fully customized solution',
    'Hotel/resort booking engines',
    'Full-scale e-commerce',
    'Franchise / multi-branch structures',
    'Custom dashboard or admin portal',
    'Multi-language support',
    'API integrations & automation workflows',
    'Dedicated support & consultation',
  ],
};

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

  // Conditionally show price summary for non-enterprise tiers
  if (finalPackage.tier.id !== 'enterprise') {
    text += '--- Quote Summary ---\n';
    text += `Tier: ${finalPackage.tier.name}\n`;
    text += `One-Time Setup Fee: ₱${finalPackage.totalSetupFee.toLocaleString()}\n`;
    text += `Monthly Fee: ₱${finalPackage.monthlyFee.toLocaleString()}/month\n\n`;
  }

  text += '--- Package Inclusions ---\n';
  text += featureListText;

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

  let tierId;
  if (
    typeof finalPackage.tier === 'object' &&
    finalPackage.tier !== null &&
    finalPackage.tier.id
  ) {
    tierId = finalPackage.tier.id;
  } else {
    tierId = finalPackage.tier;
  }

  const featuresForTier = TIER_FEATURES[tierId] || [];

  let featureListHtml = '<ul>';
  let featureListText = '';
  const checkMark = '✓ ';

  featuresForTier.forEach((f) => {
    featureListHtml += `<li>${checkMark}${f}</li>`;
    featureListText += `- ${f}\n`;
  });

  featureListHtml += '</ul>';

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
      featureListHtml,
    };
    const commonTextPayload = {
      finalPackage,
      consultationTime,
      referralCode,
      featureListText,
    };

    // Use a different subject for enterprise leads to make them stand out
    const adminSubject =
      tierId === 'enterprise'
        ? `⭐ New Enterprise Lead: ${fullName}`
        : `🚨 New Lead: ${fullName}`;

    // 1. Send the notification email to the Admin
    await resend.emails.send({
      from: 'WeblitzStack <noreply.inquiries@weblitzstack.com>',
      to: 'josiah@weblitzstack.com',
      subject: adminSubject,
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
