
import { supabase } from '@/integrations/supabase/client';

export const useScoreUpdate = () => {
  const updateScore = async (pillarId: string, score: number, notes?: string, specificDate?: string) => {
    try {
      // Use the specific date if provided, otherwise use today's date
      const today = new Date();
      const targetDate = specificDate || new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      console.log('Updating score for pillar:', pillarId, 'date:', targetDate, 'score:', score);

      // Check if there's already an entry for this pillar and date
      const { data: existingEntry, error: fetchError } = await supabase
        .from('notas')
        .select('*')
        .eq('card_id', pillarId)
        .eq('data', targetDate)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing entry:', fetchError);
        throw fetchError;
      }

      if (existingEntry) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('notas')
          .update({
            nota: score,
            anotacao: notes || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEntry.id);

        if (updateError) {
          console.error('Error updating score:', updateError);
          throw updateError;
        }

        console.log('Score updated successfully for existing entry');
      } else {
        // Insert new entry
        const { error: insertError } = await supabase
          .from('notas')
          .insert({
            card_id: pillarId,
            data: targetDate,
            nota: score,
            anotacao: notes || null
          });

        if (insertError) {
          console.error('Error inserting score:', insertError);
          throw insertError;
        }

        console.log('New score entry created successfully');
      }
    } catch (error) {
      console.error('Error in updateScore:', error);
      throw error;
    }
  };

  return { updateScore };
};
