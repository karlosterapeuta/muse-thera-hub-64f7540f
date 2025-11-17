import { useTranslation } from 'react-i18next';

export interface PhraseCategory {
  id: string;
  title: string;
  phrases: string[];
  icon: string;
}

export function useDevolutivaPhrases(): PhraseCategory[] {
  const { t } = useTranslation('phrases');
  
  const categories: PhraseCategory[] = [
    {
      id: 'arrival_state',
      title: t('categories.arrival_state.title'),
      icon: t('categories.arrival_state.icon'),
      phrases: t('arrival_state', { returnObjects: true }) as string[]
    },
    {
      id: 'communication',
      title: t('categories.communication.title'),
      icon: t('categories.communication.icon'),
      phrases: t('communication', { returnObjects: true }) as string[]
    },
    {
      id: 'emotional_regulation',
      title: t('categories.emotional_regulation.title'),
      icon: t('categories.emotional_regulation.icon'),
      phrases: t('emotional_regulation', { returnObjects: true }) as string[]
    },
    {
      id: 'motor_development',
      title: t('categories.motor_development.title'),
      icon: t('categories.motor_development.icon'),
      phrases: t('motor_development', { returnObjects: true }) as string[]
    },
    {
      id: 'sensory_aspects',
      title: t('categories.sensory_aspects.title'),
      icon: t('categories.sensory_aspects.icon'),
      phrases: t('sensory_aspects', { returnObjects: true }) as string[]
    },
    {
      id: 'musical_participation',
      title: t('categories.musical_participation.title'),
      icon: t('categories.musical_participation.icon'),
      phrases: t('musical_participation', { returnObjects: true }) as string[]
    },
    {
      id: 'achievements',
      title: t('categories.achievements.title'),
      icon: t('categories.achievements.icon'),
      phrases: t('achievements', { returnObjects: true }) as string[]
    },
    {
      id: 'family_guidelines',
      title: t('categories.family_guidelines.title'),
      icon: t('categories.family_guidelines.icon'),
      phrases: t('family_guidelines', { returnObjects: true }) as string[]
    },
    {
      id: 'next_steps',
      title: t('categories.next_steps.title'),
      icon: t('categories.next_steps.icon'),
      phrases: t('next_steps', { returnObjects: true }) as string[]
    },
    {
      id: 'general_observations',
      title: t('categories.general_observations.title'),
      icon: t('categories.general_observations.icon'),
      phrases: t('general_observations', { returnObjects: true }) as string[]
    },
    {
      id: 'challenges_resistance',
      title: t('categories.challenges_resistance.title'),
      icon: t('categories.challenges_resistance.icon'),
      phrases: t('challenges_resistance', { returnObjects: true }) as string[]
    }
  ];
  
  return categories;
}
