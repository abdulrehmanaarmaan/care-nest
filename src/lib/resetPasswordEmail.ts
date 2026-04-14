/**
 * Care Nest - Password Reset Email Template
 * Generates a secure password reset email.
 */

const sanitizeHtml = (str: string): string =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

export const resetPasswordEmail = (
  name: string,
  resetLink: string
): string => {
  const appName = "Care Nest";
  const safeName = sanitizeHtml(name);
  const safeLink = sanitizeHtml(resetLink);
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #f3f4f6;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: auto;
    background: #ffffff;
    padding: 30px;
    border-radius: 8px;
  }
  .btn {
    display: inline-block;
    background: #0d9488;
    color: #ffffff !important;
    padding: 12px 24px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
  }
  .footer {
    font-size: 12px;
    color: #6b7280;
    text-align: center;
    margin-top: 20px;
  }
</style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>Hello ${safeName},</p>
    <p>You requested to reset your password. Click the button below:</p>
    <p style="text-align:center;">
      <a href="${safeLink}" class="btn">Reset Password</a>
    </p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <div class="footer">
      © ${year} ${appName}. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
};