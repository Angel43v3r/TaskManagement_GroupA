console.log('🚀 SETUP FILE IS RUNNING');
import React from 'react';
global.React = React;

import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
expect.extend(matchers);
