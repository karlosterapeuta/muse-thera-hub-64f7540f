import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';

interface ValidationSummaryProps {
  errors: string[];
  isValid: boolean;
  className?: string;
}

export function ValidationSummary({ errors, isValid, className = "" }: ValidationSummaryProps) {
  const { t } = useTranslation('musicotherapy');

  if (isValid) {
    return (
      <Alert className={`border-green-200 bg-green-50 text-green-800 ${className}`}>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          {t('form.validation.allFieldsFilled')}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="font-medium mb-1">{t('form.validation.missingFields')}</div>
        <ul className="list-disc list-inside space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="text-sm">{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}