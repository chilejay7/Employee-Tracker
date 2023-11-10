const inquirer = require('inquirer');
const dotenv = require('dotenv');
const { showDeptQuery, showRoleQuery, showEmployeesQuery, addDeptQuery, addRoleQuery } = require('./scripts/query');

const mysql = require('mysql2');
dotenv.config();

const db = mysql.createConnection (
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    }
);

// This array is used to present the main menu options through inquirer on start.
const menuOptions = [
'View all departments', 
'View all roles', 
'View all employees', 
'Add a department', 
'Add a role', 
'Add an employee', 
'Update an employee role',
];

// The main menu prompts are presented to user's through this menu.
const questions = [
    {
        type: 'list',
        message: 'Please select the operation you would like to complete',
        name: 'menuSelection',
        choices: menuOptions,
    },
];

const deptQuestions = [
    {
        type: 'input',
        message: "What is the name of the department you would like to add?",
        name: 'newDeptName',
    }
]
const roleQuestions = [
    {
        type: 'input',
        message: "What is the name of the role you would like to add?",
        name: 'newRoleName',
    },
    {
        type: 'input',
        message: "What is the salary for this role?",
        name: 'newRoleSalary',
    },
    {
        type: 'input',
        message: "Which department does this role belong to?",
        name: 'newRoleDept',
    }
]

const newDept = async () => {
    const deptName = await inquirer.prompt(deptQuestions);
    const { newDeptName } = deptName;
    addDeptQuery(newDeptName);
    showDeptQuery();
}

const addRole = async () => {
    const newRole = await inquirer.prompt(roleQuestions);
    const { newRoleName, newRoleSalary, newRoleDept } = newRole;
    addRoleQuery(newRoleName, newRoleSalary, newRoleDept);
    showRoleQuery();
}

// Ternary operator built into a function used to evaluate the response in the menu.  The selection parameter will be passed as an argument from the
// destructured object specified in the init function.
const selectQuery = (selection) => {
    selection === 'View all departments' ? showDeptQuery()
        : selection === 'View all roles' ? showRoleQuery()
        : selection === 'View all employees' ? showEmployeesQuery()
        : selection === 'Add a department' ? newDept()
        : selection === 'Add a role' ? addRole()
        : selection === 'Add an employee' ? console.log('Adding employee')
        : selection === 'Update an employee role' ? console.log(`Updating employee's role`)
        : console.log('Try again.')
};

// This initializes the application and runs the prompts.  The answers object returned from the user's menu selection is destructured.
const init = async () => {
    console.log(process.env.DB_DATABASE)
    const answers = await inquirer.prompt(questions);
    const { menuSelection } = answers;
    selectQuery(menuSelection);
};

init();