import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import sanitize from 'sanitize-filename';

export function check(output: Object, callerExpect: jest.Expect): void {
  // Convert output object into yaml
  const yamlOutput = yaml.dump(output, { sortKeys: false, flowLevel: -1, noArrayIndent: true });

  const testPath = callerExpect.getState().testPath;
  const currentTestName = callerExpect.getState().currentTestName;
  if (!testPath || !currentTestName) {
    throw new Error('There is no `testPath` or `currentTestName` on `callerExpect.getState()` property');
  }
  // Path to your YAML file
  const testDirPath = path.parse(testPath).dir;
  const testFilename = path.parse(testPath).name;
  const testName = sanitize(currentTestName).replace(/ /g, '_');

  const compareFilePath = `${testDirPath}/comparison_files/${testFilename}/${testName}.yaml`;

  if (process.env.UPDATE_TEST_OUTPUT) {
    if (!fs.existsSync(path.dirname(compareFilePath))) {
      fs.mkdirSync(path.dirname(compareFilePath), { recursive: true });
    }

    try {
      fs.writeFileSync(compareFilePath, yamlOutput);
      console.log(`Comparision file ${path.basename(compareFilePath)} written successfully.`);
    } catch (error) {
      console.error(`Error writing comparision file ${path.basename(compareFilePath)}:`, error);
    }

  } else {
    try {
      expect(yamlOutput).toBe(fs.readFileSync(compareFilePath, 'utf-8'));
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.error(
          `Comparison file '${compareFilePath}' not found.
          Create it by executing:
          UPDATE_TEST_OUTPUT=true TODO ${testFilename}
        `);
        throw error;
      } else {
        throw error;
      }
    }
  }
}
