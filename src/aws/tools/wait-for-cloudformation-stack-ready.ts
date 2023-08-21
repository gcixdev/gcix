#! /usr/bin/env node
import {
  paginateListStacks,
  CloudFormationClient,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";
import {
  AssumeRoleCommand,
  Credentials,
  STS,
  STSClient,
} from "@aws-sdk/client-sts";
import * as yargs from "yargs";
import { sleep } from "../../helper";

/**
 * Creates a CloudFormation client with the provided AWS credentials.
 * @param credentials - Optional. AWS credentials to use for authentication.
 * @returns A CloudFormationClient object.
 * @throws {Error} If the provided credentials are missing any required fields.
 */
export function getCloudFormationClient(
  credentials?: Credentials,
): CloudFormationClient {
  if (credentials) {
    if (
      !credentials?.AccessKeyId ||
      !credentials.SecretAccessKey ||
      !credentials.SessionToken
    ) {
      throw new Error(
        "Missing AWS credentials. Please provide valid AccessKeyId, SecretAccessKey, and SessionToken.",
      );
    }
    return new CloudFormationClient({
      maxAttempts: 25,
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretAccessKey,
        sessionToken: credentials.SessionToken,
      },
    });
  }
  return new CloudFormationClient({ maxAttempts: 25 });
}

/**
 * Checks if any of the specified CloudFormation stacks are still in progress.
 * @param cfnClient - The CloudFormationClient instance to use for API requests.
 * @param stackNames - An array of CloudFormation stack names to check.
 * @returns A boolean indicating whether any of the stacks are still in progress.
 */
export async function cnfWaiter(
  cfnClient: CloudFormationClient,
  stackNames: string[],
): Promise<boolean> {
  for (const stackName in stackNames) {
    await sleep(500); // prevent API rate limiting when iterating through many stacks

    const describedStacks = await cfnClient.send(
      new DescribeStacksCommand({
        StackName: stackName,
      }),
    );

    for (const describedStack of describedStacks.Stacks || []) {
      if (
        describedStack.StackStatus &&
        describedStack.StackStatus === "IN_PROGRESS"
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * The main function that waits for CloudFormation stacks to complete their operations.
 * @returns void
 */
export async function main() {
  const args = await yargs.options({
    "stack-names": {
      alias: "sn",
      describe:
        "The names of the stacks to wait all CloudFormation operations are finished for, separated by spaces.",
      demandOption: true,
      array: true,
      type: "string",
    },
    "wait-seconds": {
      alias: "w",
      default: 30,
      describe:
        "The number of seconds to wait before checking stack status again. Default: 30",
      number: true,
    },
    "assume-role": {
      alias: "a",
      describe: "The IAM role to execute this script with.",
      string: true,
    },
    "assume-role-account-id": {
      alias: "i",
      describe: "The account Id the --assume-role resides in.",
      string: true,
    },
  }).argv;

  // Assume AWS IAM Role and obtain temporary credentials if "--assume-role" option is provided.
  let credentials: Credentials | undefined = undefined;
  if (args.assumeRole) {
    // Retrieve the AWS account ID of the assumed role or use the provided "--assume-role-account-id".
    const assumeRoleAccountId =
      args.assumeRoleAccountId ||
      (await new STS({ maxAttempts: 25 }).getCallerIdentity({})).Account;

    // Create a new STS client with a max retry limit of 25.
    const stsClient = new STSClient({ maxAttempts: 25 });

    // Send an "AssumeRoleCommand" to assume the specified role and get temporary credentials.
    const assumedRoleObject = await stsClient.send(
      new AssumeRoleCommand({
        RoleArn: `arn:aws:iam::${assumeRoleAccountId}:role/${args.assumeRole}`,
        RoleSessionName: "AssumeRoleSession1",
      }),
    );

    // Check if the "Credentials" property is present in the assumed role response.
    // If successful, store the temporary credentials for later use in API requests.
    if (!assumedRoleObject.Credentials) {
      throw new Error("Assuming the role unsuccessful.");
    }
    credentials = assumedRoleObject.Credentials;
  }

  const cfnClient = getCloudFormationClient(credentials);

  const stackStatusFilter = [
    "CREATE_IN_PROGRESS",
    "CREATE_FAILED",
    "CREATE_COMPLETE",
    "ROLLBACK_IN_PROGRESS",
    "ROLLBACK_FAILED",
    "ROLLBACK_COMPLETE",
    "DELETE_IN_PROGRESS",
    "DELETE_FAILED",
    "UPDATE_IN_PROGRESS",
    "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS",
    "UPDATE_COMPLETE",
    "UPDATE_ROLLBACK_IN_PROGRESS",
    "UPDATE_ROLLBACK_FAILED",
    "UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS",
    "UPDATE_ROLLBACK_COMPLETE",
    "REVIEW_IN_PROGRESS",
    "IMPORT_IN_PROGRESS",
    "IMPORT_COMPLETE",
    "IMPORT_ROLLBACK_IN_PROGRESS",
    "IMPORT_ROLLBACK_FAILED",
    "IMPORT_ROLLBACK_COMPLETE",
  ];

  // Build a list of CloudFormation stack names that match the provided patterns.
  const stackNames: string[] = [];
  for (const stackName of args.stackNames) {
    // Remove any "*" characters from the stack name, as "*" is used as a wildcard pattern.
    let modifiedStackName = stackName.replace(/\*/g, "");

    // Paginate through the list of CloudFormation stacks with a status filter.
    // Each page contains up to 100 stack summaries.
    let stackPages = paginateListStacks(
      { client: cfnClient, pageSize: 100 },
      { StackStatusFilter: stackStatusFilter },
    );

    // Iterate through each page of stack summaries to find matching stack names.
    for await (const stackPage of stackPages) {
      for (const stack of stackPage.StackSummaries || []) {
        // Check if the stack name includes the modified stack name, which may contain wildcards.
        if (stack.StackName && stack.StackName.includes(modifiedStackName)) {
          // If a matching stack name is found, add it to the stackNames array.
          stackNames.push(stack.StackName);
        }
      }
    }
  }

  console.log(`waiting for stacks to complete: ${stackNames}`);

  // Continuously monitor the status of CloudFormation stacks until all operations are complete.
  while (await cnfWaiter(cfnClient, stackNames)) {
    // If any of the stacks in the "stackNames" array are still in progress,
    // log a message indicating that we are waiting for them to complete.
    console.log(
      `One of the stacks ${stackNames} status is in progress. Waiting...`,
    );

    // Wait for the specified number of seconds before checking the stack status again.
    await sleep(args.waitSeconds * 1000);
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log("Script execution completed successfully.");
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      process.exit(1); // Exit with a non-zero status code to indicate an error.
    });
}
