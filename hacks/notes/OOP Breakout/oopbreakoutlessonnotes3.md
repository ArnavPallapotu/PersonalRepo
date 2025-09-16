---
layout: post 
title: OOP Breakout Lesson 3 notes
author: Dhyan Soni
permalink: oopbreakoutnote3
---

## OOP Breakout Lesson 1 Summary

**Key Concepts:**

- **Constructors:** Learned how constructors initialize object state and how `super()` is used to call the parent class constructor. Default parameters make code flexible.
- **Drawing & Animation:** Understood how the `draw(ctx)` method renders objects (like the ball) and how `update()` animates them by changing position.
- **Collision Detection:** Saw how helper methods like `collidesWith()` and `collidesWithPaddle()` keep game logic clean and reusable.
- **Resetting & Speed Control:** Learned how to reset the ball with a random angle and keep its speed, and how to scale speed up or down while preserving direction.
- **Inheritance & Composition:** Saw how `Ball`, `Paddle`, `Brick`, and `PowerUp` inherit from `GameObject`, and how the `Game` class composes all these objects to run the game.

**Class Structure:**

- `GameObject`: Base class for position and shared methods.
- `Ball`: Inherits from `GameObject`, adds movement, color, and collision logic.
- `Paddle`: Inherits from `GameObject`, adds size, speed, and controls.
- `Brick`, `PowerUp`: Also inherit from `GameObject` and add their own features.
- `Game`: Composes all objects, manages state, and runs the game loop.

**Example:**
- The `Ball` class uses a constructor to set its position, speed, and color, and overrides `draw()` and `update()`.
- The `Paddle` class adds movement controls and can be powered up.
- The `Game` class creates and manages all objects, showing how inheritance and composition work together.

**Takeaway:**
- Constructors are essential for setting up objects.
- Inheritance lets you share and extend code between classes.
- Composition lets you build complex systems by combining objects.
- Helper methods make code modular and easier to maintain.

**What I Learned:**
- I learned how OOP makes game code more organized and flexible.
- I now understand how to use constructors, inheritance, and composition in real projects.
- I saw how helper methods and class structure keep code clean and easy to extend.