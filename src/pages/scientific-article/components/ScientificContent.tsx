
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HeaderSection } from './HeaderSection';
import { AbstractSection } from './AbstractSection';
import { IntroductionSection } from './IntroductionSection';
import { MethodologySection } from './MethodologySection';
import { ResultsSection } from './ResultsSection';
import { FiguresSection } from './FiguresSection';
import { DiscussionSection } from './DiscussionSection';
import { AdditionalSections } from './AdditionalSections';
import { ReferencesSection } from './ReferencesSection';
import { PhotosSection } from './PhotosSection';
import { PDFDownloadSection } from './PDFDownloadSection';

export function ScientificContent() {
  return (
    <Card className="prose prose-sm max-w-none">
      <CardContent className="p-8">
        <div className="space-y-8">
          <HeaderSection />
          <AbstractSection />
          
          <Separator />
          
          <IntroductionSection />
          <MethodologySection />
          <ResultsSection />
          
          <FiguresSection />
          <PhotosSection />
          
          <Separator />
          
          <DiscussionSection />
          <AdditionalSections />
          <ReferencesSection />
          
          <PDFDownloadSection />
        </div>
      </CardContent>
    </Card>
  );
}
