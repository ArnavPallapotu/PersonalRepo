---
layout: post 
title: OOP Breakout Lesson 1 notes
author: Aditya
permalink: oopbreakoutnote1
---
## OOP Breakout Lesson 1 Summary

**Key Concepts:**

- **Inheritance:** Classes can reuse and extend behavior from a parent class. In the game, `GameObject` is the base class, and other objects like `Ball` and `Paddle` inherit from it.
- **Composition:** The `Game` class manages and holds instances of other objects (ball, paddle, bricks, power-ups) but does not inherit from them. It coordinates their interactions.

**Class Structure:**

- `GameObject`: Base class with shared properties (`x`, `y`) and placeholder methods (`draw`, `update`).
- `Ball` and `Paddle`: Subclasses that inherit from `GameObject` and add their own properties and methods.
- `Game`: Main class that creates and manages all game objects and handles game state (score, lives, level).

**Example:**
- `Ball extends GameObject` and adds movement and color.
- `Paddle extends GameObject` and adds size, speed, and controls.
- `Game` creates and manages these objects, showing how inheritance and composition work together.

**Takeaway:**
- Inheritance is for sharing and extending behavior.
- Composition is for organizing and managing multiple objects.