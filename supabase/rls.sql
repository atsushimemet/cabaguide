-- Enable Row Level Security
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_prices_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_prices_nomination ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_tax ENABLE ROW LEVEL SECURITY;
ALTER TABLE casts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Areas: Public read access
CREATE POLICY "Areas are viewable by everyone" ON areas
  FOR SELECT USING (true);

-- Shops: Public read access
CREATE POLICY "Shops are viewable by everyone" ON shops
  FOR SELECT USING (true);

-- Shop prices: Public read access
CREATE POLICY "Shop prices are viewable by everyone" ON shop_prices_time
  FOR SELECT USING (true);

CREATE POLICY "Shop nomination prices are viewable by everyone" ON shop_prices_nomination
  FOR SELECT USING (true);

CREATE POLICY "Shop tax is viewable by everyone" ON shop_tax
  FOR SELECT USING (true);

-- Casts: Public read access
CREATE POLICY "Casts are viewable by everyone" ON casts
  FOR SELECT USING (true);

-- Reviews: Public read access, anyone can insert (IP-based)
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Likes: Public read access, anyone can insert (IP-based)
CREATE POLICY "Likes are viewable by everyone" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert likes" ON likes
  FOR INSERT WITH CHECK (true);

-- Admin policies (for authenticated users with admin role)
-- Note: You'll need to create a user role system or use Supabase auth metadata
-- For now, we'll allow authenticated users to manage data
-- In production, you should add proper admin role checking

-- Areas: Admin can manage
CREATE POLICY "Admins can insert areas" ON areas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update areas" ON areas
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete areas" ON areas
  FOR DELETE USING (auth.role() = 'authenticated');

-- Shops: Admin can manage
CREATE POLICY "Admins can insert shops" ON shops
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update shops" ON shops
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete shops" ON shops
  FOR DELETE USING (auth.role() = 'authenticated');

-- Shop prices: Admin can manage
CREATE POLICY "Admins can insert shop prices" ON shop_prices_time
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update shop prices" ON shop_prices_time
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete shop prices" ON shop_prices_time
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert shop nomination prices" ON shop_prices_nomination
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update shop nomination prices" ON shop_prices_nomination
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete shop nomination prices" ON shop_prices_nomination
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert shop tax" ON shop_tax
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update shop tax" ON shop_tax
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete shop tax" ON shop_tax
  FOR DELETE USING (auth.role() = 'authenticated');

-- Casts: Admin can manage
CREATE POLICY "Admins can insert casts" ON casts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update casts" ON casts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete casts" ON casts
  FOR DELETE USING (auth.role() = 'authenticated');
