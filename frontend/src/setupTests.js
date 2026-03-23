console.log('🚀 SETUP FILE IS RUNNING');
import React from 'react';
globalThis.React = React;

import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
expect.extend(matchers);

const originalError = console.error;

beforeAll(() => {
  console.error = (...args) => {
    const message = args[0];

    if (
      typeof message === 'string' &&
      (message.includes('not wrapped in act') ||
        message.includes('TransitionGroup') ||
        message.includes('anchorEl') ||
        message.includes('ForwardRef'))
    ) {
      return; // ignore these warnings
    }

    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
