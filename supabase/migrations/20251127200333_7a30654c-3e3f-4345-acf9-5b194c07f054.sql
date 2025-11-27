-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  max_attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Anyone can view published events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Organizers can insert their own events"
  ON public.events FOR INSERT
  WITH CHECK (
    auth.uid() = organizer_id AND
    (has_role(auth.uid(), 'organizer') OR has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Organizers can update their own events"
  ON public.events FOR UPDATE
  USING (
    auth.uid() = organizer_id AND
    (has_role(auth.uid(), 'organizer') OR has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Organizers can delete their own events"
  ON public.events FOR DELETE
  USING (
    auth.uid() = organizer_id AND
    (has_role(auth.uid(), 'organizer') OR has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Admins can manage all events"
  ON public.events FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();