
-- Fix overly permissive insert policy on citadel_kills
DROP POLICY "System can insert kills" ON public.citadel_kills;
CREATE POLICY "Killers can log their own kills" ON public.citadel_kills FOR INSERT TO authenticated WITH CHECK (killer_id IN (SELECT id FROM public.citadel_players WHERE user_id = auth.uid()));
