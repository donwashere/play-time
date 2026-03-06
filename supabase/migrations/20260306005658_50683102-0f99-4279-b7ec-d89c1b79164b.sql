
-- Citadel player profiles
CREATE TABLE public.citadel_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Commander',
  chips INTEGER NOT NULL DEFAULT 0,
  credits INTEGER NOT NULL DEFAULT 100,
  has_floppy_id BOOLEAN NOT NULL DEFAULT false,
  current_district TEXT NOT NULL DEFAULT 'hq',
  pos_x FLOAT NOT NULL DEFAULT 0,
  pos_y FLOAT NOT NULL DEFAULT 0,
  is_alive BOOLEAN NOT NULL DEFAULT true,
  job TEXT,
  job_earnings INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Player inventory
CREATE TABLE public.citadel_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.citadel_players(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Market listings
CREATE TABLE public.citadel_market (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.citadel_players(id) ON DELETE SET NULL,
  item_type TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  is_npc_shop BOOLEAN NOT NULL DEFAULT false,
  shop_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Race results
CREATE TABLE public.citadel_races (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.citadel_players(id) ON DELETE CASCADE,
  race_time FLOAT NOT NULL,
  wager_amount INTEGER NOT NULL DEFAULT 0,
  won BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Kill log (for PvP loot tracking)
CREATE TABLE public.citadel_kills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  killer_id UUID NOT NULL REFERENCES public.citadel_players(id) ON DELETE CASCADE,
  victim_id UUID NOT NULL REFERENCES public.citadel_players(id) ON DELETE CASCADE,
  loot_chips INTEGER NOT NULL DEFAULT 0,
  district TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.citadel_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citadel_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citadel_market ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citadel_races ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citadel_kills ENABLE ROW LEVEL SECURITY;

-- RLS policies for citadel_players
CREATE POLICY "Players can view all players" ON public.citadel_players FOR SELECT TO authenticated USING (true);
CREATE POLICY "Players can insert their own profile" ON public.citadel_players FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Players can update their own profile" ON public.citadel_players FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- RLS policies for citadel_inventory
CREATE POLICY "Players can view their own inventory" ON public.citadel_inventory FOR SELECT TO authenticated USING (player_id IN (SELECT id FROM public.citadel_players WHERE user_id = auth.uid()));
CREATE POLICY "Players can insert into their own inventory" ON public.citadel_inventory FOR INSERT TO authenticated WITH CHECK (player_id IN (SELECT id FROM public.citadel_players WHERE user_id = auth.uid()));
CREATE POLICY "Players can update their own inventory" ON public.citadel_inventory FOR UPDATE TO authenticated USING (player_id IN (SELECT id FROM public.citadel_players WHERE user_id = auth.uid()));
CREATE POLICY "Players can delete from their own inventory" ON public.citadel_inventory FOR DELETE TO authenticated USING (player_id IN (SELECT id FROM public.citadel_players WHERE user_id = auth.uid()));

-- RLS policies for citadel_market
CREATE POLICY "Anyone can view market listings" ON public.citadel_market FOR SELECT TO authenticated USING (true);
CREATE POLICY "Players can create their own listings" ON public.citadel_market FOR INSERT TO authenticated WITH CHECK (seller_id IN (SELECT id FROM public.citadel_players WHERE user_id = auth.uid()) OR is_npc_shop = true);
CREATE POLICY "Players can delete their own listings" ON public.citadel_market FOR DELETE TO authenticated USING (seller_id IN (SELECT id FROM public.citadel_players WHERE user_id = auth.uid()));

-- RLS policies for citadel_races
CREATE POLICY "Anyone can view races" ON public.citadel_races FOR SELECT TO authenticated USING (true);
CREATE POLICY "Players can insert their own races" ON public.citadel_races FOR INSERT TO authenticated WITH CHECK (player_id IN (SELECT id FROM public.citadel_players WHERE user_id = auth.uid()));

-- RLS policies for citadel_kills
CREATE POLICY "Anyone can view kill log" ON public.citadel_kills FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can insert kills" ON public.citadel_kills FOR INSERT TO authenticated WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_citadel_players_updated_at
  BEFORE UPDATE ON public.citadel_players
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed NPC shop listings
INSERT INTO public.citadel_market (item_type, item_name, quantity, price, is_npc_shop, shop_name)
VALUES
  ('fuel', 'Standard Fuel Cell', 99, 10, true, 'Fuel Station Alpha'),
  ('fuel', 'Premium Fuel Cell', 99, 25, true, 'Fuel Station Alpha'),
  ('equipment', 'Hull Plating Mk1', 50, 30, true, 'Titan Equipment'),
  ('equipment', 'Thruster Booster', 50, 45, true, 'Titan Equipment'),
  ('equipment', 'Shield Generator', 30, 60, true, 'Titan Equipment'),
  ('racing', 'Nitro Boost Pack', 40, 20, true, 'Speed Demons Racing'),
  ('racing', 'Drift Stabilizer', 40, 35, true, 'Speed Demons Racing'),
  ('food', 'Ration Pack', 200, 5, true, 'Mess Hall'),
  ('food', 'Combat Stim', 100, 15, true, 'Mess Hall'),
  ('id', 'Floppy Disk ID', 999, 5, true, 'ID Registry Office');
