'use client';

import { useState } from 'react';
import IdeaForm from '@/components/IdeaForm';
import StrategyMap from '@/components/StrategyMap';
import { IdeaInput, StartupPlan } from '@/lib/types';

export default function IdeaGenerator() {
  const [plan, setPlan] = useState<StartupPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async (input: IdeaInput) => {
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      setPlan(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <section className={plan ? 'hidden md:block opacity-80' : ''}>
         <IdeaForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
      </section>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md text-center max-w-2xl mx-auto">
           {error}
        </div>
      )}

      {plan && (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Your Execution Strategy</h2>
              <div className="flex gap-4 items-center">
                {plan.projectId && (
                  <a 
                    href={`/project/${plan.projectId}`} 
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View Saved Project
                  </a>
                )}
                <button 
                  onClick={() => { setPlan(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-sm text-muted-foreground hover:text-primary underline"
                >
                  Start Over
                </button>
              </div>
           </div>
           <StrategyMap plan={plan} />
        </section>
      )}
    </div>
  );
}
