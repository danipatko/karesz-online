import { REPLACE, RULES } from '../config/rules';

export default class ProcessCode {
    // detect disallowed code
    protected safetyCheck(code: string): {
        error: string;
        severity: 'warning' | 'error';
    } | null {
        for (const rule of RULES)
            if (rule.reverse ? !code.match(rule.find) : code.match(rule.find))
                return {
                    error: rule.description,
                    severity: rule.severity,
                };

        return null;
    }

    // replace all functions and variables with their values
    protected replace(
        index: number,
        code: string,
        name: string,
        rand: string,
        type: 'single' | 'multi'
    ): { code: string; length: number } {
        // replace entry
        code = code.replaceAll(
            /void\s+FELADAT\s*\(\s*\)/gm,
            type == 'single'
                ? 'static void Main(string args[])'
                : `void Thread${index}${rand}()`
        );

        // replace writelines so that players can see their logs
        code = code.replaceAll(
            /Console\.(WriteLine|Write)\((?<value>.*)\)/g,
            `Console.WriteLine($"[{ROUND${rand}}]: ${name} > "+$1)`
        );

        for (const replacement of REPLACE) {
            // replace with a function alias
            if (replacement.usefn)
                code = code.replaceAll(
                    replacement.replace,
                    this.getFunction(
                        type,
                        replacement.name,
                        rand,
                        index,
                        replacement.args
                    )
                );
            // replace a variable with a value
            else code = code.replaceAll(replacement.replace, replacement.name);
        }

        return { code, length: code.split('\n').length };
    }

    // get function alias
    private getFunction(
        type: string,
        name: string,
        rand: string,
        index: number,
        args?: string
    ): string {
        if (type == 'single') return `${name}${rand}(${args ?? ''})`;
        return `${name}${rand}(${index}${args ? ',' + args : ''})`;
    }
}