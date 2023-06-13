import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import sanitize from 'sanitize-filename';

export function check(output: Object, callerExpect: jest.Expect): void {
  // Convert output object into yaml
  const yamlOutput = yaml.dump(output, { sortKeys: true, flowLevel: -1 });

  // Path to your YAML file
  const testDirPath = path.parse(callerExpect.getState().testPath).dir;
  const testFilename = path.parse(callerExpect.getState().testPath).name;
  const testName = sanitize(callerExpect.getState().currentTestName);

  const compareFilePath = `${testDirPath}/comparison_files/${testFilename}_${testName}.yaml`;

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
    } catch (error) {
      if (error.code == 'ENOENT') {
        console.error(
          `Comparison file not found.
          Create it by executing:
          UPDATE_TEST_OUTPUT=true TODO ${testFilename}
        `);
        throw error;
      } else {

      }
    }
  }
}
