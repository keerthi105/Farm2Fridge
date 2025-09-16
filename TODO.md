# Farm2Fridge Backend Setup for Order Confirmation Emails

## Completed Tasks
- [x] Created `server.js` with Express server and Nodemailer integration
- [x] Created `package.json` with required dependencies
- [x] Modified `script.js` to send order data to backend via fetch API

## Remaining Tasks
- [ ] Configure email credentials in `server.js`:
  - Replace 'your-email@gmail.com' with your Gmail address
  - Replace 'your-app-password' with your Gmail app password (generate from Google Account settings)
- [ ] Install Node.js dependencies: Run `npm install`
- [ ] Start the backend server: Run `npm start`
- [ ] Test the functionality:
  - Open `home.html` in browser
  - Register/login a user
  - Add items to cart and checkout
  - Confirm order to trigger email sending
- [ ] Verify email is received in user's inbox

## Notes
- The backend runs on port 3001
- Frontend sends POST request to `http://localhost:3001/api/orders`
- If deploying to production, update the fetch URL in `script.js`
- For Gmail SMTP, ensure "Less secure app access" is enabled or use app password
