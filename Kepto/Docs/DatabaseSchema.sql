-- =====================================================
-- QuickMart Database Schema
-- PostgreSQL 15+
-- =====================================================

-- =====================================================
-- USER SERVICE DATABASE
-- =====================================================

-- Users Table
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    free_cash_balance DECIMAL(10, 2) DEFAULT 0.00,
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    CONSTRAINT check_phone_format CHECK (phone_number ~ '^\+[1-9]\d{1,14}$'),
    CONSTRAINT check_free_cash CHECK (free_cash_balance >= 0)
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_created ON users(created_at);

COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON COLUMN users.free_cash_balance IS 'Promotional cash balance available to user';

-- Addresses Table
CREATE TABLE addresses (
    address_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    address_type VARCHAR(20) NOT NULL DEFAULT 'OTHER',
    address_label VARCHAR(50),
    house_no VARCHAR(50),
    address_line1 VARCHAR(200) NOT NULL,
    address_line2 VARCHAR(200),
    landmark VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(50) DEFAULT 'India',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT check_address_type CHECK (address_type IN ('HOME', 'WORK', 'OTHER')),
    CONSTRAINT check_coordinates CHECK (
        (latitude IS NULL AND longitude IS NULL) OR 
        (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180)
    )
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_location ON addresses(latitude, longitude);
CREATE INDEX idx_addresses_pincode ON addresses(pincode);
CREATE INDEX idx_addresses_default ON addresses(user_id, is_default) WHERE is_default = TRUE;

COMMENT ON TABLE addresses IS 'User delivery addresses';

-- Wishlist Table
CREATE TABLE wishlist (
    wishlist_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_wishlist_product ON wishlist(product_id);
CREATE INDEX idx_wishlist_added ON wishlist(added_at);

COMMENT ON TABLE wishlist IS 'User product wishlist';

-- User Preferences Table
CREATE TABLE user_preferences (
    preference_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    promotional_notifications BOOLEAN DEFAULT TRUE,
    order_updates BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'en',
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id)
);

CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);

COMMENT ON TABLE user_preferences IS 'User notification and app preferences';

-- =====================================================
-- PRODUCT SERVICE DATABASE
-- =====================================================

-- Categories Table
CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_url VARCHAR(500),
    banner_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    parent_category_id BIGINT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(200),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

CREATE INDEX idx_categories_parent ON categories(parent_category_id);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_order ON categories(display_order);

COMMENT ON TABLE categories IS 'Product categories hierarchy';

-- Brands Table
CREATE TABLE brands (
    brand_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brands_name ON brands(name);
CREATE INDEX idx_brands_active ON brands(is_active);

COMMENT ON TABLE brands IS 'Product brands';

-- Stores Table
CREATE TABLE stores (
    store_id BIGSERIAL PRIMARY KEY,
    store_name VARCHAR(100) NOT NULL,
    store_code VARCHAR(50) UNIQUE NOT NULL,
    store_type VARCHAR(50),
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone_number VARCHAR(15),
    email VARCHAR(100),
    manager_name VARCHAR(100),
    service_radius_km DECIMAL(5, 2) DEFAULT 5.00,
    is_active BOOLEAN DEFAULT TRUE,
    operating_hours JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_store_coordinates CHECK (
        latitude BETWEEN -90 AND 90 AND 
        longitude BETWEEN -180 AND 180
    )
);

CREATE INDEX idx_stores_location ON stores(latitude, longitude);
CREATE INDEX idx_stores_pincode ON stores(pincode);
CREATE INDEX idx_stores_active ON stores(is_active);
CREATE INDEX idx_stores_code ON stores(store_code);

COMMENT ON TABLE stores IS 'Dark stores/warehouses for inventory';
COMMENT ON COLUMN stores.operating_hours IS 'JSON object with opening/closing times per day';

-- Products Table
CREATE TABLE products (
    product_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    category_id BIGINT NOT NULL,
    subcategory_id BIGINT,
    brand_id BIGINT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    mrp_price DECIMAL(10, 2) NOT NULL,
    offer_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE WHEN mrp_price > 0 
        THEN ((mrp_price - offer_price) / mrp_price * 100)
        ELSE 0 END
    ) STORED,
    cost_price DECIMAL(10, 2),
    tax_percentage DECIMAL(5, 2) DEFAULT 0.00,
    quantity_value DECIMAL(10, 2),
    quantity_unit VARCHAR(50),
    weight_grams DECIMAL(10, 2),
    dimensions JSONB,
    image_urls TEXT[],
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    is_returnable BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    product_highlights TEXT[],
    ingredients TEXT,
    nutritional_info JSONB,
    storage_instructions TEXT,
    usage_instructions TEXT,
    manufacturer_name VARCHAR(200),
    manufacturer_address TEXT,
    country_of_origin VARCHAR(100) DEFAULT 'India',
    best_before_days INTEGER,
    meta_title VARCHAR(200),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (subcategory_id) REFERENCES categories(category_id),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
    CONSTRAINT check_prices CHECK (offer_price <= mrp_price AND offer_price > 0),
    CONSTRAINT check_rating CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_price ON products(offer_price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = TRUE;

COMMENT ON TABLE products IS 'Product catalog master table';
COMMENT ON COLUMN products.dimensions IS 'JSON: {length, width, height, unit}';
COMMENT ON COLUMN products.nutritional_info IS 'JSON: nutritional information per serving';

-- Product Inventory Table
CREATE TABLE product_inventory (
    inventory_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    quantity_available INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    reorder_quantity INTEGER DEFAULT 50,
    last_restocked_at TIMESTAMP,
    next_restock_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE,
    UNIQUE(product_id, store_id),
    CONSTRAINT check_quantities CHECK (
        quantity_available >= 0 AND 
        reserved_quantity >= 0 AND
        reserved_quantity <= quantity_available
    )
);

CREATE INDEX idx_inventory_product ON product_inventory(product_id);
CREATE INDEX idx_inventory_store ON product_inventory(store_id);
CREATE INDEX idx_inventory_available ON product_inventory(quantity_available);
CREATE INDEX idx_inventory_reorder ON product_inventory(store_id, quantity_available) 
    WHERE quantity_available <= reorder_level;

COMMENT ON TABLE product_inventory IS 'Store-wise product inventory';

-- Product Reviews Table
CREATE TABLE product_reviews (
    review_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    rating DECIMAL(2, 1) NOT NULL,
    title VARCHAR(200),
    review_text TEXT,
    images TEXT[],
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT FALSE,
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT check_review_rating CHECK (rating >= 1 AND rating <= 5),
    UNIQUE(product_id, user_id, order_id)
);

CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_user ON product_reviews(user_id);
CREATE INDEX idx_reviews_approved ON product_reviews(is_approved) WHERE is_approved = TRUE;
CREATE INDEX idx_reviews_rating ON product_reviews(rating);

COMMENT ON TABLE product_reviews IS 'Customer product reviews and ratings';

-- =====================================================
-- ORDER SERVICE DATABASE
-- =====================================================

-- Cart Table
CREATE TABLE cart (
    cart_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_addition DECIMAL(10, 2) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    CONSTRAINT check_cart_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_cart_product ON cart(product_id);
CREATE INDEX idx_cart_updated ON cart(updated_at);

COMMENT ON TABLE cart IS 'Shopping cart items';

-- Orders Table
CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    delivery_address_id BIGINT NOT NULL,
    store_id BIGINT,
    
    -- Pricing Details
    subtotal_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    delivery_charges DECIMAL(10, 2) DEFAULT 0.00,
    handling_charges DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    free_cash_used DECIMAL(10, 2) DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    
    -- Payment Details
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_id VARCHAR(100),
    transaction_id VARCHAR(100),
    
    -- Offer Details
    offer_code VARCHAR(50),
    offer_discount DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Delivery Details
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    delivery_partner_id BIGINT,
    delivery_partner_assigned_at TIMESTAMP,
    delivery_otp VARCHAR(6),
    delivery_instructions TEXT,
    
    -- Order Tracking
    confirmed_at TIMESTAMP,
    packed_at TIMESTAMP,
    dispatched_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    cancelled_by VARCHAR(50),
    
    -- Ratings
    rating DECIMAL(2, 1),
    review_text TEXT,
    reviewed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_order_status CHECK (status IN (
        'PENDING', 'CONFIRMED', 'PACKED', 'DISPATCHED', 
        'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED'
    )),
    CONSTRAINT check_payment_status CHECK (payment_status IN (
        'PENDING', 'INITIATED', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIAL_REFUND'
    )),
    CONSTRAINT check_amounts CHECK (
        final_amount >= 0 AND
        subtotal_amount >= 0 AND
        discount_amount >= 0 AND
        free_cash_used >= 0
    ),
    CONSTRAINT check_order_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_delivery_partner ON orders(delivery_partner_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

COMMENT ON TABLE orders IS 'Customer orders master table';
COMMENT ON COLUMN orders.delivery_otp IS 'OTP for delivery verification';

-- Order Items Table
CREATE TABLE order_items (
    order_item_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image_url VARCHAR(500),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    mrp_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_price DECIMAL(10, 2) NOT NULL,
    is_refunded BOOLEAN DEFAULT FALSE,
    refund_amount DECIMAL(10, 2) DEFAULT 0.00,
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT check_order_item_quantity CHECK (quantity > 0),
    CONSTRAINT check_order_item_amounts CHECK (
        total_price >= 0 AND
        unit_price >= 0 AND
        discount_amount >= 0
    )
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

COMMENT ON TABLE order_items IS 'Individual items in each order';

-- Order Status History Table
CREATE TABLE order_status_history (
    history_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    updated_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE INDEX idx_order_history_order ON order_status_history(order_id);
CREATE INDEX idx_order_history_created ON order_status_history(created_at);

COMMENT ON TABLE order_status_history IS 'Audit trail of order status changes';

-- =====================================================
-- PAYMENT SERVICE DATABASE
-- =====================================================

-- Payments Table
CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    payment_gateway VARCHAR(50) NOT NULL,
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    gateway_signature VARCHAR(500),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'INITIATED',
    payment_method VARCHAR(50),
    payment_method_details JSONB,
    error_code VARCHAR(100),
    error_message TEXT,
    webhook_received_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_payment_status CHECK (status IN (
        'INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 
        'CANCELLED', 'REFUND_PENDING', 'REFUNDED'
    )),
    CONSTRAINT check_payment_amount CHECK (amount > 0)
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_gateway_payment ON payments(gateway_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created ON payments(created_at);

COMMENT ON TABLE payments IS 'Payment transactions';
COMMENT ON COLUMN payments.payment_method_details IS 'JSON: card type, last4, bank, UPI ID, etc.';

-- Refunds Table
CREATE TABLE refunds (
    refund_id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    gateway_refund_id VARCHAR(100),
    refund_amount DECIMAL(10, 2) NOT NULL,
    refund_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    reason TEXT,
    processed_by VARCHAR(100),
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id),
    CONSTRAINT check_refund_type CHECK (refund_type IN ('FULL', 'PARTIAL')),
    CONSTRAINT check_refund_status CHECK (status IN (
        'PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'
    )),
    CONSTRAINT check_refund_amount CHECK (refund_amount > 0)
);

CREATE INDEX idx_refunds_payment ON refunds(payment_id);
CREATE INDEX idx_refunds_order ON refunds(order_id);
CREATE INDEX idx_refunds_user ON refunds(user_id);
CREATE INDEX idx_refunds_status ON refunds(status);

COMMENT ON TABLE refunds IS 'Payment refund transactions';

-- Payment Methods Table
CREATE TABLE payment_methods (
    method_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    method_type VARCHAR(50) NOT NULL,
    provider VARCHAR(50),
    card_last4 VARCHAR(4),
    card_brand VARCHAR(50),
    card_expiry_month INTEGER,
    card_expiry_year INTEGER,
    upi_id VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_method_type CHECK (method_type IN (
        'CARD', 'UPI', 'NETBANKING', 'WALLET', 'COD'
    ))
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_default ON payment_methods(user_id, is_default) 
    WHERE is_default = TRUE;

COMMENT ON TABLE payment_methods IS 'Saved user payment methods';

-- Offers Table
CREATE TABLE offers (
    offer_id BIGSERIAL PRIMARY KEY,
    offer_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    offer_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount DECIMAL(10, 2),
    min_order_value DECIMAL(10, 2),
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    usage_limit INTEGER,
    usage_per_user INTEGER DEFAULT 1,
    usage_count INTEGER DEFAULT 0,
    applicable_categories BIGINT[],
    applicable_products BIGINT[],
    applicable_payment_methods VARCHAR(50)[],
    applicable_user_segments VARCHAR(50)[],
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    banner_url VARCHAR(500),
    terms_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_offer_type CHECK (offer_type IN (
        'PERCENTAGE', 'FLAT', 'CASHBACK', 'FREE_DELIVERY', 'BUY_X_GET_Y'
    )),
    CONSTRAINT check_offer_dates CHECK (valid_to > valid_from),
    CONSTRAINT check_discount_value CHECK (discount_value > 0)
);

CREATE INDEX idx_offers_code ON offers(offer_code);
CREATE INDEX idx_offers_active ON offers(is_active, valid_from, valid_to);
CREATE INDEX idx_offers_dates ON offers(valid_from, valid_to);

COMMENT ON TABLE offers IS 'Promotional offers and coupons';

-- Offer Usage Table
CREATE TABLE offer_usage (
    usage_id BIGSERIAL PRIMARY KEY,
    offer_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    discount_applied DECIMAL(10, 2),
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (offer_id) REFERENCES offers(offer_id) ON DELETE CASCADE
);

CREATE INDEX idx_offer_usage_offer ON offer_usage(offer_id);
CREATE INDEX idx_offer_usage_user ON offer_usage(user_id);
CREATE INDEX idx_offer_usage_user_offer ON offer_usage(user_id, offer_id);

COMMENT ON TABLE offer_usage IS 'Track offer usage per user';

-- =====================================================
-- NOTIFICATION SERVICE DATABASE
-- =====================================================

-- Notifications Table
CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    channel VARCHAR(20) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    sent_at TIMESTAMP,
    delivery_status VARCHAR(50) DEFAULT 'PENDING',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_notification_type CHECK (notification_type IN (
        'ORDER_PLACED', 'ORDER_CONFIRMED', 'ORDER_DISPATCHED', 
        'ORDER_DELIVERED', 'ORDER_CANCELLED', 'PAYMENT_SUCCESS',
        'PAYMENT_FAILED', 'REFUND_INITIATED', 'REFUND_COMPLETED',
        'OFFER_AVAILABLE', 'PROMOTIONAL', 'SYSTEM'
    )),
    CONSTRAINT check_priority CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    CONSTRAINT check_channel CHECK (channel IN ('PUSH', 'SMS', 'EMAIL', 'IN_APP'))
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

COMMENT ON TABLE notifications IS 'User notifications across all channels';

-- =====================================================
-- LOCATION SERVICE DATABASE
-- =====================================================

-- Delivery Zones Table
CREATE TABLE delivery_zones (
    zone_id BIGSERIAL PRIMARY KEY,
    zone_name VARCHAR(100) NOT NULL,
    zone_code VARCHAR(50) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincodes TEXT[],
    polygon_coordinates JSONB,
    store_id BIGINT,
    delivery_time_mins INTEGER DEFAULT 7,
    delivery_charges DECIMAL(10, 2) DEFAULT 0.00,
    min_order_value DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_delivery_zones_city ON delivery_zones(city);
CREATE INDEX idx_delivery_zones_store ON delivery_zones(store_id);
CREATE INDEX idx_delivery_zones_active ON delivery_zones(is_active);

COMMENT ON TABLE delivery_zones IS 'Serviceable delivery zones';
COMMENT ON COLUMN delivery_zones.polygon_coordinates IS 'GeoJSON polygon coordinates';

-- Delivery Partners Table
CREATE TABLE delivery_partners (
    partner_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100),
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(50),
    driving_license VARCHAR(50),
    aadhar_number VARCHAR(20),
    photo_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'OFFLINE',
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    last_location_update TIMESTAMP,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_deliveries INTEGER DEFAULT 0,
    successful_deliveries INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_partner_status CHECK (status IN (
        'ONLINE', 'OFFLINE', 'BUSY', 'ON_BREAK'
    )),
    CONSTRAINT check_partner_rating CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX idx_delivery_partners_phone ON delivery_partners(phone_number);
CREATE INDEX idx_delivery_partners_status ON delivery_partners(status);
CREATE INDEX idx_delivery_partners_location ON delivery_partners(current_latitude, current_longitude);
CREATE INDEX idx_delivery_partners_active ON delivery_partners(is_active);

COMMENT ON TABLE delivery_partners IS 'Delivery partner information';

-- =====================================================
-- ANALYTICS & REPORTING TABLES
-- =====================================================

-- User Activity Logs Table
CREATE TABLE user_activity_logs (
    log_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    activity_type VARCHAR(50) NOT NULL,
    activity_details JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    device_type VARCHAR(50),
    page_url VARCHAR(500),
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_type ON user_activity_logs(activity_type);
CREATE INDEX idx_activity_logs_created ON user_activity_logs(created_at);
CREATE INDEX idx_activity_logs_session ON user_activity_logs(session_id);

COMMENT ON TABLE user_activity_logs IS 'Track user activities for analytics';

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM product_reviews
        WHERE product_id = NEW.product_id AND is_approved = TRUE
    ),
    total_ratings = (
        SELECT COUNT(*)
        FROM product_reviews
        WHERE product_id = NEW.product_id AND is_approved = TRUE
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM product_reviews
        WHERE product_id = NEW.product_id AND is_approved = TRUE AND review_text IS NOT NULL
    )
    WHERE product_id = NEW.product_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rating_after_review 
AFTER INSERT OR UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = TRUE THEN
        UPDATE addresses
        SET is_default = FALSE
        WHERE user_id = NEW.user_id 
        AND address_id != NEW.address_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER ensure_default_address 
BEFORE INSERT OR UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION ensure_single_default_address();

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert sample categories
INSERT INTO categories (name, slug, display_order, is_active) VALUES
('Grocery & Kitchen', 'grocery-kitchen', 1, TRUE),
('Snacks & Drinks', 'snacks-drinks', 2, TRUE),
('Beauty & Personal Care', 'beauty-personal-care', 3, TRUE),
('Household Essentials', 'household-essentials', 4, TRUE),
('Fresh Vegetables', 'fresh-vegetables', 5, TRUE),
('Dairy & Eggs', 'dairy-eggs', 6, TRUE),
('Electronics', 'electronics', 7, TRUE),
('Home & Kitchen', 'home-kitchen', 8, TRUE),
('Fashion', 'fashion', 9, TRUE),
('Pharmacy', 'pharmacy', 10, TRUE);

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- View: Daily Order Statistics
CREATE OR REPLACE VIEW daily_order_stats AS
SELECT 
    DATE(created_at) as order_date,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN status = 'DELIVERED' THEN 1 END) as delivered_orders,
    COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelled_orders,
    SUM(final_amount) as total_revenue,
    AVG(final_amount) as average_order_value,
    AVG(EXTRACT(EPOCH FROM (delivered_at - created_at))/60) as avg_delivery_time_mins
FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- View: Product Performance
CREATE OR REPLACE VIEW product_performance AS
SELECT 
    p.product_id,
    p.name,
    p.category_id,
    c.name as category_name,
    COUNT(DISTINCT oi.order_id) as times_ordered,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.total_price) as total_revenue,
    p.rating,
    p.total_ratings
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN categories c ON p.category_id = c.category_id
GROUP BY p.product_id, p.name, p.category_id, c.name, p.rating, p.total_ratings
ORDER BY total_revenue DESC NULLS LAST;

-- View: User Order Summary
CREATE OR REPLACE VIEW user_order_summary AS
SELECT 
    u.user_id,
    u.name,
    u.phone_number,
    u.email,
    COUNT(o.order_id) as total_orders,
    SUM(CASE WHEN o.status = 'DELIVERED' THEN 1 ELSE 0 END) as completed_orders,
    SUM(o.final_amount) as lifetime_value,
    AVG(o.final_amount) as average_order_value,
    MAX(o.created_at) as last_order_date,
    u.created_at as registration_date
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.name, u.phone_number, u.email, u.created_at;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
