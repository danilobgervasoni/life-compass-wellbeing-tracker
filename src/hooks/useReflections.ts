
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Reflection {
  id: string;
  text: string;
  date: string;
  pillarId: string;
  pillarName: string;
  pillarIcon: string;
  pillarColor: string;
}

export const useReflections = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      
      // Get today's date in local timezone
      const today = new Date();
      const localToday = today.toISOString().split('T')[0];

      // CORRIGIDO: Buscar apenas reflexões da tabela reflexoes para evitar duplicações
      const { data: reflexoesData, error: reflexoesError } = await supabase
        .from('reflexoes')
        .select(`
          id,
          texto,
          data,
          card_id,
          cards (
            nome,
            icone,
            categoria
          )
        `)
        .lte('data', localToday)
        .order('data', { ascending: false });

      if (reflexoesError) throw reflexoesError;

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

      // CORRIGIDO: Apenas reflexões da tabela reflexoes - sem duplicações
      const formattedReflections: Reflection[] = reflexoesData?.map(item => ({
        id: item.id,
        text: item.texto,
        date: item.data,
        pillarId: item.card_id,
        pillarName: item.cards?.nome || 'Pilar Desconhecido',
        pillarIcon: item.cards?.icone || '❤️',
        pillarColor: getColorByCategory(item.cards?.categoria || '')
      })) || [];

      // Sort by date descending
      formattedReflections.sort((a, b) => b.date.localeCompare(a.date));

      setReflections(formattedReflections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const saveReflection = async (pillarId: string, text: string, specificDate?: string) => {
    try {
      // Use the specific date if provided, otherwise use today's date
      const today = new Date();
      const targetDate = specificDate || today.toISOString().split('T')[0];

      const { error } = await supabase
        .from('reflexoes')
        .insert({
          card_id: pillarId,
          texto: text,
          data: targetDate
        });

      if (error) throw error;
      
      // Refresh reflections after saving
      await fetchReflections();
    } catch (error) {
      console.error('Erro ao salvar reflexão:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchReflections();
  }, []);

  return { 
    reflections, 
    loading, 
    error, 
    refetch: fetchReflections, 
    saveReflection 
  };
};
