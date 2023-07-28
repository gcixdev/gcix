import * as gcix from "../../../src";
import { check } from "../../comparison";

test("test", () => {
  const pipeline = new gcix.Pipeline();

  const job = new gcix.Job({ stage: "print_date", scripts: ["date"] });
  job.assignImage("docker/image:example");
  job.prependScripts(["./before-script.sh"]);
  job.appendScripts(["./after-script.sh"]);
  job.addVariables({ USER: "Max Power", URL: "https://example.com" });
  job.addTags(["test", "europe"]);
  job.assignArtifacts(new gcix.Artifacts({ paths: ["binaries/", ".config"] }));
  job.appendRules([new gcix.Rule({ ifStatement: "$MY_VARIABLE_IS_PRESENT" })]);

  pipeline.addChildren({ jobsOrJobCollections: [job] });

  check(pipeline.render(), expect);
});
