export type TechPropertyKey =
  | 'beadLength'
  | 'bodyVolume'
  | 'bucketCapacity'
  | 'boomLiftingCapacity'
  | 'carryingCapacity'
  | 'bodyCapacity'
  | 'diggingDepth'
  | 'diggingHeight'
  | 'enginePower'
  | 'frontBucketCapacity'
  | 'netEnginePower'
  | 'liftingHeight'
  | 'maximumReachArrow'
  | 'ogee'
  | 'rearBucketCapacity'
  | 'turningRadius'
  | 'turnRadius'
  | 'weight'
  | 'boomLength'
  | 'minimumReach'
  | 'maximumReach';

export const propertyLabels: Record<TechPropertyKey, string> = {
  beadLength: 'Длина борта, м',
  bodyVolume: 'Объем кузова, м3',
  bucketCapacity: 'Объём ковша, м3',
  boomLiftingCapacity: 'Грузоподъемность стрелы, тонн',
  carryingCapacity: 'Грузоподъемность, тонн',
  bodyCapacity: 'Грузоподъемность кузова, тонн',
  diggingDepth: 'Максимальная глубина копания, м',
  diggingHeight: 'Высота копания, м',
  enginePower: 'Мощность двигателя, л.с.',
  frontBucketCapacity: 'Объем переднего ковша, м3',
  netEnginePower: 'Полезная мощность двигателя, кВт',
  liftingHeight: 'Высота выгрузки, м',
  maximumReachArrow: 'Максимальный вылет стрелы, м',
  ogee: 'Гусек, м',
  rearBucketCapacity: 'Объем заднего ковша, м3',
  turningRadius: 'Радиус поворота, м',
  turnRadius: 'Радиус поворота, м',
  weight: 'Эксплуатационная масса, кг',
  boomLength: 'Длина стрелы, м',
  minimumReach: 'Грузоподъемность на минимальном вылете, т/м',
  maximumReach: 'Грузоподъемность на максимальном вылете, т/м',
};

export interface EquipmentItem {
  id: string;
  title: string;
  img: string;
  link: string;
  price: number;
  props: Partial<Record<TechPropertyKey, string>>;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  urlSlug: string;
  properties: TechPropertyKey[];
  items: EquipmentItem[];
}
