require('dotenv').config();
const { sendVerificationEmail } = require('./utils/sendEmail');

const testNewVerificationEmail = async () => {
  const recipient = 'nazmul.rahul03@gmail.com';
  console.log(`Testing new verification email template for: ${recipient}...`);
  
  try {
    await sendVerificationEmail({
      to: recipient,
      username: 'Nazmul Rahul',
      verificationLink: 'http://localhost:5173/verify-email/test-token-123'
    });
    console.log('✅ New verification email sent successfully! Please check your gmail inbox.');
  } catch (error) {
    console.error('❌ Failed to send verification email:');
    console.error(error);
  }
};

testNewVerificationEmail();
