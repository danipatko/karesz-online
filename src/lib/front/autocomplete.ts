import * as monaco from 'monaco-editor';

export const createDependencyProposals = (range) => {
    return [
        {
            label: 'Lépj',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz előre lép egyet.',
            insertText: 'Lépj()',
            range: range
        },
        {
            label: 'Fordulj',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz elfordul 90 fokkal.',
            insertText: 'Fordulj(${1|jobbra,balra|})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
        },
        {
            label: 'balra',
            kind: monaco.languages.CompletionItemKind.Constant,
            documentation: '-90˚',
            insertText: 'balra',
            range: range
        },
        {
            label: 'jobbra',
            kind: monaco.languages.CompletionItemKind.Constant,
            documentation: '90°',
            insertText: 'jobbra',
            range: range
        },
        {
            label: 'Fordulj_jobbra',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz jobbra fordul 90 fokkal.',
            insertText: 'Fordulj_jobbra()',
            range: range
        },
        {
            label: 'Fordulj_balra',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz balra fordul 90 fokkal.',
            insertText: 'Fordulj_balra()',
            range: range
        },
        {
            label: 'Vegyél_fel_egy_kavicsot',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz felvesz egy kavicsot maga alól.',
            insertText: 'Vegyél_fel_egy_kavicsot()',
            range: range
        },
        {
            label: 'Tegyél_le_egy_kavicsot',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz letesz maga alá egy követ',
            insertText: 'Tegyél_le_egy_kavicsot(${1|fekete,sárga,zöld,piros|});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
        },
        {
            label: 'Északra_néz',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy északra néz-e.',
            insertText: 'Északra_néz()',
            range: range
        },
        {
            label: 'Délre_néz',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy délre néz-e.',
            insertText: 'Délre_néz()',
            range: range
        },
        {
            label: 'Keletre_néz',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy keletre néz-e.',
            insertText: 'Keletre_néz()',
            range: range
        },
        {
            label: 'Nyugatra_néz',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy északra néz-e.',
            insertText: 'Nyugatra_néz()',
            range: range
        }, 
        {
            label: 'Merre_néz',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy milyen irányba néz.',
            insertText: 'Merre_néz()',
            range: range
        },
        {
            label: 'Van_e_itt_kavics',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy van-e alatta kavics.',
            insertText: 'Van_e_itt_kavics()',
            range: range
        },
        {
            label: 'Mi_van_alattam',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy mi van alatta.',
            insertText: 'Mi_van_alattam()',
            range: range
        },
        {
            label: 'Van_e_előttem_fal',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy van-e előtte fal.',
            insertText: 'Van_e_előttem_fal()',
            range: range
        },
        {
            label: 'Kilépek_e_a_pályáról',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy kilép-e a pályáról.',
            insertText: 'Kilépek_e_a_pályáról()',
            range: range
        },
        {
            label: 'Lépj x-et',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz x darab lépést tesz.',
            insertText: 'for(int i = 0; i < ${1:10}; i++) {\n\tLépj();\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
        },
        {
            label: 'Lépj amíg',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz addig lép, amíg a feltétel igaz.',
            insertText: 'while(${1:true}) {\n\tLépj();\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
        },
        {
            label: 'Fordulj meg',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz 180 fokot fordul.',
            insertText: 'Fordulj(jobbra);\nFordulj(jobbra);',
            range: range
        },
        {
            label: 'Cikcakk jobb',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz lép, jobbra fordul, lép és balra fordul.',
            insertText: 'Lépj();\nFordulj(jobbra);\nLépj();\nFordulj(balra);',
            range: range
        },
        {
            label: 'Cikcakk bal',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz lép, balra fordul, lép és jobbra fordul.',
            insertText: 'Lépj();\nFordulj(balra);\nLépj();\nFordulj(jobbra);',
            range: range
        },
        {
            label: 'cw',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'log',
            insertText: 'Console.WriteLine("${1: }");',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
        },
        {
            label: 'Console.WriteLine',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'log',
            insertText: 'Console.WriteLine("${1: }");',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
        },
    ];
}