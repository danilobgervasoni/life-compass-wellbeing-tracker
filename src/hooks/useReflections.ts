
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Reflection {
  id: string;
  card_id: string;
  texto: string;
  data: string;
  created_at: string;
}

export const useReflections = (cardId?: string) => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('reflexoes')
        .select('*')
        .order('data', { ascending: false });

      if (cardId) {
        query = query.eq('card_id', cardId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Ensure dates are handled in local timezone
      const processedData = data?.map(item => ({
        ...item,
        data: new Date(item.data + 'T00:00:00').toISOString().split('T')[0]
      })) || [];

      setReflections(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const saveReflection = async (cardId: string, texto: string) => {
    try {
      // Use local timezone for date
      const today = new Date();
      const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('reflexoes')
        .insert({
          card_id: cardId,
          texto: texto,
          data: localDate
        })
        .select();

      if (error) throw error;

      await fetchReflections();
      return data;
    } catch (error) {
      console.error('Erro ao salvar reflexão:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchReflections();
  }, [cardId]);

  return { reflections, loading, error, saveReflection, refetch: fetchReflections };
};
