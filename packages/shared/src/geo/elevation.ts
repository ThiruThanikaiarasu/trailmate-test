import type { RoutePoint } from '../types';

export interface ElevationProfile {
  gainM: number;
  lossM: number;
  highestM: number | null;
  lowestM: number | null;
}

/**
 * Cumulative climb and descent along a route. Changes smaller than `noiseThresholdM`
 * are accumulated until they exceed it, which filters out GPS jitter on flat ground.
 */
export function elevationProfile(points: readonly RoutePoint[], noiseThresholdM = 3): ElevationProfile {
  const elevations = points
    .map((p) => p.elevationM)
    .filter((e): e is number => typeof e === 'number' && Number.isFinite(e));

  if (elevations.length === 0) {
    return { gainM: 0, lossM: 0, highestM: null, lowestM: null };
  }

  let gain = 0;
  let loss = 0;
  let reference = elevations[0];
  for (const elevation of elevations.slice(1)) {
    const delta = elevation - reference;
    if (Math.abs(delta) >= noiseThresholdM) {
      if (delta > 0) gain += delta;
      else loss -= delta;
      reference = elevation;
    }
  }

  return {
    gainM: Math.round(gain),
    lossM: Math.round(loss),
    highestM: Math.max(...elevations),
    lowestM: Math.min(...elevations),
  };
}
