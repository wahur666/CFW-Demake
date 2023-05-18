# Roadmap

## Game

- Create different type of units
  - Fighter (Corvette)
  - Harvester
  - Builder (Fabricator)
- Create resources
  - Ore
  - Gas
- Add planets
  - Fabricator can build on planets
- Harvester can gather resources

## Map Editor

- Make selection work for different objects
- Add more selections
  - Barrier
  - Debris
  - Black hole
- Add second layer for nebula modifier, where the ships are slower


## Pathfinding

Create a sector map, where there is a weighted matrix for each wormhole with the distance from all the positions.
When navigation starts, we calculate from the best range to the least range, the ideal position.
When somebody at the designated place, set waiting for jump to true, and check everybody else in the move order.

