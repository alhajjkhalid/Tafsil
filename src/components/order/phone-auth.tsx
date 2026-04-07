'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store/auth-store';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function PhoneAuth() {
  const t = useTranslations('order');
  const { isAuthenticated, profile, setUser, setProfile } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleSendOtp = async () => {
    if (phone.length !== 9) {
      setError(t('invalidPhone'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Simulated OTP send
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpSent(true);
    } catch {
      setError(t('sendOtpError'));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) {
        value = value.slice(-1);
      }
      if (value && !/^\d$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError(t('invalidOtp'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Simulated OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Mock sign-in by setting a mock user
      setUser({
        id: `mock-${Date.now()}`,
        phone: `+966${phone}`,
      } as never);
      setProfile({
        id: `mock-${Date.now()}`,
        full_name: t('defaultName'),
        phone: `+966${phone}`,
      } as never);
    } catch {
      setError(t('verifyOtpError'));
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="bg-cream rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#C9A84C" strokeWidth="2" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-navy font-bold">
            {t('welcome')} {profile?.full_name || t('defaultName')}
          </span>
          <span className="text-navy/60 text-sm">{profile?.phone || ''}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream rounded-lg p-4 flex flex-col gap-4">
      <h3 className="text-lg font-arabic-display font-bold text-navy">
        {t('loginTitle')}
      </h3>

      {!otpSent ? (
        <>
          <div className="flex items-center gap-2">
            <span className="text-navy/60 font-medium text-sm bg-white rounded-lg px-3 py-3 border border-cream-dark">
              966+
            </span>
            <Input
              type="tel"
              maxLength={9}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder={t('phonePlaceholder')}
              dir="ltr"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            onClick={handleSendOtp}
            disabled={loading || phone.length !== 9}
            variant="primary"
            size="lg"
          >
            {loading ? <LoadingSpinner size="sm" /> : t('sendOtp')}
          </Button>
        </>
      ) : (
        <>
          <p className="text-navy/60 text-sm">
            {t('otpSentTo', { phone: `+966${phone}` })}
          </p>

          <div className="flex gap-2 justify-center" dir="ltr">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold rounded-lg border border-cream-dark focus:border-gold focus:outline-none text-navy bg-white"
              />
            ))}
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <Button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            variant="primary"
            size="lg"
          >
            {loading ? <LoadingSpinner size="sm" /> : t('verify')}
          </Button>

          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtp(['', '', '', '', '', '']);
              setError('');
            }}
            className="text-gold text-sm font-medium underline text-center cursor-pointer"
          >
            {t('changePhone')}
          </button>
        </>
      )}
    </div>
  );
}
