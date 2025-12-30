import React from 'react';
import { PremiumCard } from '@/components/PremiumCard';

export default function UsersPage() {
  return (
    <div className="p-6">
      <PremiumCard>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🚧</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Funcionalidad en Desarrollo</h1>
          <p className="text-slate-500">Este módulo estará disponible en la Fase E de producción.</p>
        </div>
      </PremiumCard>
    </div>
  );
}

