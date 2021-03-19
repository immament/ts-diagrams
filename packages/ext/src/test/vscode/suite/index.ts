/* eslint-disable node/no-extraneous-import */
/* eslint-disable node/no-unpublished-import */

import {runCLI} from 'jest';
import * as vscode from 'vscode';
import path = require('path');

export function run(
  testsRoot: string,
  clb: (error: unknown, failures?: number) => void
): Promise<void> {
  vscode.window.showInformationMessage('Run suite');

  const projectRootPath = path.join(__dirname, '../../../../');
  const config = path.join(projectRootPath, 'jest.vscode.config.js');

  return new Promise((resolve, reject) => {
    return runCLI(
      {
        config,
        runInBand: true,
        $0: '',
        _: [],
      },
      [projectRootPath]
    )
      .then(cliResult => {
        if (cliResult.results.numFailedTests > 0) {
          clb(
            `${cliResult.results.numFailedTests} tests failed.`,
            cliResult.results.numFailedTests
          );
        } else {
          clb(undefined, 0);
        }

        resolve();
      })
      .catch(failure => {
        reject(failure);
      });
  });
}

// const colors = {
//   passed: 32,
//   failed: 31,
//   gray: 90,
// };

// function msg({
//   ancestorTitles,
//   title,
//   status,
// }: {
//   ancestorTitles: string[];
//   title: string;
//   status: string;
// }) {
//   const statusColor = status as keyof typeof colors;

//   console.info(
//     `  ${color(statusColor, symbols[status])} ${ancestorTitles} › ${color(
//       'gray',
//       title
//     )} (${color(statusColor, status)})`
//   );
// }

// function color(type: keyof typeof colors, text: string) {
//   return `\u001b[${colors[type]}m${text}\u001b[0m`;
// }

// const symbols: Record<string, string> = {
//   passed: '✓',
//   failed: '✖',
// };
