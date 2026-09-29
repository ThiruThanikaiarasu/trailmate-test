import { loadConfig } from '../src/config';
import { openDatabase } from '../src/db/database';
import { createServices } from '../src/services';
import { systemClock, randomToken } from '../src/clock';

const config = loadConfig();
const db = openDatabase(config.databaseFile);
const services = createServices({
  db,
  clock: systemClock,
  newToken: randomToken,
  share: { publicBaseUrl: config.publicBaseUrl, defaultTtlHours: config.defaultShareTtlHours },
});

const trip = services.trips.create({
  name: 'Karwendel Hut-to-Hut',
  region: 'Tirol, Austria',
  startDate: '2026-07-03',
  endDate: '2026-07-06',
  ownerName: 'Maya',
});
const jonas = services.participants.add(trip.id, { name: 'Jonas', email: 'jonas@example.com' });
services.participants.add(trip.id, { name: 'Priya' });

const day1 = services.itinerary.addDay(trip.id, { title: 'Scharnitz to Karwendelhaus' });
for (const waypoint of [
  { name: 'Scharnitz', lat: 47.3886, lon: 11.2645, elevationM: 964 },
  { name: 'Larchetalm', lat: 47.4124, lon: 11.3349, elevationM: 1173 },
  { name: 'Karwendelhaus', lat: 47.4237, lon: 11.4062, elevationM: 1771 },
]) {
  services.itinerary.addWaypoint(day1.id, waypoint);
}
const day2 = services.itinerary.addDay(trip.id, { title: 'Karwendelhaus to Falkenhütte' });
for (const waypoint of [
  { name: 'Karwendelhaus', lat: 47.4237, lon: 11.4062, elevationM: 1771 },
  { name: 'Kleiner Ahornboden', lat: 47.4366, lon: 11.4528, elevationM: 1403 },
  { name: 'Falkenhütte', lat: 47.4415, lon: 11.5172, elevationM: 1848 },
]) {
  services.itinerary.addWaypoint(day2.id, waypoint);
}

for (const item of [
  { name: 'Hut sleeping bag liner', category: 'sleep' as const, weightGrams: 140 },
  { name: 'Rain jacket', category: 'clothing' as const, weightGrams: 310 },
  { name: 'Water bottle 1 l', category: 'water' as const, weightGrams: 180, quantity: 2 },
  { name: 'Map Kompass 026', category: 'other' as const, weightGrams: 90 },
  { name: 'Headlamp', category: 'electronics' as const, weightGrams: 75 },
  { name: 'Blister kit', category: 'first-aid' as const, weightGrams: 60 },
]) {
  services.gear.add(trip.id, item);
}

services.expenses.add(trip.id, { description: 'Train to Scharnitz', amountCents: 8640, paidBy: jonas.id });

console.log(`Seeded trip ${trip.id}. Start the API with "npm run dev:api" and open the web app.`);
db.close();
