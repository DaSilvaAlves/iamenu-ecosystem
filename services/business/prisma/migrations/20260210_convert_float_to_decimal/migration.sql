-- Sprint 1 Task 1.2: Convert Float to Decimal for Financial Safety

-- Restaurant table: monthlyCosts, averageTicket
ALTER TABLE "business"."restaurants"
  ALTER COLUMN "monthlyCosts" TYPE DECIMAL(12,2) USING ROUND("monthlyCosts"::NUMERIC, 2),
  ALTER COLUMN "averageTicket" TYPE DECIMAL(10,2) USING ROUND("averageTicket"::NUMERIC, 2);

-- RestaurantSettings table: revenueGoal, foodCostTarget
ALTER TABLE "business"."restaurant_settings"
  ALTER COLUMN "revenueGoal" TYPE DECIMAL(12,2) USING ROUND("revenueGoal"::NUMERIC, 2),
  ALTER COLUMN "foodCostTarget" TYPE DECIMAL(5,2) USING ROUND("foodCostTarget"::NUMERIC, 2);

-- Product table: price, cost, totalRevenue
ALTER TABLE "business"."products"
  ALTER COLUMN "price" TYPE DECIMAL(10,2) USING ROUND("price"::NUMERIC, 2),
  ALTER COLUMN "cost" TYPE DECIMAL(10,2) USING ROUND("cost"::NUMERIC, 2),
  ALTER COLUMN "totalRevenue" TYPE DECIMAL(12,2) USING ROUND("totalRevenue"::NUMERIC, 2);

-- Order table: total
ALTER TABLE "business"."orders"
  ALTER COLUMN "total" TYPE DECIMAL(12,2) USING ROUND("total"::NUMERIC, 2);

-- OrderItem table: priceAtTime, costAtTime
ALTER TABLE "business"."order_items"
  ALTER COLUMN "priceAtTime" TYPE DECIMAL(10,2) USING ROUND("priceAtTime"::NUMERIC, 2),
  ALTER COLUMN "costAtTime" TYPE DECIMAL(10,2) USING ROUND("costAtTime"::NUMERIC, 2);

-- DailyStats table: revenue, avgTicket, foodCostPct
ALTER TABLE "business"."daily_stats"
  ALTER COLUMN "revenue" TYPE DECIMAL(12,2) USING ROUND("revenue"::NUMERIC, 2),
  ALTER COLUMN "avgTicket" TYPE DECIMAL(10,2) USING ROUND("avgTicket"::NUMERIC, 2),
  ALTER COLUMN "foodCostPct" TYPE DECIMAL(5,2) USING ROUND("foodCostPct"::NUMERIC, 2);
