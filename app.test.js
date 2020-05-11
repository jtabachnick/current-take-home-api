const request = require("supertest");
const app = require("./app");
const { getVisit, saveVisit, searchVisits } = require('./visits');


jest.mock('./visits')

describe("Test routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    test("bad get request no params", done => {
        request(app)
            .get("/visit")
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });

    test('get visit', done => {
        getVisit.mockReturnValueOnce([{
            userId: 'testUser',
            name: 'testLocation',
            visitId: 'testId'
        }])
        request(app)
            .get("/visit?visitId=1234")
            .then(response => {
                expect(getVisit).toBeCalled();
                expect(response.body).toStrictEqual([{
                    userId: 'testUser',
                    name: 'testLocation',
                    visitId: 'testId'
                }]);
                expect(response.statusCode).toBe(200);
                done();
            });
    });

    test('get visit error', done => {
        getVisit.mockRejectedValue(new Error('test error'))
        request(app)
            .get("/visit?visitId=1234")
            .then(response => {
                expect(getVisit).toBeCalled();
                expect(response.text).toStrictEqual('we have encountered an error: Error: test error');
                expect(response.statusCode).toBe(500);
                done();
            });
    });


    test('search visits', done => {
        const expected = [{
            userId: 'testUser',
            name: 'testLocation1',
            visitId: 'testId1'
        }, {
            userId: 'testUser',
            name: 'testLocation2',
            visitId: 'testId2'
        },]
        searchVisits.mockReturnValueOnce(expected)
        request(app)
            .get("/visit?userId=1234&searchString=test")
            .then(response => {
                expect(searchVisits).toBeCalled();
                expect(response.body).toStrictEqual(expected);
                expect(response.statusCode).toBe(200);
                done();
            });
    });

    test('search visits error', done => {
        searchVisits.mockRejectedValue(new Error('test error'))
        request(app)
            .get("/visit?userId=1234&searchString=test")
            .then(response => {
                expect(searchVisits).toBeCalled();
                expect(response.text).toStrictEqual('we have encountered an error: Error: test error');
                expect(response.statusCode).toBe(500);
                done();
            });
    });


    test('save visit bad request', done => {
        request(app)
            .post('/visit')
            .send({ test: "testUser", bad: "testLocation" })
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            })
    });

    test('save visit', done => {
        const expected = { visitId: '1234' };
        saveVisit.mockReturnValueOnce(expected);
        request(app)
            .post('/visit')
            .send({ userId: "testUser", name: "testLocation" })
            .set('Accept', 'application/json')
            .then(response => {
                expect(saveVisit).toBeCalled();
                expect(response.body).toStrictEqual(expected);
                expect(response.statusCode).toBe(200);
                done();
            })
    });

    test('save visit error', done => {
        saveVisit.mockRejectedValue(new Error('test error'))
        request(app)
            .post('/visit')
            .send({ userId: "testUser", name: "testLocation" })
            .set('Accept', 'application/json')
            .then(response => {
                expect(saveVisit).toBeCalled();
                expect(response.text).toStrictEqual('we have encountered an error: Error: test error');
                expect(response.statusCode).toBe(500);
                done();
            })
    });


});