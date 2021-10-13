/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';

import { Chart, Datum, Partition, Settings } from '@elastic/charts';
import { config } from '@elastic/charts/src/chart_types/partition_chart/layout/config';
import { mocks } from '@elastic/charts/src/mocks/hierarchical';

import { indexInterpolatedFillColor, interpolatorCET2s, productLookup } from '../utils/utils';

export const Example = () => (
  <Chart>
    <Settings />
    <Partition
      id="spec_1"
      data={mocks.pie}
      valueAccessor={(d: Datum) => d.exportVal as number}
      valueFormatter={(d: number) => `$${config.fillLabel.valueFormatter(Math.round(d / 1000000000))}\u00A0Bn`}
      layers={[
        {
          groupByRollup: (d: Datum) => d.sitc1,
          nodeLabel: (d: Datum) => productLookup[d].name,
          fillLabel: { valueFont: { fontWeight: 900, fontStyle: 'italic' } },
          shape: {
            fillColor: indexInterpolatedFillColor(interpolatorCET2s),
          },
        },
      ]}
      config={{ linkLabel: { valueFont: { fontWeight: 900, fontStyle: 'italic' } } }}
    />
  </Chart>
);

Example.parameters = {
  background: { default: 'white' },
};
