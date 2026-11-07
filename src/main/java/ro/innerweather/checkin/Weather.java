package ro.innerweather.checkin;

public enum Weather {
    SUNNY, STORMY, CALM, FOGGY;

    public static Weather of(double energy, double pleasantness) {
        if (energy >= 0) {
            return pleasantness >= 0 ? SUNNY : STORMY;
        }
        return pleasantness >= 0 ? CALM : FOGGY;
    }
}