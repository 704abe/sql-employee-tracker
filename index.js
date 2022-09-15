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
  console.log(`Connected to the employees_db database.`)
);

mainMenu();

function mainMenu() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "mainMenuChoice",
        choices: [
            "view all departments", 
            "view all roles", 
            "view all employees",
            "add a department",
            // "add a role",
            // "add an employee",
            // "update an employee role",
        ]   
    }]).then(function (userInput) {
        switch(userInput.mainMenuChoice) {
            case "view all departments":
                viewDepartments();
                break;
            case "view all roles":
                viewRoles();
                break;
            case "view all employees":
                viewEmployees();
            case "add a department":
                addDepartment();
                break;
            // case "add a role":
            //     addRole();
            //     break;
            // case "add a employee":
            //     addEmployee();
            //     break;
            default:
                mainMenu();
        }
    })
}


function viewDepartments() {
    db.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        let departmentArray = [];
        res.forEach(department => departmentArray.push(department));
        console.table('\n', departmentArray);
        mainMenu();
    })
}

function viewRoles() {
    db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        let roleArray = [];
        res.forEach(role => roleArray.push(role));
        console.table('\n', roleArray);
        mainMenu();
    })
}

function viewEmployees() {
    db.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        let employeeArray = [];
        res.forEach(employee => employeeArray.push(employee));
        console.table('\n', employeeArray);
        mainMenu();
    })
}

const addDepartment = async() => {
    try {
        let response = await inquirer.prompt([
            {
                name: 'deptName',
                type: 'input',
                message: 'What is the department name?'
            }
        ]);

        // let sql = "INSERT INTO department (department_name) VALUES ?"
        db.query(`INSERT INTO department (department_name) VALUES ('${response.deptName}')`, function (err, result){
            if(err) throw err;
            console.log(`added ${response.deptName} to departments.`)
        });

        mainMenu();

    } catch (err) {
        console.log('\n', 'this is in the catch', '\n\n', err);
    };
}

// inquirer(employee){
//     first_name?
//     last_name?
//     role?{
//         list role
//     }
//     manager?{
//         list manager
//     }
//     UPDATE TABLE employee

// }