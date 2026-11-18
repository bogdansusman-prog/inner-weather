import type { Weather } from '../../api/checkins';
import type { TextKey } from '../../i18n/en';

// textul fiecarei vremi in dictionar
export const WEATHER_TEXT: Record<Weather, TextKey> = {
  SUNNY: 'weather.sunny',
  STORMY: 'weather.stormy',
  CALM: 'weather.calm',
  FOGGY: 'weather.foggy',
};
