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

import { promises as fs } from 'fs';
import path from 'path';

const header = `/*
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

`;

const ignoredDirectories = new Set(['__mocks__', '__snapshots__', 'd3-delaunay']);

const checkAllIndexFiles = async (startPath?: string) => {
  const start = startPath ?? path.resolve(__dirname, '../src');

  const files: string[] = [];
  const directories: string[] = [];

  for (const file of await fs.readdir(start)) {
    const ext = path.extname(file);

    if (/^index\.tsx?$/.test(file)) {
      // exclude
    } else if (ext === '' && !ignoredDirectories.has(file)) {
      // assume dir for now
      directories.push(file);
    } else if (/(?<!test)\.tsx?$/.test(file)) {
      files.push(file);
    }
  }

  await editIndexFile(start, files, directories);

  await Promise.all(directories.map((dir) => checkAllIndexFiles(path.resolve(start, dir))));
};

async function editIndexFile(pathStr: string, files: string[], directories: string[]) {
  const fileContent = files.reduce((acc, file) => {
    return `${acc}export * from './${path.parse(file).name}';\n`;
  }, header);

  const content = directories.reduce((acc, file) => {
    return `${acc}export * from './${file}';\n`;
  }, `${fileContent}`);

  const indexPath = path.resolve(pathStr, 'index.ts');
  await fs.writeFile(indexPath, content);
}

void checkAllIndexFiles();
