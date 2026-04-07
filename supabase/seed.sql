-- Seed fabrics
INSERT INTO public.fabrics (id, tier, name_ar, name_en, description_ar, description_en, price, swatch_url, is_active, sort_order)
VALUES
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'economy',
    'قطن مصري',
    'Egyptian Cotton',
    'قطن مصري ناعم ومريح، مثالي للاستخدام اليومي. خامة متينة تتحمل الغسيل المتكرر مع الحفاظ على نعومتها.',
    'Soft and comfortable Egyptian cotton, ideal for everyday wear. Durable fabric that withstands frequent washing while maintaining its softness.',
    15000,
    '/images/fabrics/egyptian-cotton.webp',
    true,
    1
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'mid',
    'قطن سويسري',
    'Swiss Cotton',
    'قطن سويسري فاخر بنسيج محكم ولمعة طبيعية. يتميز بخفة الوزن والتهوية الممتازة المناسبة لمناخ المملكة.',
    'Premium Swiss cotton with a tight weave and natural sheen. Lightweight with excellent breathability suited for the Saudi climate.',
    25000,
    '/images/fabrics/swiss-cotton.webp',
    true,
    2
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'premium',
    'حرير ياباني',
    'Japanese Silk',
    'حرير ياباني فائق النعومة مع لمسة حريرية فاخرة. أرقى الخامات المتوفرة — للمناسبات الخاصة والإطلالات المميزة.',
    'Ultra-soft Japanese silk with a luxurious silky touch. The finest fabric available — for special occasions and distinguished appearances.',
    45000,
    '/images/fabrics/japanese-silk.webp',
    true,
    3
  );

-- Seed personalizations
INSERT INTO public.personalizations (id, level, name_ar, name_en, description_ar, description_en, price, features, is_active)
VALUES
  (
    'b2c3d4e5-0001-4000-8000-000000000001',
    'standard',
    'أساسي',
    'Standard',
    'تفصيل أساسي بياقة وأزرار قياسية. تنفيذ نظيف ومتقن بأسعار معقولة.',
    'Standard tailoring with classic collar and buttons. Clean, precise execution at an affordable price.',
    0,
    '["ياقة كلاسيكية", "أزرار قياسية", "أكمام عادية", "خياطة أساسية"]',
    true
  ),
  (
    'b2c3d4e5-0002-4000-8000-000000000002',
    'enhanced',
    'مُحسَّن',
    'Enhanced',
    'تفصيل محسّن مع خيارات ياقة متعددة وأزرار مميزة وتطريز بسيط. جودة أعلى في التفاصيل.',
    'Enhanced tailoring with multiple collar options, premium buttons, and subtle embroidery. Higher quality in the details.',
    5000,
    '["اختيار نوع الياقة", "أزرار مميزة", "تطريز بسيط", "أكمام فرنسية", "خياطة مزدوجة"]',
    true
  ),
  (
    'b2c3d4e5-0003-4000-8000-000000000003',
    'full_custom',
    'مخصص بالكامل',
    'Full Custom',
    'تفصيل مخصص بالكامل — تحكم كامل في كل تفصيلة من الياقة إلى الأزرار والتطريز والبطانة. أعلى مستوى من الحرفية.',
    'Fully customized tailoring — complete control over every detail from collar to buttons, embroidery, and lining. The highest level of craftsmanship.',
    12000,
    '["تصميم ياقة مخصص", "أزرار فاخرة", "تطريز اسم/شعار", "أكمام فرنسية أو مانشيت", "بطانة داخلية فاخرة", "خياطة يدوية", "جيب داخلي"]',
    true
  );
