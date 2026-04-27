import { createHash } from "node:crypto";
import { getRequiredEnvVar } from "./env.utils";

export function sha256(str: string): string {
    return createHash("sha256")
        .update(str + getRequiredEnvVar('SALT'))
        .digest("hex");
}