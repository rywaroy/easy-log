
const sign = ['{', '}', '(', ')', '[', ']' , ',', '-', '^', '$', '?', '=', '*', '%', '.'];

module.exports = function EasyLog({
  types: t
}) {
  return {
    visitor: {
      Program(p, { opts = {} }) { // 访问主体代码

        // 获取log标识符
        let start = '\\{';
        let end = '\\}';
        if (opts.start) {
          if (sign.indexOf(opts.start) > -1) {
            start = `\\${opts.start}`;
          } else {
            start = opts.start;
          }
        }
        if (opts.end) {
          if (sign.indexOf(opts.end) > -1) {
            end = `\\${opts.end}`;
          } else {
            end = opts.end;
          }
        }
        const re = new RegExp(`${start}(.*?)${end}`, 'g');

        // 遍历主体代码所有节点
        p.traverse({
          enter(path) {
            if (path.node.trailingComments) { // 判断是否有后置的注释
              for (let i = 0; i < path.node.trailingComments.length; i++) { // 遍历所有注释
                const comment =  path.node.trailingComments[i];
                if (comment.type === 'CommentBlock') { // 判断是否是多行注释
                  continue;
                }
                const values = [];
                comment.value.replace(re, function (a, b) { // 正则配置需要log的内容
                  if (b.indexOf(':') === -1) { // 判断是否有冒号，排除注释单行对象 {a: 111}
                    values.push(t.Identifier(b));
                  }
                });

                if (values.length > 0) {
                  /**
                   * console.log AST树
                   * 例： console.log(n)
                   * {
                   *    type: ExpressionStatement,
                   *    expression: {
                   *      type: CallExpression,
                   *      calee: {
                   *          type: MemberExpression,
                   *          object: {
                   *              type: Identifier,
                   *              name: console
                   *          },
                   *          property: {
                   *            type: Identifier,
                   *            name: log
                   *          }
                   *      },
                   *      arguments: [
                   *        {
                   *          type: Identifier,
                   *          name: a
                   *        }
                   *      ]
                   *    }
                   * }
                   */

                  // 根据上面console.log的AST树，调用babel-types的方法，插入代码
                  path.insertAfter(t.expressionStatement(t.callExpression(t.memberExpression({
                    name: 'console',
                    type: 'Identifier'
                  }, {
                    name: 'log',
                    type: 'Identifier'
                  }), values)));
                }
              }
            }
          }
        });
      },
    }
  };
};