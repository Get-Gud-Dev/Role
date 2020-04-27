## Entity Model
*return to [Abstract Design](../README.md)*


An [entity](entity.md) is an object that exists in space. It is really just an empty container that has a location.

Entities also must have [physical properties](../mechanics/physical-properties.md), however these are not determined by the player but rather by the components that make up the entity.


## Components

Entity components attach to entities and give them additional behaviour. Components can have user configurable properties and should stack and work with one another when attached to the same entity where applicable.

### Complete listing of Components

| Component | Use |
| --------- | --- |
| [Character](components/character.md) | Initializing an entity with a character gives it [stats](../mechanics/stats.md), [imperitives](../mechanics/imperitives.md), the ability to take [actions](../mechanics/actions.md) and a locomotion system. |
|[Description](../components/description.md) | The description component configures the top level description of an entity, the first thing you see about it. |
| [Details](components/details.md) | Details allow you to add small tagged descriptions to your entity.|
| [Text](components/text.md) | Text components offer a much larger canvas to write on and can be used for long inscriptions, book texts, and other long format forms of expression. |
| [Vehicle](components/vehicle.md) | Vehicles require an [Engine](components/engine.md) which requires Fuel. |
| [Engine](components/engine.md) | Engines provide torque that give force to vehicles. |
| [Container](components/container.md) | Containers hold things. The largest dimension that can fit inside of it is determined by the smallest dimension of the container and that there is enough volume in the container to hold it. |
| Weapon | Weapons may be usable in different ways to deal [different types](mechanics/damage-types.md) of damage or rely on different [skills](mechanics/skills.md). |
