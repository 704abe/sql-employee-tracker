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
            "exit"
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
                db.end();
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
        await inquirer.prompt({
            name: 'continue',
            type: 'input',
            message: 'Press enter to continue...',
          });
        mainMenu();
    });
}

function viewRoles() {
    console.log('\n\n view all roles \n');
    db.query('SELECT role.id, title, salary, department_name AS department FROM role LEFT JOIN department ON role.department_id = department.id', async function (err, res) {
        if (err) throw err;
        console.table(res);
        await inquirer.prompt({
            name: 'continue',
            type: 'input',
            message: 'Press enter to continue...',
          });
        mainMenu();
    })

}

function viewEmployees() {
    console.log('\n\n view all employees \n');
    let query = `
        SELECT employees.id, employees.first_name, employees.last_name, role.title, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department_name AS department
        FROM employee employees
        LEFT JOIN employee manager
            ON employees.manager_id = manager.id
        LEFT JOIN role
            ON employees.role_id = role.id
        LEFT JOIN department
            ON role.department_id = department.id`
    db.query(query, async function (err, res) {
        if (err) throw err;
        let employeeArray = [];
        await res.forEach(employee => employeeArray.push(employee));
        console.table(employeeArray);
        await inquirer.prompt({
            name: 'continue',
            type: 'input',
            message: 'Press enter to continue...',
          });
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
        db.query(`INSERT INTO department (department_name) VALUES ('${response.deptName}')`, async function (err, result) {
            if (err){console.log(err)}
            console.log(`\nadded ${response.deptName} to departments.\n`)
            await inquirer.prompt({
                name: 'continue',
                type: 'input',
                message: 'Press enter to continue...',
              });
            mainMenu();
        })
    })
}

function addRole() {
    console.log('\nadd a role\n');
    db.query('SELECT * FROM department', async function (err, res) {
        if (err) throw err;
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
                type: 'list',
                message: 'Department of new role?',
                choices: res.map(item => `${item.id} ${item.department_name}`)
            }
        ]).then(response => { 
            let deptId = response.id[0];
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}','${response.salary}','${deptId}')`, async function (err, result) {
                if (err) throw err;
                console.log('\n', `added ${response.title} to roles.`, '\n');
                await inquirer.prompt({
                    name: 'continue',
                    type: 'input',
                    message: 'Press enter to continue...',
                  });
                mainMenu();
            });
        })
    }) 
}

function addEmployee() {
    console.log('\nadd an employee\n');
    db.query('SELECT * FROM employee', async function (err2, res2){
        if (err2) throw err2;
        db.query('SELECT * FROM role', async function (err, res){
            if (err) throw err;
            let selectManager = res2.map(item => `${item.id} ${item.first_name} ${item.last_name}`)
            selectManager.push('null');
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
                    name: 'role',
                    type: 'list',
                    message: 'Role of new employee?',
                    choices: res.map(item => `${item.id} ${item.title}`)
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Who is the manager of this employee?',
                    choices: selectManager
                }
            ]).then((response) => {
                let roleId = response.role[0];
                let managerId = response.manager[0];
                if(managerId === 'n'){
                    managerId = 0
                }
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.firstName}','${response.lastName}','${roleId}','${managerId}' )`, async function (err, result) {
                    if (err) throw err;
                    console.log('\n', `added ${response.firstName} ${response.lastName} to employees.`, '\n');
                    await inquirer.prompt({
                        name: 'continue',
                        type: 'input',
                        message: 'Press enter to continue...',
                    });
                    mainMenu();
                })
            })
        })
    })
}

async function updateEmployee() {

    db.query('SELECT * FROM employee', async function (err, res) {
        if (err) throw err;
        let response = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee will be updated?',
                choices: res.map(item => `${item.id} ${item.first_name} ${item.last_name}`)
            }
        ])
        let employeeId = response.employee[0];
        // console.log(employeeId);
        db.query('SELECT * FROM role', async function (err2, res2) {
            if (err2) throw err2;
            let response2 = await inquirer.prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: 'Select a new role:',
                    choices: res2.map(item => `${item.id} ${item.title}`)
                }
            ])
            let roleId = response2.role[0];
            // console.log(roleId);
            db.query('SELECT * FROM employee', async function (err3, res3) {
                if (err3) throw err3;
                let newManager = res3.map(item => `${item.id} ${item.first_name} ${item.last_name}`)
                newManager.push('null');
                let response3 = await inquirer.prompt([
                    {
                        name: 'manager',
                        type: 'list',
                        message: 'Select a new manager:',
                        choices: newManager
                    }
                ])
                let managerId = response3.manager[0];
                if(managerId === 'n'){
                    managerId = 0
                }
                db.query(`UPDATE employee SET role_id=${roleId}, manager_id=${managerId} WHERE id=${employeeId}`, async function (err, res) {
                    if (err) throw err;
                    console.log(`\nupdated ${(response.employee).slice(2)}'s role to ${(response2.role).slice(2)}.\n`)
                    await inquirer.prompt({
                        name: 'continue',
                        type: 'input',
                        message: 'Press enter to continue...',
                    });
                    mainMenu();
                });
            })
        })
    })
}
