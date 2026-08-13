-- Hồ sơ cá nhân: thêm địa chỉ, ngày sinh
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Hồ sơ khúc xạ (độ cận/loạn của khách) — mỗi khách 1 hồ sơ, tự cập nhật đè lên
CREATE TABLE public.prescriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  od_sph NUMERIC,
  od_cyl NUMERIC,
  os_sph NUMERIC,
  os_cyl NUMERIC,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.prescriptions TO authenticated;
GRANT ALL ON public.prescriptions TO service_role;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own prescription read" ON public.prescriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own prescription insert" ON public.prescriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own prescription update" ON public.prescriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER prescriptions_touch_updated_at
BEFORE UPDATE ON public.prescriptions
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
