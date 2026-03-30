import { SolarTime } from 'tyme4ts';
/**
 * Get SolarTime object by ISO datetime string.
 * @param isoDate Solar time string in ISO format.
 * @returns {SolarTime}
 */
export declare const getSolarTime: (isoDate: string) => SolarTime;
export declare const today: () => string;
export declare function formatSolarTime(solarTime: SolarTime): string;
