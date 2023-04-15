function getRequiredEnvVariable(variableName: string): string {
  const variable = process.env[variableName];

  if (variable) {
    return variable;
  }

  throw new Error(`Must set ${variableName} environment variable`);
}

export const DOMAIN_NAME = process.env.DOMAIN_NAME;
export const SES_VERIFIED_IDENTITY = getRequiredEnvVariable(
  "SES_VERIFIED_IDENTITY"
);
export const FROM_EMAIL_ADDRESS = getRequiredEnvVariable("FROM_EMAIL_ADDRESS");
