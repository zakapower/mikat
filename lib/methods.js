import { CalculationMethod, Madhab } from '../vendor/adhan.js'

export const DEFAULT_METHOD_ID = 'MWL'

export const METHOD_OPTIONS = [
  { id: 'MWL', labelRu: 'Muslim World League' },
  { id: 'Egyptian', labelRu: 'Egyptian General Authority' },
  { id: 'UmmAlQura', labelRu: 'Umm al-Qura' },
  { id: 'Karachi', labelRu: 'University of Islamic Sciences, Karachi' },
  { id: 'ISNA', labelRu: 'ISNA (North America)' },
]

export function buildParams(methodId, asrMadhab) {
  const factories = {
    MWL: () => CalculationMethod.MuslimWorldLeague(),
    Egyptian: () => CalculationMethod.Egyptian(),
    UmmAlQura: () => CalculationMethod.UmmAlQura(),
    Karachi: () => CalculationMethod.Karachi(),
    ISNA: () => CalculationMethod.NorthAmerica(),
  }
  const params = (factories[methodId] || factories.MWL)()
  params.madhab = asrMadhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi
  return params
}
