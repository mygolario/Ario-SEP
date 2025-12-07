'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { IdeaInput } from '@/lib/types';

interface IdeaFormProps {
  onSubmit: (data: IdeaInput) => void;
  isLoading: boolean;
}

export default function IdeaForm({ onSubmit, isLoading }: IdeaFormProps) {
  const [formData, setFormData] = useState<IdeaInput>({
    ideaTitle: '',
    ideaDescription: '',
    targetAudience: '',
    budgetLevel: 'low',
    experienceLevel: 'beginner',
    timePerWeek: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof IdeaInput, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Describe Your Startup Idea</CardTitle>
        <CardDescription>
          Fill in the details below to generate your personalized execution strategy.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ideaTitle">Idea Title / Name</Label>
            <Input
              id="ideaTitle"
              name="ideaTitle"
              placeholder="e.g. Uber for Dog Walking"
              required
              value={formData.ideaTitle}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ideaDescription">Description</Label>
            <Textarea
              id="ideaDescription"
              name="ideaDescription"
              placeholder="What problem does it solve and how?"
              required
              className="min-h-[100px]"
              value={formData.ideaDescription}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              placeholder="Who are your customers?"
              required
              value={formData.targetAudience}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetLevel">Budget Level</Label>
              <Select
                name="budgetLevel"
                value={formData.budgetLevel}
                onValueChange={(val) => handleSelectChange('budgetLevel', val)}
              >
                <SelectTrigger id="budgetLevel">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Bootstrapped)</SelectItem>
                  <SelectItem value="medium">Medium (Some Savings/Seed)</SelectItem>
                  <SelectItem value="high">High (Funded)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                name="experienceLevel"
                value={formData.experienceLevel}
                onValueChange={(val) => handleSelectChange('experienceLevel', val)}
              >
                <SelectTrigger id="experienceLevel">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timePerWeek">Time Commitment (Hours/Week)</Label>
            <Input
              id="timePerWeek"
              name="timePerWeek"
              type="number"
              placeholder="e.g. 20"
              value={formData.timePerWeek || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  timePerWeek: e.target.value ? parseInt(e.target.value) : undefined,
                }))
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating Plan...' : 'Generate Strategy Map'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
