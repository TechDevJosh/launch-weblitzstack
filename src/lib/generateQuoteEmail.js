import mjml2html from 'mjml';

// ✅ Accept 'featureListHtml' as a new parameter
export function generateQuoteEmail({
  heading,
  name,
  finalPackage,
  referralCode,
  consultationTime,
  featureListHtml,
}) {
  const twitterText = encodeURIComponent(
    'Get a transparent, instant quote for your website with WeblitzStack!'
  );

  let formattedBookingTime = '';
  if (consultationTime) {
    const date = new Date(consultationTime);
    formattedBookingTime = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Manila',
    });
  }

  const mjml = `
  <mjml>
    <mj-head>
      <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
      <mj-attributes>
        <mj-all font-family="Inter, sans-serif" />
        <mj-text color="#cbd5e1" font-size="16px" line-height="1.5" />
        <mj-table color="#cbd5e1" font-size="16px" />
      </mj-attributes>
      <mj-style>
        .wrapper { padding: 32px 16px; }
        .container { background-color: #1f2937; border: 1px solid #374151; border-radius: 16px; padding: 32px; }
        .referral-container { background-color: #1e1b4b; border: 1px solid #4c1d95; border-radius: 16px; padding: 24px; }
        .summary-label { color: #9ca3af; text-align: left; }
        .summary-value { color: #ffffff; font-weight: bold; text-align: right; }
        /* Style for the raw HTML list */
        ul { margin: 0; padding-left: 20px; color: #d1d5db; }
        li { padding-bottom: 8px; }
        p { margin: 0; padding: 0; color: #a5b4fc; }
      </mj-style>
    </mj-head>
    <mj-body background-color="#f3f4f6">
      <mj-wrapper css-class="wrapper">
        <mj-section css-class="container">
          <mj-column>

            <mj-image width="56px" height="56px" src="https://i.ibb.co/2W7y2y1/check-circle-green.png" alt="Success Checkmark" padding-bottom="24px" />
            <mj-text align="center" font-size="30px" font-weight="bold" color="#ffffff" padding-bottom="12px">${heading}</mj-text>
            <mj-text align="center" font-size="18px" padding-bottom="24px">Hi ${name},</mj-text>
            
            ${
              formattedBookingTime
                ? `
              <mj-section padding="0"><mj-column>
                <mj-text align="center" font-size="14px" color="#9ca3af" padding="0">Booking Schedule:</mj-text>
                <mj-text align="center" font-size="18px" font-weight="bold" color="#ffffff" padding-top="8px">${formattedBookingTime} (PHT)</mj-text>
              </mj-column></mj-section>
              <mj-divider border-width="1px" border-color="#374151" padding="24px 0" />
            `
                : '<mj-divider border-width="1px" border-color="#374151" padding="0 0 24px 0" />'
            }

            <mj-text align="center" padding-bottom="24px" color="#9ca3af">Here is a summary of your quote:</mj-text>
            
            <mj-table padding="0">
              <tr><td class="summary-label">Tier</td><td class="summary-value">${finalPackage.tier.name}</td></tr>
              <tr><td class="summary-label" style="padding-top:12px;">One-Time Setup Fee</td><td class="summary-value" style="padding-top:12px;">₱${finalPackage.totalSetupFee.toLocaleString()}</td></tr>
              <tr><td class="summary-label" style="padding-top:12px;">Monthly Fee</td><td class="summary-value" style="padding-top:12px;">₱${finalPackage.monthlyFee.toLocaleString()}/month</td></tr>
            </mj-table>
            
            <mj-divider border-width="1px" border-color="#374151" padding="24px 0" />
            
            <mj-text font-size="18px" font-weight="bold" color="#a5b4fc" padding-bottom="16px">Package Inclusions:</mj-text>
            <mj-raw>${featureListHtml}</mj-raw>
            
            <mj-section css-class="referral-container" padding-top="32px">
              <mj-column>
                <mj-text align="center" font-size="20px" font-weight="bold" color="#ffffff" padding-bottom="8px">Be a Helping Hand!</mj-text>
                <mj-text align="center" font-size="14px" color="#a5b4fc" padding-bottom="16px">Share this tool with friends or colleagues who might find it helpful.</mj-text>
                <mj-text align="center" font-size="12px" color="#a5b4fc" padding-bottom="8px">Your personal referral code is:</mj-text>
                <mj-text align="center" font-family="monospace" font-size="20px" font-weight="bold" letter-spacing="2px" color="#d1d5db" background-color="#111827" border="1px solid #374151" border-radius="8px" padding="12px">${referralCode}</mj-text>
                <mj-social font-size="15px" icon-size="24px" mode="horizontal" padding-top="20px">
                  <mj-social-element name="facebook" background-color="#1877F2" href="https://www.facebook.com/sharer/sharer.php?u=https://launch.weblitzstack.com"></mj-social-element>
                  <mj-social-element name="twitter" background-color="#1DA1F2" href="https://twitter.com/intent/tweet?url=https://launch.weblitzstack.com&text=${twitterText}"></mj-social-element>
                </mj-social>
              </mj-column>
            </mj-section>
            
            <mj-text align="center" font-size="14px" color="#9ca3af" padding-top="32px">Thanks,<br/>The WeblitzStack Team</mj-text>

          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-body>
  </mjml>
  `;

  const { html, errors } = mjml2html(mjml);
  if (errors && errors.length) {
    console.error('MJML errors:', errors);
  }
  return html;
}
