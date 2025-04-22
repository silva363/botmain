import { describe, expect, it } from '@jest/globals';
import fs from 'fs';

const readEnvFile = () => {
    const fileContentBuffer = fs.readFileSync('.env-sample', 'utf8');
    const fileContentString = fileContentBuffer.toString();
    const lines = fileContentString.split(/\r?\n/)
        .filter(line => line.trim() !== '' && !line.trim().startsWith('#'))
        .map(line => line.split('=')[0]);

    return lines;
};

describe('Testing .env file vars', () => {
    if (process.env.WORKSPACE == 'local') {
        const requiredEnvVariables = readEnvFile();

        it('All vars exists in file', () => {
            const missingVariables = requiredEnvVariables.filter(variable => !(variable in process.env));

            if (missingVariables.length > 0) {
                console.log(`This vars are missing: ${missingVariables.join(', ')}`);
            }

            expect(missingVariables.length).toBe(0);
        });

        it('Vars types match', () => {
            requiredEnvVariables.filter(variable => {
                const element = process.env[variable];

                if (element == undefined || element.length == 0) {
                    console.log(`Var ${variable} in .env has zero length.`);
                }

                expect(element).not.toBeNull();
                expect(element).toBeDefined();
                expect(element).not.toMatch(/#/);
                expect(element?.length).toBeGreaterThan(0);
            });
        });
    } else {
        it('When workspace is not local, do another envVars test', () => {
            return;
        });
    }
});