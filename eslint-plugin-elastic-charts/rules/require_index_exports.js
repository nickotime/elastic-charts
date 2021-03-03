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

const path = require('path');

const glob = require('glob');
const minimatch = require('minimatch');

const ignoredIndexGlobs = ['**/__mocks__/**', '**/__snapshots__/**', 'src/d3-delaunay/**'];
const ignoredExportGlobs = ['**/yes/**'];

const isIndexFile = (filePath) => minimatch(filePath, '**/index.ts?(x)');

const isIgnoredIndexPath = (filePath) => ignoredIndexGlobs.some((pattern) => minimatch(filePath, pattern));
const isNotIgnoredExportPath = (filePath) => !ignoredExportGlobs.some((pattern) => minimatch(filePath, pattern));

module.exports = {
  meta: {
    fixable: 'code',
    type: 'problem',
  },
  create(context) {
    const missingExportFiles = new Set();
    let lastExportRange = 0;
    return {
      Program() {
        const filePath = context.getFilename();

        if (!isIndexFile(filePath)) return;

        const relativePath = path.relative(context.getCwd(), filePath);

        if (isIgnoredIndexPath(relativePath)) return;

        const dirPath = path.resolve(filePath, '../');
        const files = glob.sync(`${dirPath}/!(index).ts?(x)`);
        const dirs = glob.sync(`${dirPath}/*/index.ts?(x)`);

        files.filter(isNotIgnoredExportPath).forEach((dir) => {
          // todo: differentiate ts vs tsx files
          missingExportFiles.add(dir.replace(/\.[^./]+$/, ''));
        });

        dirs.filter(isNotIgnoredExportPath).forEach((dir) => {
          missingExportFiles.add(path.resolve(dir, '../'));
        });
      },
      // eslint-disable-next-line func-names
      'ExportNamedDeclaration[source!=""]:not(ExportAllDeclaration)': function ({ range, loc, source }) {
        const filePath = context.getFilename();
        if (!isIndexFile(filePath) || !source) return;
        const sourcePath = path.join(filePath, '../', source.value);
        missingExportFiles.delete(sourcePath);
        lastExportRange = Math.max(lastExportRange, range[1]);

        context.report({
          loc,
          message: 'Should use export all from index files',
          fix(fixer) {
            return fixer.replaceTextRange(range, `export * from ${source.raw};`);
          },
        });
      },
      ExportAllDeclaration({ range, source }) {
        const filePath = context.getFilename();
        if (!isIndexFile(filePath)) return;
        const sourcePath = path.join(filePath, '../', source.value);
        lastExportRange = Math.max(lastExportRange, range[1]);
        missingExportFiles.delete(sourcePath);
      },
      // eslint-disable-next-line func-names
      'Program:exit': function (node) {
        const filePath = context.getFilename();
        if (!isIndexFile(filePath) || missingExportFiles.size === 0) return;

        const missingExports = [...missingExportFiles].map((file) => {
          const relativePath = path.relative(path.resolve(filePath, '../'), file);

          return `export * from './${relativePath}';`;
        });

        context.report({
          loc: node.loc,
          message: 'Missing subdirectory exports',
          fix(fixer) {
            return fixer.insertTextAfterRange([lastExportRange, lastExportRange], `${missingExports.join('\n')}\n`);
          },
        });
      },
    };
  },
};
