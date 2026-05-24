import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const userName = name || "Founder";

  const mailOptions = {
    from: `"AutoThinker X" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your 2026 AfCFTA Cross-Border Expansion Checklist",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Inter', sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: bold; color: #f97316; letter-spacing: -1px; }
          .hero { background: linear-gradient(135deg, #171717 0%, #0a0a0a 100%); border: 1px solid #262626; border-radius: 24px; padding: 40px; margin-bottom: 30px; }
          .title { font-size: 14px; font-weight: bold; color: #f97316; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
          .headline { font-size: 28px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; }
          .subtitle { color: #a3a3a3; font-size: 16px; line-height: 1.5; }
          .phase { margin-bottom: 32px; padding-left: 20px; border-left: 2px solid #262626; }
          .phase-title { font-size: 12px; font-weight: bold; color: #f97316; text-transform: uppercase; margin-bottom: 8px; }
          .phase-header { font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #e5e5e5; }
          .list { list-style: none; padding: 0; margin: 0; }
          .list-item { color: #a3a3a3; font-size: 14px; line-height: 1.6; margin-bottom: 10px; display: flex; align-items: flex-start; }
          .list-item::before { content: "•"; color: #f97316; font-weight: bold; margin-right: 12px; }
          .cta-box { background-color: #f97316; border-radius: 16px; padding: 24px; text-align: center; margin-top: 40px; }
          .cta-text { color: #000000; font-weight: bold; margin-bottom: 16px; }
          .footer { text-align: center; font-size: 12px; color: #525252; margin-top: 40px; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">AUTOTHINKER X</div>
          </div>
          
          <div class="hero">
            <div class="title">Lead Magnet</div>
            <div class="headline">The 2026 AfCFTA Cross-Border Expansion Checklist</div>
            <div class="subtitle">A Founder’s Strategic Framework for Scaling Across African Trade Ecosystems</div>
          </div>

          <p style="color: #a3a3a3; font-size: 15px;">Hello ${userName},</p>
          <p style="color: #a3a3a3; font-size: 15px; margin-bottom: 40px;">Your path to pan-African scale starts here. Below is the framework for your cross-border expansion.</p>

          <div class="phase">
            <div class="phase-title">Phase 1</div>
            <div class="phase-header">Regional Priority Market Selection</div>
            <div class="list">
              <div class="list-item">Target Priority Sectors: Fintech, E-commerce, Logistics, Agri-tech, Manufacturing, or Digital Platforms.</div>
              <div class="list-item">Tariff & Barrier Mapping: Check active expansion countries via the AfCFTA Guided Trade Initiative (GTI) portal.</div>
              <div class="list-item">Currency Risk Mitigation: Plan integrations with pan-African payment rails like PAPSS.</div>
            </div>
          </div>

          <div class="phase">
            <div class="phase-title">Phase 2</div>
            <div class="phase-header">Cross-Border Regulatory & Data Compliance</div>
            <div class="list">
              <div class="list-item">Data Sovereignty Audit: Ensure Firebase database rules align with local laws like NDPR.</div>
              <div class="list-item">Inter-Regional IP Protection: File international trademarks with ARIPO or OAPI.</div>
              <div class="list-item">Cross-Border Terms of Service: Build multi-jurisdictional terms for consumer data rights.</div>
            </div>
          </div>

          <div class="phase">
            <div class="phase-title">Phase 3</div>
            <div class="phase-header">Institutional & Accelerator Ecosystem Integration</div>
            <div class="list">
              <div class="list-item">White-Label Strategy (The Foundry Framework): Offer white-labeled access to regional hubs.</div>
              <div class="list-item">Cross-Continental Corridors: Bridge connections with the Korea Africa Foundation (KAF).</div>
            </div>
          </div>

          <div class="phase" style="border-left-color: #f97316;">
            <div class="phase-title">Phase 4</div>
            <div class="phase-header">Automating Your Time-to-Market</div>
            <div class="list">
              <div class="list-item">Dynamic Venture Architecture: Join the AutoThinker X waitlist to access our sequential Multi-Agent AI system this June and turn ideas into blueprints in 10 minutes.</div>
            </div>
          </div>

          <div class="cta-box">
            <div class="cta-text">Turn your vision into a blueprint today.</div>
            <a href="https://autothinker-x.vercel.app" style="background-color: #000000; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Explore AutoThinker X</a>
          </div>

          <div class="footer">
            &copy; 2026 AutoThinker X. Accelerating African Innovation.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
