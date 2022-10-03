import mysql from 'mysql2';
import inquirer from 'inquirer';
import cTable from 'console.table';

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees_db'
  },
  console.log(`\nConnected to the employees_db database.\n`)
);

mainMenu();

async function mainMenu() {
    console.log('\nMain Menu\n');
    await inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "mainMenuChoice",
        choices: [
            "view all departments", 
            "view all roles", 
            "view all employees",
            "add a department",
            "add a role",
            "add an employee",
            "update an employee role",
        ]
    }]).then((response) => {
        switch(response.mainMenuChoice) {
            case "view all departments":
                viewDepartments();
                break;
            case "view all roles":
                viewRoles();
                break;
            case "view all employees":
                viewEmployees();
                break;
            case "add a department":
                addDepartment();
                break;
            case "add a role":
                addRole();
                break;
            case "add an employee":
                addEmployee();
                break;
            case "update an employee role":
                updateEmployee();
                break;
            default:
                mainMenu();
                break;
        }
    })
}

function viewDepartments() {
    console.log('\n\n view all departments \n');
    db.query('SELECT * FROM department', async function (err, res) {
        if (err) throw err;
        let departmentArray = [];
        await res.forEach(department => departmentArray.push(department));
        console.table(departmentArray);
        mainMenu();
    });
}

function viewRoles() {
    console.log('\n\n view all roles \n');
    db.query('SELECT * FROM role', async function (err, res) {
        if (err) throw err;
        let roleArray = [];
        await res.forEach(role => roleArray.push(role));
        console.table(roleArray);
        mainMenu();
    })

}

function viewEmployees() {
    console.log('\n\n view all employees \n');
    db.query('SELECT * FROM employee', async function (err, res) {
        if (err) throw err;
        let employeeArray = [];
        await res.forEach(employee => employeeArray.push(employee));
        console.table(employeeArray);
        mainMenu();
    });
}

function addDepartment() {
    console.log('\nadd a department\n');
    inquirer.prompt([
        {
            name: 'deptName',
            type: 'input',
            message: 'Name of new department?'
        }
    ]).then((response) => {
        db.query(`INSERT INTO department (department_name) VALUES ('${response.deptName}')`, (err, result) => {
            if (err){console.log(err)}
            console.log(`\n\nadded ${response.deptName} to departments.\n`)
            mainMenu();
        })
    })
}

function addRole() {
    console.log('\nadd a role\n');
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Name of new role?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Salary of new role?'
        },
        {
            name: 'id',
            type: 'input',
            message: 'Department of new role? (enter id number)'
        }
    ]).then(response => { 
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}','${response.salary}','${response.id}')`, (err, result) => {
            console.log('\n\n', `added ${response.title} to roles.`, '\n');
            mainMenu();
        });
    })
}

function addEmployee() {
    console.log('\nadd an employee\n');
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'First name?'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Last name?'
        },
        {
            name: 'roleId',
            type: 'input',
            message: 'Role of new employee? (enter id number)'
        },
        {
            name: 'managerId',
            type: 'input',
            message: 'Who is the manager of this employee? (enter id number)'
        }
    ]).then((response) => {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.firstName}','${response.lastName}','${response.roleId}','${response.managerId}' )`, (err, result) => {
        console.log('\n\n', `added ${response.firstName} ${response.lastName} to employees.`, '\n');
        mainMenu();
        })
    })
}

async function updateEmployee() {

    db.query('SELECT * FROM employee', async function (err, res) {
        if (err) throw err;
        // console.log(res);
        let response = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee will be updated?',
                choices: res.map(item => `${item.first_name} ${item.last_name} ${item.id}`)
            }
        ])
        let employeeId = response.employee.slice(-1);
        console.log(employeeId);
        db.query('SELECT * FROM role', async function (err2, res2) {
            if (err2) throw err2;
            let response2 = await inquirer.prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: 'Select a new role:',
                    choices: res2.map(item => `${item.title} ${item.id}`)
                }
            ])
            let roleId = response2.role.slice(-1);
            console.log(roleId);
            db.query(`UPDATE employee SET role_id=${roleId} WHERE id=${employeeId}`);
        })
    })
}
