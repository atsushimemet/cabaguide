-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Areas table
CREATE TABLE IF NOT EXISTS areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  address TEXT,
  phone TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop prices time table
CREATE TABLE IF NOT EXISTS shop_prices_time (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  start_time TEXT NOT NULL, -- Format: "HH:MM"
  end_time TEXT NOT NULL, -- Format: "HH:MM"
  price INTEGER NOT NULL, -- Price in yen
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop prices nomination table
CREATE TABLE IF NOT EXISTS shop_prices_nomination (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  nomination TEXT NOT NULL DEFAULT '指名料',
  price INTEGER NOT NULL, -- Price in yen
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id)
);

-- Shop tax table
CREATE TABLE IF NOT EXISTS shop_tax (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  tax_category TEXT NOT NULL DEFAULT 'SC・TAX',
  price DECIMAL(5, 2) NOT NULL DEFAULT 0.35, -- Tax rate as decimal (e.g., 0.35 for 35%)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id)
);

-- Casts table
CREATE TABLE IF NOT EXISTS casts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  image_url TEXT, -- S3 URL
  instagram_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id UUID NOT NULL REFERENCES casts(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  cute_score INTEGER NOT NULL CHECK (cute_score >= 1 AND cute_score <= 5),
  talk_score INTEGER NOT NULL CHECK (talk_score >= 1 AND talk_score <= 5),
  price_score INTEGER NOT NULL CHECK (price_score >= 1 AND price_score <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cast_id UUID NOT NULL REFERENCES casts(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cast_id, ip_address) -- Prevent duplicate likes from same IP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shops_area_id ON shops(area_id);
CREATE INDEX IF NOT EXISTS idx_shop_prices_time_shop_id ON shop_prices_time(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_prices_nomination_shop_id ON shop_prices_nomination(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_tax_shop_id ON shop_tax(shop_id);
CREATE INDEX IF NOT EXISTS idx_casts_shop_id ON casts(shop_id);
CREATE INDEX IF NOT EXISTS idx_reviews_cast_id ON reviews(cast_id);
CREATE INDEX IF NOT EXISTS idx_reviews_ip_address ON reviews(ip_address);
CREATE INDEX IF NOT EXISTS idx_likes_cast_id ON likes(cast_id);
CREATE INDEX IF NOT EXISTS idx_likes_ip_address ON likes(ip_address);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shop_prices_time_updated_at BEFORE UPDATE ON shop_prices_time
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shop_prices_nomination_updated_at BEFORE UPDATE ON shop_prices_nomination
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shop_tax_updated_at BEFORE UPDATE ON shop_tax
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_casts_updated_at BEFORE UPDATE ON casts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
