## 安装  运行  打包
npm install
npm run electron:serve
npm run electron:build

## 注意
为了降低打包后的安装包体积，请将声明在dependencies中的*所有项*转移到devDependencies下。该做法是为了避免打包时将体积巨大且无用的node_modules转移到app.asar中，可以大幅减小体积。实测在早期开发版本(v0.1.2)中，安装包从70.7MB减小到57.5MB(减小了18.6%)，免安装包从275MB减小到184MB(减小了33%)。
