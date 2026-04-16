module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { html, filename } = req.body;
    if (!html) return res.status(400).json({ error: 'No HTML provided' });

    const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('api:sk_94417961075b73b84c4dc45712dd031712995e3d').toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: html,
        format: 'A4',
        margin: '15mm',
        use_print: true
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error('PDFShift error: ' + err);
    }

    const pdfBuffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'snag-report.pdf'}"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'PDF generation failed', detail: err.message });
  }
};
