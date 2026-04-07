# Command Center architecture direction

## Current direction
This prototype uses modular ES modules with domain state, feature views, and view-model builders.

## Preferred next step
The preferred migration path is React + TypeScript componentization.

## Why this refactor supports that move
- Domain state is separated from rendering so state slices can map directly to React context/store patterns.
- View-model builders isolate shaping logic, reducing JSX complexity in a future migration.
- Shared status and log helpers centralize visual semantics and filtering rules for reuse.
- Event handling now funnels through action dispatching, which maps cleanly to reducer-driven interactions.
