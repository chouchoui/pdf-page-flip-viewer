module.exports = {
  plugins: [require("prettier-plugin-tailwindcss")],
  trailingComma: "all",
  semi: true,
  singleQuote: false,

  printWidth: 120,
  // 设置编辑器每一个水平缩进的空格数
  tabWidth: 2,
  // 在对象字面量声明所使用的的花括号后（{）和前（}）输出空格
  bracketSpacing: true,
  // 在多行JSX元素最后一行的末尾添加 > 而使 > 单独一行（不适用于自闭和元素）
  jsxBracketSameLinte: false,
  // 为单行箭头函数的参数添加圆括号。
  alwaysParens: "always",
};
