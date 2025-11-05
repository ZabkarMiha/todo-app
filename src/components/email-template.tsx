import { EmailTemplateProps } from '@/lib/types';
import * as React from 'react';

export default function EmailTemplate({ username }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {username}!</h1>
    </div>
  );
}
