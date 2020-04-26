# Abstract Design

This section of the documentation describes the game in markety terms and uses more vague terminology.

It is to be thought of as the guiding principle for deriving the solid game mechanics.

## Section 1: Introduction

The first section covers the most basic elements that make up the game and then uses those to build the core RPG elements.

### Entity
*Article [entity](entity.md)*

An [entity](entity.md) is an object that exists in space. It is really just an empty container that has a location.

Entities also must have physical properties, however these are not determined by the player but rather by the components that make up the entity.

### Components

Entity components attach to entities and give them additional behaviour. Components can have user configurable properties and should stack and work with one another when attached to the same entity where applicable.

#### Character

Initializing an entity with a [character](character.md) gives it a stat engine and a locomotion system.

Characters are also able to accept [Drivers](driver.md)


