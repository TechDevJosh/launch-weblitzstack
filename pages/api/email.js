import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { email, fullName, quoteSummary } = req.body;

  await resend.emails.send({
    from: 'josiah@weblitzstack.com',
    to: email,
    subject: 'Your Website Quote from WeblitzStack',
    html: `<strong>Hi ${fullName}</strong><br/>Here’s your quote: ${quoteSummary}`,
  });

  res.status(200).json({ status: 'sent' });
}
