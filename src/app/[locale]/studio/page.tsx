'use client';

import { useState, useEffect } from 'react';
import { PageTransition } from '@/components/ui/page-transition';
import { FabricSelector, type Fabric } from '@/components/studio/fabric-selector';
import {
  PersonalizationPicker,
  type Personalization,
} from '@/components/studio/personalization-picker';
import { ThobePreview } from '@/components/studio/thobe-preview';
import { StickyBottomBar } from '@/components/studio/sticky-bottom-bar';
import { createClient } from '@/lib/supabase/client';

// Mock data matching seed.sql structure - used as fallback
const mockFabrics: Fabric[] = [
  {
    id: 'fab-eco-1',
    tier: 'economy',
    name_ar: '\u0642\u0637\u0646 \u0645\u0635\u0631\u064a',
    name_en: 'Egyptian Cotton',
    description_ar: '\u0642\u0645\u0627\u0634 \u0642\u0637\u0646\u064a \u0645\u0631\u064a\u062d \u0648\u0645\u062a\u064a\u0646 \u0644\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u064a\u0648\u0645\u064a',
    description_en: 'Comfortable and durable cotton fabric for everyday wear',
    price: 15000,
    swatch_url: null,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'fab-eco-2',
    tier: 'economy',
    name_ar: '\u0628\u0648\u0644\u064a\u0633\u062a\u0631 \u0645\u062e\u0644\u0648\u0637',
    name_en: 'Poly-Blend',
    description_ar: '\u0642\u0645\u0627\u0634 \u062e\u0641\u064a\u0641 \u0648\u0645\u0642\u0627\u0648\u0645 \u0644\u0644\u062a\u062c\u0627\u0639\u064a\u062f',
    description_en: 'Lightweight and wrinkle-resistant blend',
    price: 12000,
    swatch_url: null,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'fab-mid-1',
    tier: 'mid',
    name_ar: '\u062c\u0627\u0643\u0627\u0631 \u064a\u0627\u0628\u0627\u0646\u064a',
    name_en: 'Japanese Jacquard',
    description_ar: '\u0646\u0633\u064a\u062c \u064a\u0627\u0628\u0627\u0646\u064a \u0641\u0627\u062e\u0631 \u0628\u062a\u0641\u0627\u0635\u064a\u0644 \u0645\u0646\u0642\u0648\u0634\u0629 \u062f\u0642\u064a\u0642\u0629',
    description_en: 'Premium Japanese jacquard with subtle woven patterns',
    price: 25000,
    swatch_url: null,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'fab-mid-2',
    tier: 'mid',
    name_ar: '\u0642\u0637\u0646 \u0633\u0648\u0628\u064a\u0645\u0627',
    name_en: 'Supima Cotton',
    description_ar: '\u0623\u062c\u0648\u062f \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0642\u0637\u0646 \u0627\u0644\u0623\u0645\u0631\u064a\u0643\u064a \u0628\u0645\u0644\u0645\u0633 \u062d\u0631\u064a\u0631\u064a',
    description_en: 'Finest American cotton with a silky feel',
    price: 28000,
    swatch_url: null,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'fab-prm-1',
    tier: 'premium',
    name_ar: '\u0642\u0645\u0627\u0634 \u0625\u064a\u0637\u0627\u0644\u064a \u0641\u0627\u062e\u0631',
    name_en: 'Italian Luxury Wool',
    description_ar: '\u0635\u0648\u0641 \u0625\u064a\u0637\u0627\u0644\u064a \u0641\u0627\u062e\u0631 \u062e\u0641\u064a\u0641 \u0627\u0644\u0648\u0632\u0646 \u0628\u0644\u0645\u0639\u0629 \u0637\u0628\u064a\u0639\u064a\u0629',
    description_en: 'Lightweight Italian luxury wool with natural sheen',
    price: 45000,
    swatch_url: null,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'fab-prm-2',
    tier: 'premium',
    name_ar: '\u0643\u062a\u0627\u0646 \u0628\u0644\u062c\u064a\u0643\u064a',
    name_en: 'Belgian Linen',
    description_ar: '\u0643\u062a\u0627\u0646 \u0628\u0644\u062c\u064a\u0643\u064a \u0641\u0627\u062e\u0631 \u062e\u0641\u064a\u0641 \u0648\u0645\u0633\u0627\u0645\u064a',
    description_en: 'Premium Belgian linen, light and breathable',
    price: 42000,
    swatch_url: null,
    is_active: true,
    sort_order: 2,
  },
];

const mockPersonalizations: Personalization[] = [
  {
    id: 'pers-std',
    level: 'standard',
    name_ar: '\u0623\u0633\u0627\u0633\u064a',
    name_en: 'Standard',
    description_ar: '\u062a\u0641\u0635\u064a\u0644 \u0623\u0633\u0627\u0633\u064a \u0628\u0645\u0648\u0627\u0635\u0641\u0627\u062a \u0642\u064a\u0627\u0633\u064a\u0629',
    description_en: 'Basic tailoring with standard specifications',
    price: 0,
    features: [
      { key: 'standard_collar', label_ar: '\u064a\u0627\u0642\u0629 \u0643\u0644\u0627\u0633\u064a\u0643\u064a\u0629', label_en: 'Classic collar' },
      { key: 'standard_cuffs', label_ar: '\u0623\u0643\u0645\u0627\u0645 \u0639\u0627\u062f\u064a\u0629', label_en: 'Standard cuffs' },
      { key: 'standard_buttons', label_ar: '\u0623\u0632\u0631\u0627\u0631 \u0628\u064a\u0636\u0627\u0621', label_en: 'White buttons' },
    ],
    is_active: true,
  },
  {
    id: 'pers-enh',
    level: 'enhanced',
    name_ar: '\u0645\u062d\u0633\u0651\u0646',
    name_en: 'Enhanced',
    description_ar: '\u062a\u0641\u0635\u064a\u0644 \u0645\u062d\u0633\u0651\u0646 \u0645\u0639 \u062e\u064a\u0627\u0631\u0627\u062a \u0625\u0636\u0627\u0641\u064a\u0629 \u0644\u0644\u064a\u0627\u0642\u0629 \u0648\u0627\u0644\u0623\u0643\u0645\u0627\u0645',
    description_en: 'Enhanced tailoring with collar and cuff upgrades',
    price: 5000,
    features: [
      { key: 'standard_collar', label_ar: '\u064a\u0627\u0642\u0629 \u0643\u0644\u0627\u0633\u064a\u0643\u064a\u0629', label_en: 'Classic collar' },
      { key: 'standard_cuffs', label_ar: '\u0623\u0643\u0645\u0627\u0645 \u0639\u0627\u062f\u064a\u0629', label_en: 'Standard cuffs' },
      { key: 'standard_buttons', label_ar: '\u0623\u0632\u0631\u0627\u0631 \u0628\u064a\u0636\u0627\u0621', label_en: 'White buttons' },
      { key: 'enhanced_collar', label_ar: '\u064a\u0627\u0642\u0629 \u0645\u0637\u0631\u0651\u0632\u0629', label_en: 'Embroidered collar' },
      { key: 'enhanced_cuffs', label_ar: '\u0623\u0643\u0645\u0627\u0645 \u0641\u0631\u0646\u0633\u064a\u0629', label_en: 'French cuffs' },
      { key: 'premium_buttons', label_ar: '\u0623\u0632\u0631\u0627\u0631 \u0635\u062f\u0641', label_en: 'Mother-of-pearl buttons' },
    ],
    is_active: true,
  },
  {
    id: 'pers-fc',
    level: 'full_custom',
    name_ar: '\u062a\u0641\u0635\u064a\u0644 \u0643\u0627\u0645\u0644',
    name_en: 'Full Custom',
    description_ar: '\u062a\u0641\u0635\u064a\u0644 \u0643\u0627\u0645\u0644 \u0645\u0639 \u062a\u0637\u0631\u064a\u0632 \u064a\u062f\u0648\u064a \u0648\u0643\u0644 \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644 \u062d\u0633\u0628 \u0637\u0644\u0628\u0643',
    description_en: 'Full custom tailoring with hand embroidery and all details to your specification',
    price: 15000,
    features: [
      { key: 'standard_collar', label_ar: '\u064a\u0627\u0642\u0629 \u0643\u0644\u0627\u0633\u064a\u0643\u064a\u0629', label_en: 'Classic collar' },
      { key: 'standard_cuffs', label_ar: '\u0623\u0643\u0645\u0627\u0645 \u0639\u0627\u062f\u064a\u0629', label_en: 'Standard cuffs' },
      { key: 'standard_buttons', label_ar: '\u0623\u0632\u0631\u0627\u0631 \u0628\u064a\u0636\u0627\u0621', label_en: 'White buttons' },
      { key: 'enhanced_collar', label_ar: '\u064a\u0627\u0642\u0629 \u0645\u0637\u0631\u0651\u0632\u0629', label_en: 'Embroidered collar' },
      { key: 'enhanced_cuffs', label_ar: '\u0623\u0643\u0645\u0627\u0645 \u0641\u0631\u0646\u0633\u064a\u0629', label_en: 'French cuffs' },
      { key: 'premium_buttons', label_ar: '\u0623\u0632\u0631\u0627\u0631 \u0635\u062f\u0641', label_en: 'Mother-of-pearl buttons' },
      { key: 'hand_embroidery', label_ar: '\u062a\u0637\u0631\u064a\u0632 \u064a\u062f\u0648\u064a', label_en: 'Hand embroidery' },
      { key: 'monogram', label_ar: '\u062d\u0631\u0648\u0641 \u0645\u0648\u0646\u0648\u063a\u0631\u0627\u0645', label_en: 'Monogram initials' },
      { key: 'custom_lining', label_ar: '\u0628\u0637\u0627\u0646\u0629 \u0645\u062e\u0635\u0635\u0629', label_en: 'Custom lining' },
    ],
    is_active: true,
  },
];

export default function StudioPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>(mockFabrics);
  const [personalizations, setPersonalizations] =
    useState<Personalization[]>(mockPersonalizations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();

        const [fabricsRes, personalizationsRes] = await Promise.all([
          supabase
            .from('fabrics')
            .select('*')
            .eq('is_active', true)
            .order('sort_order'),
          supabase
            .from('personalizations')
            .select('*')
            .eq('is_active', true),
        ]);

        if (fabricsRes.data && fabricsRes.data.length > 0) {
          setFabrics(fabricsRes.data as unknown as Fabric[]);
        }
        if (personalizationsRes.data && personalizationsRes.data.length > 0) {
          setPersonalizations(personalizationsRes.data as unknown as Personalization[]);
        }
      } catch (error) {
        // Supabase not connected - fall back to mock data (already set)
        console.warn('Using mock data: Supabase not available', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pb-28">
        <ThobePreview />
        <FabricSelector fabrics={fabrics} />
        <PersonalizationPicker personalizations={personalizations} />
        <StickyBottomBar />
      </div>
    </PageTransition>
  );
}
