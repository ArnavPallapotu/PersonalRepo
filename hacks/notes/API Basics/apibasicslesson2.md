

---
layout: post
title: Error Handling Basics
author: Copilot
permalink: errorhandlingnote1
---
## Error Handling in JavaScript

**Key Concepts:**

- **try:** Test code that might fail.
- **throw:** Create your own error if something is wrong.
- **catch:** Handle errors safely and prevent crashes.

**Example:**
```javascript
try {
	let age = -3;
	if (age < 0) {
		throw "Age cannot be negative!";
	}
} catch (err) {
	console.log("Error:", err);
}
```

**Takeaway:**
- Use `try` to test risky code.
- Use `throw` to signal errors.
- Use `catch` to handle problems and keep your program running.
