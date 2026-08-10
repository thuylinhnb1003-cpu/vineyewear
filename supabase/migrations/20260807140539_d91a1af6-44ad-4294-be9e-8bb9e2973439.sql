UPDATE public.products SET frame_shape = CASE frame_shape
  WHEN 'Vuông' THEN 'Square'
  WHEN 'Tròn' THEN 'Round'
  WHEN 'Mắt mèo' THEN 'Cat-eye'
  WHEN 'Phi công' THEN 'Aviator'
  WHEN 'Oval' THEN 'Oval'
  ELSE frame_shape END
WHERE frame_shape IN ('Vuông','Tròn','Mắt mèo','Phi công');

UPDATE public.products SET material = CASE material
  WHEN 'Titan' THEN 'Titanium'
  WHEN 'Kim loại' THEN 'Stainless Steel'
  WHEN 'Nhựa 1.61' THEN 'Polycarbonate 1.61'
  ELSE material END
WHERE material IN ('Titan','Kim loại','Nhựa 1.61');

UPDATE public.products SET brand = 'Ray-Ban' WHERE frame_shape = 'Aviator' AND brand = 'Vin Eyewear';
UPDATE public.products SET brand = 'Bolon' WHERE frame_shape = 'Cat-eye' AND brand = 'Vin Eyewear';
UPDATE public.products SET brand = 'Lindberg' WHERE frame_shape = 'Square' AND brand = 'Vin Eyewear';
UPDATE public.products SET brand = 'Oakley' WHERE frame_shape = 'Round' AND brand = 'Vin Eyewear';