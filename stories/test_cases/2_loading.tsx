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

import { EuiFlexItem, EuiLoadingChart } from '@elastic/eui';
import { boolean, button } from '@storybook/addon-knobs';
import React, { FC, useState } from 'react';

import { Chart, Settings, Axis, Position, BarSeries, ScaleType, TooltipType } from '../../src';
import { LineSeries } from '../../src/chart_types/xy_chart/specs/line_series';
import { SeededDataGenerator } from '../../src/mocks/utils';

const Loading: FC = () => (
  <EuiFlexItem>
    <EuiLoadingChart size="xl" />
  </EuiFlexItem>
);

/**
 * Should render no data value
 */
export const Example = () => {
  const dg = new SeededDataGenerator();
  const data = dg.generateSimpleSeries(15000);
  const tooltipProps = {
    type: TooltipType.Follow,
  };
  const [toggle, setToggle] = useState(true);
  const customLoading = boolean('Show custom loading', true);
  button('Reload', () => {
    setToggle((t) => !t);
  });

  return (
    <Chart className="story-chart">
      <Settings tooltip={tooltipProps} loading={customLoading ? <Loading /> : undefined} />
      <Axis id="bottom" position={Position.Bottom} title="Bottom axis" />
      <Axis id="left2" title="Left axis" position={Position.Left} tickFormat={(d: any) => Number(d).toFixed(2)} />

      {toggle ? (
        <BarSeries
          id="1"
          xScaleType={ScaleType.Linear}
          yScaleType={ScaleType.Linear}
          splitSeriesAccessors={['g']}
          data={data}
        />
      ) : (
        <LineSeries
          id="2"
          xScaleType={ScaleType.Linear}
          yScaleType={ScaleType.Linear}
          splitSeriesAccessors={['g']}
          data={data}
        />
      )}
      {/* <BarSeries
        id={toggle ? 'bars1' : 'bars2'}
        xScaleType={ScaleType.Linear}
        yScaleType={ScaleType.Linear}
        splitSeriesAccessors={['g']}
        data={data}
      /> */}
    </Chart>
  );
};
