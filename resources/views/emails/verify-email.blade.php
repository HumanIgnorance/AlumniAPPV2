<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email - OCC Alumni Association</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; border-bottom: 3px solid #1a1a2e; padding-bottom: 20px; margin-bottom: 30px;">
            <img src="{{ $message->embed(resource_path('js/assets/images/OCC_LOGO.png')) }}" alt="OCC Logo" style="max-width: 120px; height: auto; margin-bottom: 15px;">
            <h1 style="color: #1a1a2e; margin: 0; font-size: 24px;">Verify Your Email</h1>
            <p style="color: #666; margin: 5px 0 0;">Opol Community College Alumni Association</p>
        </div>

        <div style="margin-bottom: 30px;">
            <h2 style="color: #1a1a2e; font-size: 20px; margin-bottom: 15px;">Hello {{ $fullName }},</h2>

            <p>Thank you for registering with the OCC Alumni Tracing Management System. Please confirm that this email address is yours by clicking the button below, or by typing the 6-digit code into the ATMS app.</p>

            @if (!empty($code))
            <div style="text-align: center; margin: 25px 0 5px;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #666;">Your verification code</p>
                <div style="display: inline-block; background-color: #f1f4fb; border: 1px solid #cdd6ee; border-radius: 12px; padding: 14px 28px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e; font-family: 'Courier New', monospace;">{{ $code }}</div>
            </div>
            @endif

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $verifyUrl }}" style="display: inline-block; background-color: #1a1a2e; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Verify My Email</a>
            </div>

            <div style="background-color: #fff8d8; border-left: 4px solid #e0b100; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <strong>⏳ Link Expiration</strong>
                <p style="margin: 10px 0 0; font-size: 14px;">This link and code expire in <strong>60 minutes</strong>. If they expire, open the ATMS login page and request a new one.</p>
            </div>

            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1a1a2e; font-size: 16px; margin: 0 0 15px; border-bottom: 1px solid #dee2e6; padding-bottom: 10px;">Button not working?</h3>
                <p style="font-size: 13px; margin-bottom: 10px;">Copy and paste the link below into your browser:</p>
                <div style="background-color: #e8f4fd; padding: 12px; border-radius: 4px; word-break: break-all;">
                    <a href="{{ $verifyUrl }}" style="color: #1a1a2e; text-decoration: none; font-size: 13px;">{{ $verifyUrl }}</a>
                </div>
            </div>

            <p style="font-size: 14px;">After your email is verified, your registration still needs to be approved by the administrator. You will receive another email once that is done.</p>

            <div style="background-color: #fff8d8; border-left: 4px solid #e0b100; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <strong>🔒 Security Notice</strong>
                <p style="margin: 10px 0 0; font-size: 14px;">If you did not register for an ATMS account, please ignore this email. No account access is granted until the address is verified.</p>
            </div>
        </div>

        <div style="text-align: center; border-top: 1px solid #dee2e6; padding-top: 20px; color: #666; font-size: 14px;">
            <p style="margin: 5px 0;"><strong>Opol Community College Alumni Association</strong></p>
            <p style="margin: 5px 0;">This is an automated message. Please do not reply directly to this email.</p>
            <p style="margin: 5px 0;">&copy; {{ date('Y') }} Opol Community College. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
