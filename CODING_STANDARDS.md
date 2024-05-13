# Coding standards

This document describes the coding standards for the project. The guidelines are intended to ensure consistency and readability in the codebase.

## Table of Contents

1. [Naming Conventions](#naming-conventions)
   - [Folders](#folders)
   - [Files](#files)
   - [Imports and exports](#imports-and-exports)
   - [Interfaces](#interfaces)
2. [CSS Classes Management](#css-classes-management)
   - [Dynamic styles](#dynamic-styles)
   - [Colors](#colors)
   - [Hardcoded values](#hardcoded-values)
   - [Icons](#icons)

## Naming Conventions

### Folders

- Use **kebab-case** for folder names
  - `password-reset/`
  - `login/`

### Files

- Use **PascalCase** for naming component files
  - Example: `Button.tsx`, `TestModal.tsx`
- Use **camelCase** for naming non-component files
  - Example: `page.tsx`, `layout.tsx`, `actionSomething.ts`, `arrowLeft.svg`

### Imports and exports

- Avoid default export unless necessary

  - Example:

    ```jsx
    // Bad
    export default Button;

    // Good
    export { Button };
    ```

- Avoid wildcard (\*) imports and import only the necessary modules

  - Example:

    ```jsx
    // Bad
    import * as Icons from '@/components/icons';

    // Good
    import { ArrowLeft } from '@/components/icons';
    ```

### Interfaces

- Use `interface` preferably for defining types with prefix `I`
  - Example:
    ```tsx
    interface IProps {
      name: string;
      age: number;
    }
    ```

## CSS Classes Management

### Dynamic styles

- Use the `cn()` function when applying dynamic styles

  ```jsx
  import { cn } from '@/lib/utils';

  const Component = ({ isActive }) => {
    return (
      <div className={cn('flex flex-col', isActive && 'bg-blue-500')}>
        <p>Some text</p>
      </div>
    );
  };
  ```

  Here is one of the explanatory videos on how to use the cn() function: [https://www.youtube.com/watch?v=re2JFITR7TI](https://www.youtube.com/watch?v=re2JFITR7TI)

### Colors

- Refer to the predefined colors in the [tailwind.config.ts](/tailwind.config.ts).
  - Example: `bg-primary`, `bg-primary-lightest`
- Avoid arbitrary colors like `#f0f0f0`, `#333333`, etc.

### Hardcoded values

- Avoid using hardcoded values for dimensions, paddings, margins, etc.

  - Example:

    ```jsx
      // Bad
      <div className={"w-[48px] h-[48px]"}></div>

      // Good
      <div className="w-12 h-12"></div>
    ```

### Icons

- Use Tailwind CSS classes for styling icons

  - Example:

    ```jsx
    // Bad
    <Camera color="red" size={48} />;

    // Good
    <Camera className="stroke-primary size-12" />;
    ```
