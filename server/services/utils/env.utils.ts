export function getRequiredEnvVar(envName: string): string {
    if (typeof process.env[envName] === "undefined") {
        throw new Error(`Missing required environment variable: ${envName}`);
    }
    return process.env[envName] as string;
}