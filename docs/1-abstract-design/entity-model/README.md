## Entity Model
*return to [Game Mechanics](README.md)*


An [entity](entity.md) is an object that exists in space. It is really just an empty container that has a location.

Entities also must have [physical properties](../mechanics/physical-properties.md), however these are not determined by the player but rather by the components that make up the entity.

**Negative space** is the amount of space an entity is allowed to use as a container. This is expressed as a percentage of the total volume and it is limited by the following factors:


## Components

Entity components attach to entities and give them additional behaviour. Components can have user configurable properties and should stack and work with one another when attached to the same entity where applicable.

### Major examples of components

#### Character

Initializing an entity with a [character](../components/character.md) gives it [stats](../mechanics/stats.md), [imperitives](../mechanics/imperitives.md), the ability to take [actions](../mechanics/actions.md) and a locomotion system.

Characters are participants in [Community](../mechanics/community.md)


Characters are also able to accept [Drivers](../components/driver.md)

#### Description, Details, Text

The [description](../components/description.md) component configures the top level description of an entity, the first thing you see about it. [Details](../components/detail.md) allow you to add small tagged descriptions to your entity.

[Text](../components/text.md) components offer a much larger canvas to write on and can be used for long inscriptions, book texts, and other long format forms of expression.

#### Vehicle, Engine

[Vehicles](components/vehicle.md) and [Engines](components/engine.md) are a means of creating fueled transport. Characters and vehicles mix however vehicular travel relies on some kind of engine and that engine relies on some kind of fuel and this must be considered.

Horses would be a fine example of an appropriate vehicular character.

#### Container

[Containers](components/container.md) hold things. The largest dimension that can fit inside of it is determined by the smallest dimension of the container and that there is enough volume in the container to hold it.

#### Weapon

Weapons may be usable in different ways to deal [different types](mechanics/damage-types.md) of damage or rely on different [skills](mechanics/skills.md).