import chalk from 'chalk';
const log  = function(message,flag){
    flag?console.log(chalk.blue(message)):console.log(chalk.red(message))
}
export default log;