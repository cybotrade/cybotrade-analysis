import { UniqueIdentifier } from '@dnd-kit/core';
import React from 'react';

export type TCell = {
  id: UniqueIdentifier;
  children: {
    element: React.ReactNode;
    type: UniqueIdentifier;
  } | null;
};
