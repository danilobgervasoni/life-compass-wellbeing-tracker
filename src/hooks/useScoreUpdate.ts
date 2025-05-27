
import { supabase } from '@/integrations/supabase/client';

export const useScoreUpdate = () => {
  const updateScore = async (cardId: string, newScore: number, notes?: string) => {
    try {
      // Use local timezone for date
      const today = new Date();
      const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('notas')
        .upsert({
          card_id: cardId,
          nota: newScore,
          data: localDate,
          anotacao: notes || ''
        }, {
          onConflict: 'card_id,data'
        })
        .select();

      if (error) throw error;

      console.log('Pontuação salva com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
      throw error;
    }
  };

  return { updateScore };
};
