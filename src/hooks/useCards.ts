import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Pillar } from '@/types/pillar';

export const useCards = () => {
  const [cards, setCards] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: true });

      if (cardsError) throw cardsError;

      // Get today's date in local timezone
      const today = new Date();
      const localToday = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      const cardsWithEntries: Pillar[] = await Promise.all(
        cardsData.map(async (card) => {
          const { data: notasData, error: notasError } = await supabase
            .from('notas')
            .select('*')
            .eq('card_id', card.id)
            .lte('data', localToday) // Only get entries up to today
            .order('data', { ascending: true });

          if (notasError) {
            console.error('Erro ao buscar notas:', notasError);
          }

          const entries = notasData?.map(nota => {
            const localDate = new Date(nota.data + 'T00:00:00');
            return {
              date: localDate.toISOString().split('T')[0],
              score: nota.nota,
              notes: nota.anotacao || ''
            };
          }) || [];

          const currentScore = entries.length > 0 ? entries[entries.length - 1].score : 0;

          let trend: 'up' | 'down' | 'stable' = 'stable';
          if (entries.length >= 2) {
            const lastScore = entries[entries.length - 1].score;
            const previousScore = entries[entries.length - 2].score;
            if (lastScore > previousScore) trend = 'up';
            else if (lastScore < previousScore) trend = 'down';
          }

          return {
            id: card.id,
            name: card.nome,
            icon: card.icone,
            color: getColorByCategory(card.categoria),
            description: getDescriptionByCategory(card.categoria),
            currentScore,
            trend,
            entries
          };
        })
      );

      setCards(cardsWithEntries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const cleanupFutureEntries = async () => {
    try {
      const today = new Date();
      const localToday = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      // Delete future entries from notas
      await supabase
        .from('notas')
        .delete()
        .gt('data', localToday);

      // Delete future entries from reflexoes
      await supabase
        .from('reflexoes')
        .delete()
        .gt('data', localToday);

      console.log('Limpeza de dados futuros concluída');
    } catch (error) {
      console.error('Erro ao limpar dados futuros:', error);
    }
  };

  useEffect(() => {
    cleanupFutureEntries().then(() => {
      fetchCards();
    });
  }, []);

  return { cards, loading, error, refetch: fetchCards };
};

const getColorByCategory = (categoria: string) => {
  const colorMap: Record<string, string> = {
    'financeiro': 'from-emerald-500 to-emerald-600',
    'espiritual': 'from-purple-500 to-purple-600',
    'produtividade': 'from-blue-500 to-blue-600',
    'social': 'from-pink-500 to-pink-600',
    'educacao': 'from-indigo-500 to-indigo-600',
    'saude': 'from-green-500 to-green-600'
  };
  return colorMap[categoria] || 'from-sage-500 to-sage-600';
};

const getDescriptionByCategory = (categoria: string) => {
  const descriptionMap: Record<string, string> = {
    'financeiro': 'Gerencie sua vida financeira e investimentos',
    'espiritual': 'Cultive sua conexão espiritual e paz interior',
    'produtividade': 'Organize seu tempo e aumente sua eficiência',
    'social': 'Fortaleça seus relacionamentos e conexões',
    'educacao': 'Desenvolva conhecimentos e habilidades',
    'saude': 'Cuide do seu bem-estar físico e mental'
  };
  return descriptionMap[categoria] || 'Desenvolva este aspecto da sua vida';
};
