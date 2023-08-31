import { AWSAccount } from "../aws";

export interface AWSRegistryProps {
  /**
   * AWS account id.
   * @default AWSAccount.awsAccountId()
   */
  readonly accountId?: string;
  /**
   * AWS region where the ECR repository lives in.
   * @default AWSAccount.awsRegion()
   */
  readonly region?: string;
}

/**
 * Container registry urls constants.
 */
export class Registry {
  static readonly DOCKER: string = "index.docker.io";
  static readonly QUAY: string = "quay.io";
  static readonly GCR: string = "gcr.io";

  /**
   * Amazon Elastic Container Registry (ECR).
   *
   * If neither `accountId` nor `region` is given, the method attempts to
   * evaluate `accountId` and `region` using helper functions from `aws.AWSAccount`.
   * If either of the helper functions does provide a valid value, a `ValueError` or `KeyError` exception will be raised.
   *
   * @throws {Error} If AWS account ID cannot be resolved from `aws.AWSAccount.awsAccountId()`.
   * @throws {Error} If no region was found in `aws.AWSAccount.awsRegion()`.
   *
   * @returns {string} Elastic Container Registry URL in the format of
   * **${awsAccountId}.dkr.ecr.${region}.amazonaws.com**.
   */
  static async aws(props?: AWSRegistryProps): Promise<string> {
    const accountId = props?.accountId ?? (await AWSAccount.awsAccountId());
    const region = props?.region ?? (await AWSAccount.awsRegion());
    return `${accountId}.dkr.ecr.${region}.amazonaws.com`;
  }
  private constructor() {}
}
