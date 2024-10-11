const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

export default async (req, res) => {
    const { name, email, message } = req.body;

    const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY,
    });

    mg.messages.create('sandbox-123.mailgun.org', {
        from: `${name} <mailgun@${process.env.MAILGUN_DOMAIN}>`,
        replyTo: email,
        to: [process.env.EMAIL],
        subject: `${name} wants an awesome Web3 Game!`,
        text: message,
        html: `
  <html>
    <body>
      <h2>New Web3 Game Request</h2>
      <p>You have received a new message from:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr />
      <p>Thanks for your attention!</p>
    </body>
  </html>
`
    }).then(msg => {
        console.log(msg);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Failed to send email.', error: err.message });
        });
};