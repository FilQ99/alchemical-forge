export const RESOURCES = {
  essence: { name: 'Surowa Esencja', icon: 'icon-essence.svg' },
  fire: { name: 'Ogień', icon: 'icon-resource-fire.svg' },
  water: { name: 'Woda', icon: 'icon-resource-water.svg' },
  earth: { name: 'Ziemia', icon: 'icon-resource-earth.svg' },
  air: { name: 'Powietrze', icon: 'icon-resource-air.svg' },
  iron: { name: 'Żelazo', icon: 'icon-resource-iron.svg' },
  knowledge: { name: 'Wiedza', icon: 'icon-scroll.svg' },
  quintessence: { name: 'Kwintesencja', icon: 'icon-vortex.svg' },
};

export const GENERATORS = {
  drain: { 
    name: 'Dren Esencji', 
    baseCost: { essence: 15 }, 
    production: { essence: 1 }, 
    icon: 'icon-generator-essence.svg' 
  },
  alchemist: { 
    name: 'Młody Alchemik', 
    baseCost: { essence: 100 }, 
    production: { fire: 0.5, water: 0.5 },
    icon: 'icon-flask.svg' 
  },
  researchDesk: {
    name: 'Stół Badawczy',
    baseCost: { essence: 1000, iron: 20 },
    production: { knowledge: 0.2 },
    icon: 'icon-book.svg'
  }
};

export const RECIPES = {
  transmuteFire: { name: "Transmutuj Ogień", cost: { essence: 100 }, result: { fire: 10 }, type: 'transmutation'},
  transmuteWater: { name: "Transmutuj Wodę", cost: { essence: 100 }, result: { water: 10 }, type: 'transmutation' },
  transmuteEarth: { name: "Transmutuj Ziemię", cost: { essence: 100 }, result: { earth: 10 }, type: 'transmutation' },
  transmuteAir: { name: "Transmutuj Powietrze", cost: { essence: 100 }, result: { air: 10 }, type: 'transmutation' },
  craftIron: { name: "Wytop Żelazo", cost: { fire: 10, earth: 10 }, result: { iron: 1 }, type: 'crafting' },
  philosophersStone: { name: "Stwórz Kamień Filozoficzny", cost: { iron: 10000, knowledge: 5000, fire: 50000, water: 50000 }, result: {}, type: 'final' }
};

export const RESEARCH = {
  efficientTransmutation: {
    name: 'Wydajna Transmutacja',
    description: 'Zyskujesz 10% więcej żywiołów z każdej transmutacji.',
    cost: { knowledge: 50 },
    requires: [],
  },
  betterDrains: {
    name: 'Lepsze Dreny',
    description: 'Dreny Esencji produkują 100% więcej.',
    cost: { knowledge: 100 },
    requires: ['efficientTransmutation'],
  },
  empoweredClicks: {
    name: 'Wzmocnione Kliknięcia',
    description: 'Każde kliknięcie daje +1 Esencji za każde 10 posiadanych generatorów (wszystkich typów).',
    cost: { knowledge: 250 },
    requires: ['betterDrains'],
  }
};

export const PRESTIGE_UPGRADES = {
  eternalFlame: {
    name: 'Wieczny Płomień',
    description: 'Zwiększa całą produkcję Esencji o 10% za każdy poziom.',
    cost: 1,
    maxLevel: 10,
  }
}