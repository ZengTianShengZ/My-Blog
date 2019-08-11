module.exports = {
  "parserOptions": {  
    "sourceType": "module"
  },
  "parser": 'eslint-config-alloy/typescript',
  "env": {
    "browser": false,
    "node": true
  },
  "plugins": [
    "html"
  ],
  "rules": {
    "semi": [2, 'always'],
    // http://eslint.org/docs/rules
    "quotes": [
        2, 'single', 'avoid-escape'    // http://eslint.org/docs/rules/quotes
    ],
    // http://eslint.org/docs/rules/no-unused-vars
    'no-unused-vars': [
        1, { vars: 'local', args: 'after-used' }
    ],
    'eol-last': 1,
    'no-debugger': 1,
    'padded-blocks': 1,
    'brace-style': [2, 'stroustrup'],
    'comma-dangle': [2, 'only-multiline'],
    'space-before-function-paren': [2, 'never'],
    'no-multiple-empty-lines': [2, { max: 3 }],
    'keyword-spacing': [
        2, {
            before: true,
            after: true,
            overrides: {
                'catch': {
                    after: false
                },
                'for': {
                    after: false
                },
                'if': {
                    after: false
                },
                'while': {
                    after: false
                }
            }
        }
    ],
    indent: [2, 2, {
        MemberExpression: 0
    }],
    eqeqeq: 2,
    curly: 1,
    "no-console": "warn",
    // "no-any": 2,//不需使用any类型
  }
}