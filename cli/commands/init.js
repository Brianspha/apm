const createPackageJson = require('create-package-json')
const inquirer = require('inquirer');
const config = require('../config/config')
var questions = [
    {
        type: 'input',
        name: 'package_name',
        message: "Enter Package Name: (gitub)",
        default: function () {
            return 'PACKAGE_NAME';
        }
    },
    {
        type: 'input',
        name: 'version',
        message: "Version: (0.1.0)",
        default: function () {
            return '0.1.0';
        }
    },
    {
        type: 'input',
        name: 'description',
        message: "Description: ",
        default: function () {
            return 'DESCRIPTION';
        }
    },
    {
        type: 'input',
        name: 'main',
        message: "entry_point: (index.js)",
        default: function () {
            return 'index.js';
        }
    },
    {
        type: 'input',
        name: 'test',
        message: "test command: ",
        default: function () {
            return 'echo \"Error: no test specified\" && exit 1';
        }
    },
    {
        type: 'input',
        name: 'repo',
        message: "github repo: ",
        default: function () {
            return '';
        }
    },
    {
        type: 'input',
        name: 'keywords',
        message: "keywords (seperated by a space): ",
        default: function () {
            return '';
        }
    },
    {
        type: 'input',
        name: 'author',
        message: "author: ",
        default: function () {
            return '';
        }
    },
    {
        type: 'input',
        name: 'license',
        message: "license: (ISC)",
        default: function () {
            return 'ISC';
        }
    },
    {
        type: 'input',
        name: 'arweave',
        message: "enter your arweave address: ",
        validate: function (value) {
            if (value && value.length === 43) {
                return true
            }
            else {
                return 'Please enter a valid arweave address'
            }
        }
    }

]

inquirer.prompt(questions).then(answers => {
    console.log('answers', answers)
    delete answers.test
    answers.scripts = {
        "test": "echo \"Error: no test specified\" && exit 1"
    }
    answers.keywords = answers.keywords.split(' ')
    answers.devDependencies = []
    answers.dependencies = []
    console.log(JSON.stringify(answers, null, '  '));
    config.savePackageJSON(JSON.stringify(answers, null, '  '))
});


