/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { ComponentType, ReactNode } from 'react';

/**
 * Renders ComponentType or ReactNode
 */
export function renderComponent(Component: ComponentType | ReactNode) {
  if (
    typeof Component === 'string' ||
    typeof Component === 'number' ||
    typeof Component === 'boolean' ||
    Component === null ||
    Component === undefined
  ) {
    return Component;
  }

  return Component;
}
