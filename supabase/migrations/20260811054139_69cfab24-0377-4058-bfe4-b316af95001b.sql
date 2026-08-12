-- stores: allow admin/manager to create/update/delete store records (was read-only until now)
CREATE POLICY "admin stores" ON public.stores FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
