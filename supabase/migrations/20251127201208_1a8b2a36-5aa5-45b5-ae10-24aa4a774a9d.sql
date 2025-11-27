-- Create registrations table
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Policies for registrations
CREATE POLICY "Users can view their own registrations"
  ON public.registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events"
  ON public.registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unregister from events"
  ON public.registrations FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Organizers can view registrations for their events"
  ON public.registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = registrations.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all registrations"
  ON public.registrations FOR SELECT
  USING (has_role(auth.uid(), 'admin'));