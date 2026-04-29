-- Sample data (bilingual) — run after schema.sql + rls_admin.sql
-- Upload real files to Storage bucket `product-images` or replace storage_path after admin upload

-- Categories
insert into public.categories (id, slug, name_en, name_zh, sort_order) values
  ('10000000-0000-4000-8000-000000000001', 'bouquets', 'Bouquets', '花束', 1),
  ('10000000-0000-4000-8000-000000000002', 'roses', 'Roses', '玫瑰', 2),
  ('10000000-0000-4000-8000-000000000003', 'gifts', 'Gifts & Add-ons', '礼品与配搭', 3),
  ('10000000-0000-4000-8000-000000000004', 'occasions', 'Occasions', '节日主题', 4),
  ('10000000-0000-4000-8000-000000000005', 'plants', 'Plants', '盆栽绿植', 5)
on conflict (slug) do nothing;

-- Helper: products bulk — 20 items with bilingual names/descriptions
insert into public.products (id, slug, category_id, name_en, name_zh, description_en, description_zh, featured, is_active) values
('20000000-0000-4000-8000-000000000001', 'classic-rose-bouquet', '10000000-0000-4000-8000-000000000002', 'Classic Rose Bouquet', '经典玫瑰花束', 'Hand-tied red roses for any romantic occasion.', '手打红玫瑰，适合各类浪漫场景。', true, true),
('20000000-0000-4000-8000-000000000002', 'spring-mix-bouquet', '10000000-0000-4000-8000-000000000001', 'Spring Mix Bouquet', '春日混合花束', 'Seasonal blooms in soft pastels.', '柔和粉彩应季花材组合。', true, true),
('20000000-0000-4000-8000-000000000003', 'white-lily-elegance', '10000000-0000-4000-8000-000000000001', 'White Lily Elegance', '白百合优雅', 'Fragrant lilies with eucalyptus.', '带尤加利香气的白百合。', false, true),
('20000000-0000-4000-8000-000000000004', 'sunshine-sunflowers', '10000000-0000-4000-8000-000000000001', 'Sunshine Sunflowers', '阳光向日葵', 'Bold sunflowers with greens.', '大朵向日葵与叶材。', true, true),
('20000000-0000-4000-8000-000000000005', 'pastel-dream', '10000000-0000-4000-8000-000000000001', 'Pastel Dream', '粉彩梦境', 'Soft pinks and creams.', '粉白奶油色调。', false, true),
('20000000-0000-4000-8000-000000000006', 'ruby-dozen', '10000000-0000-4000-8000-000000000002', 'Ruby Dozen', '红宝石一打', 'Twelve premium red roses.', '十二枝优选红玫瑰。', true, true),
('20000000-0000-4000-8000-000000000007', 'blush-pink-roses', '10000000-0000-4000-8000-000000000002', 'Blush Pink Roses', '腮红粉玫瑰', 'Soft pink roses gift wrapped.', '浅粉玫瑰礼品包装。', false, true),
('20000000-0000-4000-8000-000000000008', 'ivory-garden-roses', '10000000-0000-4000-8000-000000000002', 'Ivory Garden Roses', '象牙花园玫瑰', 'Garden-style ivory roses.', '象牙色花园风玫瑰。', false, true),
('20000000-0000-4000-8000-000000000009', 'chocolate-box-small', '10000000-0000-4000-8000-000000000003', 'Artisan Chocolate Box (S)', '手工巧克力礼盒（小）', 'Pairs beautifully with flowers.', '与鲜花搭配更佳。', false, true),
('20000000-0000-4000-8000-000000000010', 'vase-clear-glass', '10000000-0000-4000-8000-000000000003', 'Clear Glass Vase', '透明玻璃花瓶', 'Classic cylinder vase.', '经典直筒花瓶。', false, true),
('20000000-0000-4000-8000-000000000011', 'teddy-bear-small', '10000000-0000-4000-8000-000000000003', 'Keepsake Teddy (S)', '纪念泰迪（小）', 'Soft plush companion.', '柔软毛绒陪伴。', false, true),
('20000000-0000-4000-8000-000000000012', 'valentine-premium', '10000000-0000-4000-8000-000000000004', 'Valentine Premium Set', '情人节臻选套装', 'Roses, vase, and ribbon.', '玫瑰、花瓶与丝带。', true, true),
('20000000-0000-4000-8000-000000000013', 'mothers-day-blush', '10000000-0000-4000-8000-000000000004', 'Mother''s Day Blush', '母亲节柔粉系列', 'Mixed blooms for Mom.', '献给母亲的混搭花束。', false, true),
('20000000-0000-4000-8000-000000000014', 'graduation-bright', '10000000-0000-4000-8000-000000000004', 'Graduation Bright', '毕业亮色花束', 'Celebratory bold colors.', '庆典亮色组合。', false, true),
('20000000-0000-4000-8000-000000000015', 'orchid-office', '10000000-0000-4000-8000-000000000005', 'Office Phalaenopsis', '办公蝴蝶兰', 'Long-lasting orchid plant.', '花期持久的兰花盆栽。', false, true),
('20000000-0000-4000-8000-000000000016', 'succulent-garden', '10000000-0000-4000-8000-000000000005', 'Succulent Garden Bowl', '多肉组合盆栽', 'Low-maintenance arrangement.', '易养护组合。', false, true),
('20000000-0000-4000-8000-000000000017', 'monstera-potted', '10000000-0000-4000-8000-000000000005', 'Monstera Deliciosa', '龟背竹盆栽', 'Statement indoor plant.', '室内大型观叶。', false, true),
('20000000-0000-4000-8000-000000000018', 'lavender-bundle', '10000000-0000-4000-8000-000000000001', 'Dried Lavender Bundle', '干薰衣草花束', 'Calming fragrance for home.', '居家舒缓香氛。', false, true),
('20000000-0000-4000-8000-000000000019', 'peony-season', '10000000-0000-4000-8000-000000000001', 'Peony Season Bouquet', '芍药季限定花束', 'Limited seasonal peonies.', '应季芍药限量。', true, true),
('20000000-0000-4000-8000-000000000020', 'corporate-gift', '10000000-0000-4000-8000-000000000004', 'Corporate Gift Arrangement', '商务插花礼盒', 'Neutral tones for delivery.', '商务中性色调配送。', false, true)
on conflict (slug) do nothing;

-- Variants (SKU, size, color, price USD, stock)
insert into public.product_variants (product_id, sku, size_label, color_label, price_usd, stock) values
('20000000-0000-4000-8000-000000000001', 'RB-RED-M', 'Medium', 'Red', 59.00, 40),
('20000000-0000-4000-8000-000000000001', 'RB-RED-L', 'Large', 'Red', 79.00, 25),
('20000000-0000-4000-8000-000000000002', 'SMB-MIX-S', 'Small', 'Mixed', 45.00, 60),
('20000000-0000-4000-8000-000000000002', 'SMB-MIX-M', 'Medium', 'Mixed', 65.00, 45),
('20000000-0000-4000-8000-000000000003', 'WLE-WHT-M', 'Medium', 'White', 55.00, 30),
('20000000-0000-4000-8000-000000000004', 'SUN-YEL-S', 'Small', 'Yellow', 42.00, 50),
('20000000-0000-4000-8000-000000000004', 'SUN-YEL-M', 'Medium', 'Yellow', 62.00, 35),
('20000000-0000-4000-8000-000000000005', 'PD-PST-M', 'Medium', 'Pastel', 58.00, 28),
('20000000-0000-4000-8000-000000000006', 'RD12-RED-O', 'One size', 'Red', 89.00, 80),
('20000000-0000-4000-8000-000000000007', 'BPR-PNK-M', 'Medium', 'Pink', 69.00, 40),
('20000000-0000-4000-8000-000000000008', 'IGR-IVY-M', 'Medium', 'Ivory', 74.00, 22),
('20000000-0000-4000-8000-000000000009', 'CHS-S-001', 'Small', 'Assorted', 18.00, 100),
('20000000-0000-4000-8000-000000000010', 'VASE-CYL-M', 'Medium', 'Clear', 24.00, 70),
('20000000-0000-4000-8000-000000000011', 'TED-S-BRN', 'Small', 'Brown', 15.00, 120),
('20000000-0000-4000-8000-000000000012', 'VDP-L-RED', 'Large', 'Red', 129.00, 35),
('20000000-0000-4000-8000-000000000013', 'MDB-M-PNK', 'Medium', 'Blush', 72.00, 40),
('20000000-0000-4000-8000-000000000014', 'GRD-M-MIX', 'Medium', 'Bright', 54.00, 55),
('20000000-0000-4000-8000-000000000015', 'ORC-WHT-2S', '2 stems', 'White', 48.00, 25),
('20000000-0000-4000-8000-000000000016', 'SUC-BWL-M', 'Medium', 'Green', 36.00, 40),
('20000000-0000-4000-8000-000000000017', 'MON-POT-L', 'Large', 'Green', 88.00, 15),
('20000000-0000-4000-8000-000000000018', 'LAV-DRY-S', 'Small', 'Purple', 22.00, 90),
('20000000-0000-4000-8000-000000000019', 'PEO-PNK-M', 'Medium', 'Pink', 95.00, 18),
('20000000-0000-4000-8000-000000000020', 'CGFT-NUT-L', 'Large', 'Neutral', 110.00, 20);

-- One placeholder image per product (replace path after upload; run once)
-- delete from public.product_images where storage_path like 'seed/%';
insert into public.product_images (product_id, storage_path, alt_en, alt_zh, sort_order)
select id, 'seed/' || slug || '.jpg', name_en, name_zh, 0 from public.products
where id::text like '20000000%';
