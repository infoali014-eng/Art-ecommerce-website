-- Seed Categories
INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
('paintings', 'Paintings', 'paintings', 'Original hand-painted masterworks in pigment oils, acrylics, and mixed media overlays.', 'categories/paintings.jpg'),
('calligraphy', 'Arabic Calligraphy', 'calligraphy', 'Traditional and contemporary calligraphic scripts rendered in sumi ink and gold details.', 'categories/calligraphy.jpg'),
('sketches', 'Charcoal & Ink Sketches', 'sketches', 'Minimalist monochrome drawings on acid-free artist boards exploring anatomy and light.', 'categories/sketches.jpg')
ON CONFLICT (id) DO NOTHING;

-- Seed Artists
INSERT INTO public.artists (id, name, slug, bio, profile_image, specialty) VALUES
('artist-marcus-vance', 'Marcus Vance', 'marcus-vance', 'Marcus Vance is an award-winning painter whose abstract landscapes have been shown globally. Influenced by raw textures, atmospheric light, and mineral pigments, Marcus crafts oil canvases that convey a sense of calm and expansive space.', 'artists/marcus-vance.jpg', 'Abstract Oils'),
('artist-elena-rostova', 'Elena Rostova', 'elena-rostova', 'Elena Rostova blends acrylic paints with organic plaster compounds to construct relief sculptures on canvas. Her monochromatic experiments examine how shadows cast by micro-reliefs transition over the course of a day.', 'artists/elena-rostova.jpg', 'Relief Plaster Sculptures'),
('artist-kaito-hayashi', 'Kaito Hayashi', 'kaito-hayashi', 'Kaito Hayashi is a master calligrapher based in Kyoto. Trained under classical Japanese masters, Kaito explores the boundary where ancient brush script forms dissolve into modern abstract expressions of wind, momentum, and stillness.', 'artists/kaito-hayashi.jpg', 'Zen Brush Script'),
('artist-diana-prince', 'Diana Prince', 'diana-prince', 'Diana Prince is a draftswoman focusing on architectural structures and classical light dynamics. Using fine graphite and silverpoint on acid-free boards, Diana studies structural geometry, shadows, and the quiet spaces in between.', 'artists/diana-prince.jpg', 'Architectural Charcoal & Silverpoint')
ON CONFLICT (id) DO NOTHING;

-- Seed Collections
INSERT INTO public.collections (id, slug, title, description, cover_image, featured) VALUES
('col-winter-exhibition', 'winter-exhibition', 'Winter Exhibition', 'A collection representing cool color values, architectural stillness, and meditative moods.', 'collections/winter-exhibition.jpg', true),
('col-golden-era', 'golden-era', 'Golden Era Collection', 'Curations integrating gold leaf overlays and warm metallic accents.', 'collections/golden-era.jpg', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Artworks
INSERT INTO public.artworks (id, title, slug, description, story, technique, price, category_id, artist_id, collection_id, medium, dimensions, orientation, availability, featured, popular, new_arrival, is_original, framing_available, estimated_delivery, inventory_quantity, is_active, view_count, sold_count) VALUES
('art-1', 'Whispers of the Horizon', 'whispers-of-the-horizon', 
 'An evocative abstract landscape exploring the boundary between light and shadow, highlighted by hand-applied 24k gold leaf details.', 
 'Inspired by Marcus''s retreat to the Icelandic coastline, this piece records the first light breaking over volcanic black sand dunes, using gold leaf to reflect the changing direction of morning light.', 
 'Hand-painted using custom pigment oils and multiple layers of gold leaf on imported Belgian linen.', 
 3200, 'paintings', 'artist-marcus-vance', 'col-golden-era', 'Oil and Gold Leaf', '36" x 48"', 'landscape', 'available', true, true, true, true, true, '5–7 Days', 1, true, 142, 0),

('art-2', 'Echoes of Silence', 'echoes-of-silence', 
 'A precise, minimalist architectural graphite sketch studying the play of morning shadows inside a Brutalist concrete pavilion.', 
 'Created during Diana''s residency in Berlin, this drawing is an exercise in restraint, capturing how stark concrete columns capture and divide natural daylight.', 
 'Graphite and carbon wash on heavy 300gsm hot-pressed cotton paper.', 
 1800, 'sketches', 'artist-diana-prince', 'col-winter-exhibition', 'Graphite on Cotton Paper', '24" x 30"', 'portrait', 'available', true, false, true, true, true, '5–7 Days', 1, true, 98, 0),

('art-3', 'Syllables of the Wind', 'syllables-of-the-wind', 
 'A fluid calligraphic rendering capturing dynamic kinetic motion, moving seamlessly between classical Kanji script and modern abstraction.', 
 'Hayashi painted this script during a spring rainstorm, letting the sound of howling gusts guide the velocity, release, and pressure of the horsehair brush.', 
 'Sumi ink on handmade, untrimmed Japanese mulberry Washi paper.', 
 2100, 'calligraphy', 'artist-kaito-hayashi', NULL, 'Sumi Ink on Washi', '18" x 24"', 'portrait', 'available', true, true, false, true, true, '5–7 Days', 1, true, 115, 0),

('art-4', 'Raw Relief Study', 'raw-relief-study', 
 'A heavy, tactile relief panel combining chalk plaster and white acrylics to explore shadow mapping in solid monochrome.', 
 'Elena''s relief panel studies the transition of light. As ambient room lighting changes from morning to night, the cast shadows of the plaster ridges shift.', 
 'Plaster relief paste and structural acrylic media on stretched linen panel.', 
 4100, 'paintings', 'artist-elena-rostova', NULL, 'Relief Plaster on Linen', '40" x 40"', 'square', 'available', false, true, true, true, false, '7–10 Days', 1, true, 210, 0),

('art-5', 'Sovereignty of Solitude', 'sovereignty-of-solitude', 
 'A large-scale abstract painting utilizing deep mineral indigo pigment and subtle copper vein overlays.', 
 'Inspired by deep ocean depths, Marcus Vance explores solitary states, balancing flat blocks of rich blue against organic metallic veins.', 
 'Mineral oil glazes and copper foil leafing on canvas.', 
 4500, 'paintings', 'artist-marcus-vance', 'col-winter-exhibition', 'Oil and Copper Leaf', '48" x 60"', 'landscape', 'available', true, false, false, true, true, '7–10 Days', 1, true, 87, 0),

('art-6', 'The Weight of Geometry', 'the-weight-of-geometry', 
 'A complex geometric script in sumi brushstrokes, aligning characters along architectural axis lines.', 
 'An exploration of order and breath, this calligraphic piece balances structural grid lines with freehand ink flows.', 
 'Sumi ink and gold mineral paint on Washi paper.', 
 2400, 'calligraphy', 'artist-kaito-hayashi', 'col-golden-era', 'Sumi Ink and Mineral Paint', '24" x 24"', 'square', 'available', false, true, false, true, true, '5–7 Days', 1, true, 63, 0)
ON CONFLICT (id) DO NOTHING;

-- Seed Artwork Images
INSERT INTO public.artwork_images (artwork_id, image_url, display_order) VALUES
('art-1', 'artworks/whispers_horizon_1.jpg', 0),
('art-1', 'artworks/whispers_horizon_2.jpg', 1),
('art-2', 'artworks/echoes_silence_1.jpg', 0),
('art-3', 'artworks/syllables_wind_1.jpg', 0),
('art-4', 'artworks/raw_relief_1.jpg', 0),
('art-5', 'artworks/sovereignty_solitude_1.jpg', 0),
('art-6', 'artworks/weight_geometry_1.jpg', 0)
ON CONFLICT DO NOTHING;
