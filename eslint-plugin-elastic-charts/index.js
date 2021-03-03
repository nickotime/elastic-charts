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

module.exports = {
  rules: {
    'require-tsdocs': require('./rules/require_tsdocs'),
    'require-release-tag': require('./rules/require_release_tag'),
    'require-documentation': require('./rules/require_documentation'),
    'no-different-release-tag': require('./rules/no_different_release_tag'),
    'require-index-file': require('./rules/require_index_file'),
    'require-index-exports': require('./rules/require_index_exports'),
  },
};
