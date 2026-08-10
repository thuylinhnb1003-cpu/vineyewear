-- roles
CREATE TYPE public.app_role AS ENUM ('customer','staff','manager','admin');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- catalog
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public categories" ON public.categories FOR SELECT TO anon, authenticated USING (is_visible);
CREATE POLICY "admin categories" ON public.categories FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand TEXT,
  frame_shape TEXT,
  material TEXT,
  color TEXT,
  gender TEXT,
  description TEXT,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  price NUMERIC(12,0) NOT NULL DEFAULT 0,
  compare_at_price NUMERIC(12,0),
  stock_quantity INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_stock',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  ar_model_url TEXT,
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  review_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public products" ON public.products FOR SELECT TO anon, authenticated USING (is_visible);
CREATE POLICY "admin products" ON public.products FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
CREATE TRIGGER products_touch BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  location TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public events" ON public.events FOR SELECT TO anon, authenticated USING (is_visible);
CREATE POLICY "admin events" ON public.events FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));

CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  open_hours TEXT,
  map_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT ON public.stores TO anon, authenticated;
GRANT ALL ON public.stores TO service_role;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public stores" ON public.stores FOR SELECT TO anon, authenticated USING (is_active);

-- favorites
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites" ON public.favorites FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  store_id UUID NOT NULL REFERENCES public.stores(id),
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  service_type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, appointment_date, time_slot)
);
GRANT SELECT ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own appointments read" ON public.appointments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "staff appointments" ON public.appointments FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff'));

-- orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT,
  delivery_method TEXT NOT NULL DEFAULT 'pickup',
  payment_method TEXT NOT NULL DEFAULT 'cod',
  note TEXT,
  subtotal NUMERIC(12,0) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(12,0) NOT NULL DEFAULT 0,
  total NUMERIC(12,0) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own orders read" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "staff orders" ON public.orders FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff'));
CREATE TRIGGER orders_touch BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(12,0) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  line_total NUMERIC(12,0) NOT NULL
);
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own order items read" ON public.order_items FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "staff order items" ON public.order_items FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff'));

-- contact requests
CREATE TABLE public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff contact requests" ON public.contact_requests FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff'));

-- seed data
INSERT INTO public.stores (code, name, address, phone, open_hours, map_url) VALUES
('TAYHO','Vin Eyewear Tây Hồ','46 Hoàng Hoa Thám, phường Tây Hồ, TP. Hà Nội','0901 234 567','08:00 - 21:00 hàng ngày','https://www.google.com/maps?q=46+Ho%C3%A0ng+Hoa+Th%C3%A1m+H%C3%A0+N%E1%BB%99i&output=embed'),
('LONGBIEN','Vin Eyewear Long Biên','261 Ngọc Lâm, phường Bồ Đề, TP. Hà Nội','0901 234 568','08:00 - 21:00 hàng ngày','https://www.google.com/maps?q=261+Ng%E1%BB%8Dc+L%C3%A2m+H%C3%A0+N%E1%BB%99i&output=embed');

INSERT INTO public.categories (slug, name, description, sort_order) VALUES
('gong-kinh','Gọng kính','Gọng kính cận chính hãng nhiều kiểu dáng',1),
('kinh-mat','Kính mát','Kính mát chống tia UV cho mọi khuôn mặt',2),
('trong-kinh','Tròng kính','Tròng kính chiết suất cao, chống ánh sáng xanh',3),
('kinh-ap-trong','Kính áp tròng','Lens hàng ngày và hàng tháng an toàn cho mắt',4);

INSERT INTO public.products (slug, sku, name, category_id, brand, frame_shape, material, color, gender, description, specs, images, price, compare_at_price, stock_quantity, status, is_featured, rating, review_count) VALUES
('gong-kinh-titan-vin-t01','VEW-T01','Gọng kính Titan Vin T01',(SELECT id FROM public.categories WHERE slug='gong-kinh'),'Vin Eyewear','Vuông','Titan','Đen','unisex','Gọng titan siêu nhẹ 12g, thiết kế vuông thanh lịch phù hợp mọi khuôn mặt.','{"Vật liệu":"Titan","Kích thước":"52-18-140","Trọng lượng":"12g"}','["/images/product-1.jpg"]',2890000,3500000,12,'in_stock',true,5.0,18),
('gong-kinh-acetate-vin-a02','VEW-A02','Gọng kính Acetate Vin A02',(SELECT id FROM public.categories WHERE slug='gong-kinh'),'Vin Eyewear','Tròn','Acetate','Nâu vân','unisex','Gọng acetate vân đồi mồi, phong cách cổ điển hiện đại.','{"Vật liệu":"Acetate","Kích thước":"50-20-145","Trọng lượng":"22g"}','["/images/product-2.jpg"]',1690000,1990000,20,'in_stock',true,4.9,32),
('kinh-mat-polarized-vin-s03','VEW-S03','Kính mát Polarized Vin S03',(SELECT id FROM public.categories WHERE slug='kinh-mat'),'Vin Eyewear','Phi công','Kim loại','Xám khói','male','Kính mát phân cực chống chói, chặn 100% tia UV400.','{"Tròng":"Polarized UV400","Kích thước":"58-16-140"}','["/images/product-3.jpg"]',2190000,2690000,8,'in_stock',true,5.0,24),
('kinh-mat-mat-meo-vin-s04','VEW-S04','Kính mát Mắt mèo Vin S04',(SELECT id FROM public.categories WHERE slug='kinh-mat'),'Vin Eyewear','Mắt mèo','Acetate','Hồng trà','female','Kính mát mắt mèo tôn đường nét khuôn mặt, tròng gradient.','{"Tròng":"Gradient UV400","Kích thước":"55-18-142"}','["/images/product-4.jpg"]',1890000,NULL,0,'out_of_stock',false,4.8,11),
('trong-kinh-chong-anh-sang-xanh','VEW-L05','Tròng kính chống ánh sáng xanh 1.61',(SELECT id FROM public.categories WHERE slug='trong-kinh'),'Essilor','—','Nhựa 1.61','Trong','unisex','Tròng chiết suất 1.61 chống ánh sáng xanh, phù hợp làm việc máy tính.','{"Chiết suất":"1.61","Lớp phủ":"Blue-cut, chống xước"}','["/images/product-5.jpg"]',1250000,1500000,50,'in_stock',true,4.9,45),
('kinh-ap-trong-daily-vin','VEW-C06','Kính áp tròng Daily Vin (30 kính)',(SELECT id FROM public.categories WHERE slug='kinh-ap-trong'),'Vin Eyewear','—','Hydrogel','Trong','unisex','Lens dùng một ngày, độ ẩm 55%, an toàn cho mắt nhạy cảm.','{"Đường kính":"14.2mm","Độ ẩm":"55%"}','["/images/product-6.jpg"]',420000,520000,100,'in_stock',false,4.7,63);

INSERT INTO public.events (slug, title, excerpt, content, location, starts_at, ends_at) VALUES
('kham-mat-mien-phi-thang-8','Khám mắt miễn phí cùng chuyên gia','Đo khúc xạ và tư vấn tròng kính miễn phí tại cả hai cơ sở Vin Eyewear.','Trong suốt chương trình, khách hàng được đo khúc xạ bằng thiết bị tự động, tư vấn 1-1 với kỹ thuật viên khúc xạ và nhận voucher 10% cho đơn tròng kính.','Cả 2 cơ sở Vin Eyewear', now() + interval '5 day', now() + interval '20 day'),
('uu-dai-gong-0-dong','Ưu đãi Gọng 0 đồng khi mua tròng cao cấp','Tặng gọng kính trị giá tới 1.500.000đ khi mua tròng kính cao cấp.','Áp dụng cho các dòng tròng chiết suất từ 1.60 trở lên. Số lượng gọng ưu đãi có hạn tại từng cơ sở.','Cơ sở Tây Hồ', now() - interval '2 day', now() + interval '12 day'),
('workshop-chon-gong-theo-khuon-mat','Workshop: Chọn gọng theo khuôn mặt','Buổi workshop hướng dẫn chọn gọng kính phù hợp từng dáng khuôn mặt.','Chuyên gia hình ảnh của Vin Eyewear sẽ phân tích tỉ lệ khuôn mặt và hướng dẫn cách chọn gọng, màu sắc phù hợp. Có thử kính AR trực tiếp.','Cơ sở Long Biên', now() + interval '25 day', now() + interval '25 day');