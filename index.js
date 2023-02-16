#!/usr/bin/env node
// 引入相应的库

const { program } = require('commander');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs');
 

program.version('1.0.0')
program.command('createApp <name>')
.description('create a project')
.action((name, opts) => {
    // import * as ora from 'ora'
    inquirer.prompt([
        {
            name: 'description',
            message: '请输入项目描述:'
        },
        {
            name: 'author',
            message: '请输入项目作者:',
            default: 'robot'
        },
        {
            name: 'type',
            type: 'list',
            message: 'choose a type of project to init',
            choices: ['vue-simple', 'react-simple'],
            default: 'vue'
        }
    ]).then((parameter) => {
        // 将项目名称放入参数中
        const downloadPath = path.join(process.cwd(), name);
        const param = {name, ...parameter};
        const spinner = ora('正在下载模板, 请稍后...');
        spinner.start();
        download(`zhongyuan0316/zhy-cli-templete#${parameter.type}`, name, (err)=>{
                if(!err) {
                    // success download
                    spinner.succeed();
                    const packagePath = path.join(downloadPath, 'package.json');
                    // 判断是否有package.json, 要把输入的数据回填到模板中
                    if (fs.existsSync(packagePath)) {
                        const content = fs.readFileSync(packagePath).toString();
                        // handlebars 模板处理引擎
                        const template = handlebars.compile(content);
                        const result = template(param);
                        fs.writeFileSync(packagePath, result);
                        
                        console.log(chalk.green('success! 项目初始化成功！'));
                    } else {
                        spinner.fail();
                        console.log(chalk.red('failed! no package.json'));
                        return;
                    }
                  }
                
            } )
    })
})

program.parse(process.argv)