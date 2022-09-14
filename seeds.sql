INSERT INTO department (department_name)
VALUES ('Management');
INSERT INTO department (department_name)
VALUES ('Sales');
INSERT INTO department (department_name)
VALUES ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES ('General Manager', 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Assistant Manager', 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager', 70000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Salesman', 60000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Human Resources Manager', 70000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Human Resources Officer', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jane', 'Doe', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Willy', 'Peterson', 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Bobby', 'Brown', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Sally', 'Sue', 5, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Tommy', 'Thompson', 6, 5);