import {
  STSClient,
  GetCallerIdentityCommand,
  GetCallerIdentityCommandOutput,
} from "@aws-sdk/client-sts";

export class AWSAccount {
  /**
   * @internal
   */
  static _sts = new STSClient({});
  /**
   * @internal
   */
  static _callerIdentity?: GetCallerIdentityCommandOutput;

  /**
   * Retrieves the caller identity response using the AWS SDK client for
   * Security Token Service (STS). If the caller identity response is not
   * cached, it fetches the response and stores it for subsequent calls.
   *
   * @returns {Promise<GetCallerIdentityCommandOutput>} A promise resolving to
   * @internal
   * the caller identity response.
   */
  static async _getCallerIdentityResponse(): Promise<GetCallerIdentityCommandOutput> {
    if (!this._callerIdentity)
      this._callerIdentity = await this._sts.send(
        new GetCallerIdentityCommand({}),
      );
    return this._callerIdentity;
  }

  /**
   * Retrieves the AWS Account ID associated with the current AWS credentials
   * or environment. If available, it uses the environment variable
   * `AWS_ACCOUNT_ID`. Otherwise, it fetches the AWS Account ID from the caller
   * identity response obtained via STS.
   *
   * @returns {Promise<string | undefined>} A promise that resolves to the
   * AWS Account ID as a string.
   * @throws {Error} If the AWS Account ID cannot be resolved.
   */
  static async awsAccountId(): Promise<string> {
    if (process.env.AWS_ACCOUNT_ID) {
      return process.env.AWS_ACCOUNT_ID;
    }

    const response = await this._getCallerIdentityResponse();
    if (response && response.Account) {
      return response.Account;
    }
    throw new Error("AWS Account ID not resolvable!");
  }

  /**
   * Retrieves the AWS region associated with the current AWS credentials
   * or environment. If available, it uses the environment variable
   * `AWS_DEFAULT_REGION`. Otherwise, it fetches the AWS region from the caller
   * identity response obtained via STS.
   *
   * @returns {Promise<string | undefined>} A promise that resolves to the
   * AWS region as a string.
   * @throws {Error} If the AWS region cannot be resolved.
   */
  static async awsRegion(): Promise<string> {
    if (process.env.AWS_DEFAULT_REGION) {
      return process.env.AWS_DEFAULT_REGION;
    }

    const response = await this._getCallerIdentityResponse();
    if (response && response.Arn) {
      return response.Arn.split(":")[3];
    }
    throw new Error("AWS Region not resolvable!");
  }
}
