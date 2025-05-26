
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DiaryEntry {
  id: string;
  card_id: string;
  reflexao_geral: string;
  plano_acao: string;
  data: string;
  created_at: string;
  updated_at: string;
}

export const useDiary = (cardId?: string) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('diario')
        .select('*')
        .order('data', { ascending: false });

      if (cardId) {
        query = query.eq('card_id', cardId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setEntries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async (cardId: string, reflexaoGeral: string, planoAcao: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('diario')
        .upsert({
          card_id: cardId,
          reflexao_geral: reflexaoGeral,
          plano_acao: planoAcao,
          data: today
        }, {
          onConflict: 'card_id,data'
        })
        .select();

      if (error) throw error;

      await fetchEntries();
      return data;
    } catch (error) {
      console.error('Erro ao salvar entrada do diário:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [cardId]);

  return { entries, loading, error, saveEntry, refetch: fetchEntries };
};
