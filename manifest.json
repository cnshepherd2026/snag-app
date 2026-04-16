const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let browser;
  try {
    const { html, filename } = req.body;
    if (!html) return res.status(400).json({ error: 'No HTML provided' });

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
      printBackground: true,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'snag-report.pdf'}"`);
    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'PDF generation failed', detail: err.message });
  } finally {
    if (browser) await browser.close();
  }
};
