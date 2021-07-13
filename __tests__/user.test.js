const { TestWatcher } = require('jest');
const mockingoose = require('mockingoose');
const request = require('supertest');
const index = require('../index.js');
const DBConnection = require('../dbconnection.js');
const mongoose = require('mongoose');
const { deleteOne } = require('../models/user.js');

let server;
dbconnection = new DBConnection.DBConnection(server);

describe('User features', () => {
    beforeEach(async () => {
        dbconnection.runServer(index.app);
    });

    test('Test user registration without data', () => {
        request(index.app).post('/user/register').expect(406);
    });

    test('Test user registration with complete data package', () => {
        const req = {
            firstname: 'firstname',
            lastname: 'lastname',
            email: 'test@email.com',
            password: 'dummyPassword1',
        }
        
        const dummy_res = {
            firstname: "firstname",
            lastname: "lastname",
            email: "test@email.com",
            password: "dummyPassword1",
            organization: undefined,
        }

        const res = request(index.app).post('/user/register').send(req).expect(201);
        expect(JSON.stringify(res._data)).toBe(JSON.stringify(dummy_res));
    })

    test('Test user registration with incomplete data package', () => {
        const req = {
            firstname: 'firstname',
            email: 'test@email.com',
            password: 'dummyPassword1',
        }

        const res = request(index.app).post('/user/register').send(req).expect(406);
    });
});

afterAll((done) => {
    done();
  });