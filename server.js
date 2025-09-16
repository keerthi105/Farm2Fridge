require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

// Configure your email service credentials here
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/api/orders', (req, res) => {
    const { orderDetails, userEmail } = req.body;

    if (!orderDetails || !userEmail) {
        return res.status(400).json({ error: 'Missing order details or user email' });
    }

    // Compose email content
    let itemsList = '';
    orderDetails.items.forEach(item => {
        itemsList += `${item.emoji} ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Farm2Fridge Order Confirmation',
        text: `Thank you for your order!\n\nOrder Summary:\n${itemsList}\nTotal: ₹${orderDetails.total.toFixed(2)}\n\nDelivery Details:\nAddress: ${orderDetails.address}\nDate: ${orderDetails.date}\nTime Slot: ${orderDetails.slot}\nSubscription: ${orderDetails.subscription}\nPayment Method: ${orderDetails.payment === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}\n\nWe appreciate your business!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'Order confirmation email sent successfully' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
