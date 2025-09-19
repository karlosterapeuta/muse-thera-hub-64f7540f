-- Disable email confirmation requirement
UPDATE auth.config 
SET email_confirm_signup = false;

-- Also disable email change confirmation
UPDATE auth.config 
SET email_change_confirm_enable = false;