import { Monaco } from '@monaco-editor/react';

export const getCompletionItems = (monaco: Monaco): any[] => {
    return [
        {
            label: 'Lépj',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz előre lép egyet.',
            insertText: 'Lépj()',
        },
        {
            label: 'Fordulj',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz elfordul 90 fokkal.',
            insertText: 'Fordulj(${1|jobbra,balra|})',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
            label: 'Fordulj_jobbra',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz jobbra fordul 90 fokkal.',
            insertText: 'Fordulj_jobbra()',
        },
        {
            label: 'Fordulj_balra',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz balra fordul 90 fokkal.',
            insertText: 'Fordulj_balra()',
        },
        {
            label: 'Vegyél_fel_egy_kavicsot',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz felvesz egy kavicsot maga alól.',
            insertText: 'Vegyél_fel_egy_kavicsot()',
        },
        {
            label: 'Tegyél_le_egy_kavicsot',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz letesz maga alá egy követ',
            insertText:
                'Tegyél_le_egy_kavicsot(${1|fekete,sárga,zöld,piros|});',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
            label: 'Északra_néz',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy északra néz-e.',
            insertText: 'Északra_néz()',
        },
        {
            label: 'Délre_néz',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy délre néz-e.',
            insertText: 'Délre_néz()',
        },
        {
            label: 'Keletre_néz',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy keletre néz-e.',
            insertText: 'Keletre_néz()',
        },
        {
            label: 'Nyugatra_néz',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy északra néz-e.',
            insertText: 'Nyugatra_néz()',
        },
        {
            label: 'Merre_néz',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy milyen irányba néz.',
            insertText: 'Merre_néz()',
        },
        {
            label: 'Van_e_itt_kavics',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy van-e alatta kavics.',
            insertText: 'Van_e_itt_kavics()',
        },
        {
            label: 'Mi_van_alattam',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy mi van alatta.',
            insertText: 'Mi_van_alattam()',
        },
        {
            label: 'Van_e_előttem_fal',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy van-e előtte fal.',
            insertText: 'Van_e_előttem_fal()',
        },
        {
            label: 'Kilépek_e_a_pályáról',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz megnézi, hogy kilép-e a pályáról.',
            insertText: 'Kilépek_e_a_pályáról()',
        },
        {
            label: 'Lépj x-et',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Karesz x darab lépést tesz.',
            insertText: 'for(int i = 0; i < ${1:10}; i++) {\n\tLépj();\n}',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
            label: 'while',
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: 'while loop.',
            insertText: 'while(${1:true}) {\n\t${2}\n}',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
            label: 'Fordulj meg',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Karesz 180 fokot fordul.',
            insertText: 'Fordulj(jobbra);\nFordulj(jobbra);',
        },
        {
            label: 'jobb bal',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Karesz lép, jobbra fordul, lép és balra fordul.',
            insertText: 'Lépj();\nFordulj(jobbra);\nLépj();\nFordulj(balra);',
        },
        {
            label: 'bal jobb',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Karesz lép, balra fordul, lép és jobbra fordul.',
            insertText: 'Lépj();\nFordulj(balra);\nLépj();\nFordulj(jobbra);',
        },
        {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: 'Karesz x darab lépést tesz.',
            insertText: 'for(int i = 0; i < ${1:10}; i++) {\n\tLépj();\n}',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: 'ha elágazás',
            insertText: 'if(${1:condition}) {\n\t\n}',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
            label: 'else if',
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: 'ha elágazás',
            insertText: 'else if(${1:condition}) {\n\t\n}',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
            label: 'else',
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: 'ha elágazás',
            insertText: 'else {\n\t${1}\n}',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
            label: 'switch',
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: 'switch case elágazás',
            insertText:
                'switch(${1:value}) {\n\tcase ${2}:\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
            label: 'void',
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: 'függvény deklaráció',
            insertText: 'void ${1:FunctionName}() {\n\t${2}\n}',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
    ];
};
