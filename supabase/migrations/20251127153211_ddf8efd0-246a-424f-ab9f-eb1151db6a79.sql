-- Add qr_link column to professionals table for storing QR code links
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS qr_link TEXT;