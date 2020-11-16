import React, { useCallback, useState } from 'react';
import { verifyOtp } from './api';
import Input from './Input';

export default function OneTimePassword({ enabled }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [invalidCode, setInvalidCode] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const result = await verifyOtp(verificationCode);

      if (result) return (window.location = '/');

      setInvalidCode(true);
    },
    [verificationCode]
  );

  return (
    <div>
      {!enabled && (
        <div>
          <p>Scan the QR code on your authenticator app</p>
          <img src="/mfa_qr_code" />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          id="verificationCode"
          label="Verification code"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />

        <button type="submit">Confirm</button>

        {invalidCode && <p>Invalid verification code</p>}
      </form>
    </div>
  );
}
