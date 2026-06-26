/// <reference types="vite/client" />

interface WindowEventMap {
  'farm-snapshot': CustomEvent<import('./game/types/snapshot').FarmSnapshot>;
}
