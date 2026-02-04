'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { X, Phone, ArrowRight, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'phone' | 'otp';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  function formatPhoneInput(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  function handlePhoneChange(value: string) {
    const formatted = formatPhoneInput(value);
    setPhone(formatted);
    setError('');
  }

  async function handleSendOTP() {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      setError('Digite um telefone valido com DDD');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao enviar codigo');
        return;
      }

      setFormattedPhone(data.phone);
      setStep('otp');
    } catch {
      setError('Erro de conexao. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) value = value[value.length - 1];
    if (value && !/\d/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus proximo campo
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit quando completar
    if (value && index === 5) {
      const code = newOtp.join('');
      if (code.length === 6) {
        handleVerifyOTP(code);
      }
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      handleVerifyOTP(pasted);
    }
  }

  async function handleVerifyOTP(code: string) {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Codigo invalido');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
        return;
      }

      // Sign in no NextAuth client-side
      await signIn('phone-otp', {
        phone: formattedPhone,
        redirect: false,
      });

      // Fechar modal e recarregar para atualizar session
      onClose();
      window.location.reload();
    } catch {
      setError('Erro de conexao. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setStep('phone');
    setPhone('');
    setOtp(['', '', '', '', '', '']);
    setError('');
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {step === 'phone' ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="text-primary-600" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Entrar</h2>
              <p className="text-gray-500 mt-2">
                Digite seu WhatsApp para receber o codigo
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone com DDD
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(12) 99999-9999"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendOTP();
                  }}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                onClick={handleSendOTP}
                disabled={loading || phone.replace(/\D/g, '').length < 10}
                className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white font-semibold py-3 rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Enviar codigo
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Codigo de verificacao
              </h2>
              <p className="text-gray-500 mt-2">
                Enviamos um SMS para{' '}
                <span className="font-medium text-gray-700">{phone}</span>
              </p>
            </div>

            <div className="space-y-4">
              {/* OTP inputs */}
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {loading && (
                <div className="flex justify-center">
                  <Loader2 size={24} className="animate-spin text-primary-500" />
                </div>
              )}

              <button
                onClick={() => {
                  setStep('phone');
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                }}
                className="w-full text-center text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                Trocar numero
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
