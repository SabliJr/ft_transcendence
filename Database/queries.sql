--- This contians some of the hard queries to remember ---

-- Insert default plans
INSERT INTO plans (plan_name, plan_description, monthly_price_cents, yearly_price_cents, word_limit, features, is_popular) VALUES
('Free', 'Get started with basic features', 0, 0, 1000, '{"humanize": true, "writer": false, "translate": false}', false),
('Basic', 'Perfect for individuals', 999, 9900, 50000, '{"humanize": true, "writer": true, "translate": false}', false),
('Pro', 'Great for professionals', 1999, 19900, 200000, '{"humanize": true, "writer": true, "translate": true}', true),
('Premium', 'For power users', 4999, 49900, 1000000, '{"humanize": true, "writer": true, "translate": true, "priority_support": true}', false);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_subscription_updated_at
    BEFORE UPDATE ON user_subscription
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_updated_at();


-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_profile_updated_at
    BEFORE UPDATE ON user_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profile_updated_at();

-- Or keep TEXT but add a constraint for better validation
ALTER TABLE user_profile ADD CONSTRAINT user_id_length_check CHECK (length(user_id) >= 3);