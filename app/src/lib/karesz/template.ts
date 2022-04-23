import { REPLACE, RULES } from './rules';

export interface CodeInstance {
    code: string;
}

export class Template {
    private code: string = '';
    // used in the template so that players cannot interfere with built in functions
    protected rand: string = Template.random();

    public static random(): string {
        return `_${Math.random().toString(16).substring(2, 10)}`;
    }

    private constructor() {}

    public getMultiplayerTemplate(): string {
        return '';
    }

    // this function should be responsible for detecting disallowed code
    public static checkCode(code: string): {
        ok: boolean;
        error?: string;
        severity?: 'warning' | 'error';
    } {
        for (const rule of RULES)
            if (code.match(rule.find))
                return {
                    ok: false,
                    error: rule.description,
                    severity: rule.severity,
                };
        return { ok: true };
    }

    public static templateCode(
        code: string,
        index: number,
        rand: string
    ): string {
        for (const replacement of REPLACE) {
            code.replaceAll(
                replacement.replace,
                !replacement.usefn
                    ? replacement.name
                    : `${replacement.name}_${rand}(${index}${
                          replacement.args ? ',' + replacement.args : ''
                      })`
            );
        }
        return '';
    }
}
