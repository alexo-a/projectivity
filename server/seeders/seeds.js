const momentRandom = require('moment-random');

const faker = require('faker');
const bcrypt = require("bcrypt");
const db = require('../config/connection');
const { ProjectGroup, Project, Task, TimeSheetEntry, User } = require('../models');
const { findOne } = require('../models/User');


const dataToGenerate = 50;

db.once('open', async () => {
  await ProjectGroup.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
  await TimeSheetEntry.deleteMany({});
  await User.deleteMany({});

  // create user data
  const userData = [];

  for (let i = 0; i < dataToGenerate; i += 1) {
    const username = faker.internet.userName();
    const email = faker.internet.email(username);
    let password = 'password';
    password = await bcrypt.hash(password, 10);

    userData.push({ username, email, password });
  }

  console.log(userData);

  const createdUsers = await User.collection.insertMany(userData);

    // create project groups 
    const groupData = []

    for (let index = 0; index < createdUsers.ops.length; index++) {
        const { _id: administrator } = createdUsers.ops[index];
        const title = faker.company.companyName();
        groupData.push({ title, administrator });
    }
    
    const createdGroups = await ProjectGroup.collection.insertMany(groupData);

    // add managers to groups 
    for (let index = 0; index < createdGroups.ops.length; index++) {
        const { administrator, _id } = createdGroups.ops[index];
        let addedManagers = [];
        
        for (let index = 0; index < 2; index++) {
            const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
            let managerId = createdUsers.ops[randomUserIndex]._id

            while (managerId === administrator || addedManagers.includes(managerId)) {
                const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
                managerId = createdUsers.ops[randomUserIndex];
            }

            addedManagers.push(managerId);
            await ProjectGroup.updateOne({ _id: _id }, { $addToSet: { managers: managerId } });
        }
    }

    // add employees to groups 
    for (let index = 0; index < createdGroups.ops.length; index++) {
        const { administrator, _id } = createdGroups.ops[index];
        const { managers } = await ProjectGroup.findOne({ _id: _id });
        let addedEmployees = [];
        
        for (let index = 0; index < 5; index++) {
            const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
            let employeeId = createdUsers.ops[randomUserIndex]._id

            while (employeeId === administrator || addedEmployees.includes(employeeId) || managers.includes(employeeId)) {
                const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
                employeeId = createdUsers.ops[randomUserIndex];
            }

            addedEmployees.push(employeeId);
            await ProjectGroup.updateOne({ _id: _id }, { $addToSet: { employees: employeeId } });
        }
    }

    // add one project per group
    for (let index = 0; index < createdGroups.ops.length; index++) {
        const title = faker.commerce.productName();
        const description = faker.company.bs();
        const { _id: group } = createdGroups.ops[index];
        const { managers } = await ProjectGroup.findOne({ _id: group });
        
        const projectId = await Project.create({ title, description, group, managers});
        await ProjectGroup.updateOne({ _id: group }, { $addToSet: { projects: projectId } });
    }

    const projects = await Project.find();
    const tasks = []

    // add some tasks
    for (let index = 0; index < projects.length; index++) {
        const { _id: project } = projects[index];

        for (let index = 0; index < 4; index++) {
            const title = faker.hacker.verb();
            const description = faker.company.catchPhrase();

            const taskId = await Task.create({ title, description, project });
            await Project.updateOne({ _id: project }, { $addToSet: { tasks: taskId } });
            tasks.push(taskId);
        }
    }

    
    const projs = await Project.find({});
    // add employees to tasks
    for (let index = 0; index < projs.length; index++) {
        const proj = projs[index];
        const projId = proj._id;
        const projGroup = await ProjectGroup.findOne({ projects: projId });
        const { employees } = projGroup;
        for (let index = 0; index < proj.tasks.length; index++) {
            const randomUserIndex = Math.floor(Math.random() * employees.length);
            const employee = employees[randomUserIndex];
            const task = proj.tasks[index]
            
            await Task.updateOne({ _id: task }, { $addToSet: { employees: employee } });
        }
    }

    for (let index = 0; index < tasks.length; index++) {
        const taskId = tasks[index];
        const task = await Task.findOne({ _id: taskId });
        const employee = task.employees[0];
        const start = momentRandom('2013-02-08 10:30:26', '2013-02-08 09:30:26')
        const end = momentRandom('2013-02-08 15:30:26', '2013-02-08 12:30:26')
        const entries = await TimeSheetEntry.create({ task: task, start: start, end: end, user: employee });

        console.log(entries);
    }



    const data = await User.find();
    console.log(data);
  
    console.log('all done!');
    process.exit(0);
});