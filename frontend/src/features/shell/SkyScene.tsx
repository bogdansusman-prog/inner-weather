import type { Weather } from '../../api/checkins';
import Clouds from '../../sky/Clouds';
import Rain from '../../sky/Rain';
import './sky-scene.css';

type Props = {
  weather: Weather | null; // vremea check-in-ului de azi; null = inca nu s-a facut
};

// norii, dupa vremea de azi
const CLOUD_TONE: Record<Weather, 'calm' | 'fog' | 'storm'> = {
  SUNNY: 'calm',
  CALM: 'calm',
  FOGGY: 'fog',
  STORMY: 'storm',
};

// Cerul din spatele paginilor: soarele (sau luna) care isi schimba locul de la o pagina la alta,
// nori in straturi si vremea de azi (raze, ceata, ploaie). Stele cazatoare noaptea.
// Doar decor: nu se poate da click pe nimic si cititoarele de ecran il ignora.
export default function SkyScene({ weather }: Props) {
  return (
    <div className="scene" data-weather={weather ?? 'NONE'} aria-hidden="true">
      {/* soarele si luna stau in acelasi loc; CSS-ul arata unul sau altul, dupa pagina si tema */}
      <div className="scene__body">
        <span className="scene__rays" />
        <span className="scene__sun" />
        <span className="scene__moon" />
      </div>

      <Clouds tone={weather ? CLOUD_TONE[weather] : 'calm'} />

      {weather === 'FOGGY' && (
        <>
          <span className="scene__mist scene__mist--low" />
          <span className="scene__mist scene__mist--high" />
        </>
      )}

      {weather === 'STORMY' && (
        <>
          <span className="scene__dim" />
          <Rain intensity={0.35} wind={-1.5} glass={false} />
        </>
      )}

      {/* stele cazatoare: se vad doar noaptea */}
      <span className="scene__meteor scene__meteor--one" />
      <span className="scene__meteor scene__meteor--two" />
    </div>
  );
}
