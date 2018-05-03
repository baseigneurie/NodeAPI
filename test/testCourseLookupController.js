const chai = require('chai');
const expect = require('chai').expect;
const app = require('../app.js');
const orc = require('../data/oracle');

chai.use(require('chai-http'));

describe('Course Lookup Controller', () => {
    describe('Endpoint Tests', () => {
        describe('/course/lookup', () => {
            let data = {};

            // GET lookup form
            it('On Success', () => {
                return chai.request(app)
                    .get('/course/lookup')
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        // Store in var for future testing
                        data = res.body;
                    });
            });

            // Test Term object
            it('Term Object', () => {
                let t = data.term;
                expect(t).to.be.an('object');
                expect(t.selected).to.be.a('null');
                expect(t.allTerms).to.be.an('array');
                expect(t.allTerms[0]).to.have.property('TermCode').and.to.be.a('string');
                expect(t.allTerms[0]).to.have.property('TermName').and.to.be.a('string');
                expect(t.allTerms[0]).to.have.property('Default').and.to.be.a('string');
            });

            // Test Department object
            it('Department Object', () => {
                let d = data.department;
                expect(d).to.be.an('object');
                expect(d.selected).to.be.a('null');
                expect(d.allDepartments).to.be.an('array');
                expect(d.allDepartments[0]).to.have.property('DeptCode').and.to.be.a('string');
                expect(d.allDepartments[0]).to.have.property('DeptDescription').and.to.be.a('string');
            });

            // Test Program object
            it('Program Object', () => {
                let p = data.program;
                expect(p).to.be.an('object');
                expect(p.selected).to.be.a('null');
                expect(p.allPrograms).to.be.an('array');
                expect(p.allPrograms[0]).to.have.property('ProgCode').and.to.be.a('string');
                expect(p.allPrograms[0]).to.have.property('ProgName').and.to.be.a('string');
            });

            // Test Course Number object
            it('Course Number Object', () => {
                let cn = data.courseNumber;
                expect(cn).to.be.an('object');
                expect(cn.subject).to.be.a('null');
                expect(cn.course).to.be.a('null');
                expect(cn.section).to.be.a('null');
            });

            // Test Location object
            it('Location Object', () => {
                let l = data.location;
                expect(l).to.be.an('object');
                expect(l.selected).to.be.a('null');
                expect(l.allLocations).to.be.an('array');
                expect(l.allLocations[0]).to.have.property('CampCode').and.to.be.a('string');
                expect(l.allLocations[0]).to.have.property('CampDesc').and.to.be.a('string');
                expect(l.allLocations[0]).to.have.property('DICDCode').and.to.be.a('string');
            });

            // Test Delivery object
            it('Delivery Object', () => {
                let d = data.delivery;
                expect(d).to.be.an('object');
                expect(d.selected).to.be.a('null');
                expect(d.allMethods).to.be.an('array');
                expect(d.allMethods[0]).to.be.a('string');
            });

            // Test top-level properties
            it('Top-Level Object Properties', () => {
                expect(data.title).to.be.a('null');
                expect(data.trmlike).to.be.a('null');
                expect(data.trmnotlike).to.be.a('null');
                expect(data.searchResults).to.be.an('array').that.is.empty;
            });

            // Fail the retrieval
            it('On Fail', () => {
                let temp = orc.select;
                orc.select = () => { throw new Error('asdfasdfasdf') };
                
                return chai.request(app)
                .get('/course/lookup')
                .then((res) => {
                    expect(res.status).to.equal(500);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    orc.select = temp;
                });
            }).timeout(30000);
        });

        describe('/course/lookup/:term', () => {
            let data = {};

            // GET results
            // This is getting Departments and Progams via Term
            it('On Success', () => {
                // !!!!!
                // NOTE: The term number used in the request will have to be updated over time.
                // !!!!!
                return chai.request(app)
                    .get('/course/lookup/20192')
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        // Store in var for future testing
                        data = res.body;
                    });
            });

            // Test objects in Departments array
            it('Departments Array', () => {
                let d = data.depts;
                expect(d).to.be.an('array');
                expect(d[0]).to.be.an('object');
                expect(d[0]).to.have.property('DeptCode').and.to.be.a('string');
                expect(d[0]).to.have.property('DeptDescription').and.to.be.a('string');
            });

            // Test objects in Programs array
            it('Programs Array', () => {
                let p = data.progs;
                expect(p).to.be.an('array');
                expect(p[0]).to.be.an('object');
                expect(p[0]).to.have.property('ProgCode').and.to.be.a('string');
                expect(p[0]).to.have.property('ProgName').and.to.be.a('string');
            });

            // Fail the retrieval
            it('On Fail', () => {
                let temp = orc.proc;
                orc.proc = () => { throw new Error('asdfasdfasdf') };
                
                return chai.request(app)
                .get('/course/lookup/20192')
                .then((res) => {
                    expect(res.status).to.equal(500);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    orc.proc = temp;
                });

            }).timeout(30000);
        });

        describe('/course/search', () => {
            let data = {};
            let reqBody = {
                'ID':'',
                'term':{
                   'selected':{
                      'TermCode':'20191',
                      'TermName':'2018 Fall',
                      'Default':'Y',
                      'Like':null,
                      'NotLike':null
                   }
                },
                'department':{
                   'selected':null
                },
                'program':{
                   'selected':null
                },
                'courseNumber':{
                   'subject':'531',
                   'course':'110',
                   'section':null
                },
                'title':null,
                'location':{
                   'selected':null
                },
                'delivery':{
                   'selected':null
                },
                'trmlike':null,
                'trmnotlike':null,
                'searchResults':[]
             };

            // POST results
            // Submit form to get search results
            it('On Success', () => {
                return chai.request(app)
                    .post('/course/search')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('array');

                        // Store in var for future testing
                        data = res.body;
                    });
            }).timeout(30000);

            // Check the returned objects properties
            it('Response Object Props', () => {
                let x = data[0];
                expect(x).to.have.property('TermStart').and.to.be.a('string');
                expect(x).to.have.property('CodeKey').and.to.be.a('string');
                expect(x).to.have.property('CrnKey').and.to.be.a('string');
                expect(x).to.have.property('Title').and.to.be.a('string');
                expect(x).to.have.property('CourseNumber').and.to.be.a('string');
                expect(x).to.have.property('SubjectNumber').and.to.be.a('string');
                expect(x).to.have.property('CEUInd').and.to.be.a('string');
                expect(x).to.have.property('SchdCode').and.to.be.a('string');
                expect(x).to.have.property('AvailableSeats').and.to.be.a('number');
                expect(x).to.have.property('TermWeeks').and.to.be.a('number');
                expect(x).to.have.property('Credits').and.to.be.a('string');
                expect(x).to.have.property('Room').and.to.be.a('string');
                expect(x).to.have.property('BeginTime').and.to.be.a('string');
                expect(x).to.have.property('EndTime').and.to.be.a('string');
                expect(x).to.have.property('Building').and.to.be.a('string');
                expect(x).to.have.property('BuildingDesc').and.to.be.a('string');
                expect(x).to.have.property('DelMethod').and.to.be.a('string');
                expect(x).to.have.property('Fees').and.to.be.a('string');
                expect(x).to.have.property('Instructor').and.to.be.a('string');
                expect(x).to.have.property('Campus').and.to.be.a('string');
                expect(x).to.have.property('ClassType').and.to.be.a('string');
                expect(x).to.have.property('Weekday').and.to.be.a('string');
                expect(x).to.have.property('Hours').and.to.be.a('string');
                expect(x).to.have.property('Location').and.to.be.a('string');
                expect(x).to.have.property('FullCourseNum').and.to.be.a('string');
                expect(x).to.have.property('BookLink').and.to.be.a('string');
                expect(x).to.have.property('Class').and.to.be.a('string');
                expect(x).to.have.property('CrnDisp').and.to.be.a('string');
                expect(x).to.have.property('Sort').and.to.be.a('number');

                expect(x).to.have.property('Section').and.to.be.an('object');
                expect(x.Section).to.have.property('Num').and.to.be.a('string');
                expect(x.Section).to.have.property('StartDate').and.to.be.a('string');
                expect(x.Section).to.have.property('EndDate').and.to.be.a('string');
                expect(x.Section).to.have.property('Sunday').and.to.be.a('string');
                expect(x.Section).to.have.property('Monday').and.to.be.a('string');
                expect(x.Section).to.have.property('Tuesday').and.to.be.a('string');
                expect(x.Section).to.have.property('Wednesday').and.to.be.a('string');
                expect(x.Section).to.have.property('Thursday').and.to.be.a('string');
                expect(x.Section).to.have.property('Friday').and.to.be.a('string');
                expect(x.Section).to.have.property('Saturday').and.to.be.a('string');
            });

            // Failed request - error handling
            it('On Fail', () => {
                reqBody.term.selected.TermCode = '201918';
                return chai.request(app)
                    .post('/course/search')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(500);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        expect(res.body).to.have.property('message').and.to.be.a('string');
                        expect(res.body).to.have.property('title').and.to.be.a('string');
                        expect(res.body).to.have.property('errCode').and.to.be.a('number');
                    });
            }).timeout(30000);
        });
        
        describe('/course/details', () => {
            let data = {};
            // NOTE: Term will need to be updated as time goes on.
            let reqBody = {
                crn: '11736',
                term: '201911'
            };

            // POST results
            // Submit form to get course details
            it('On Success', () => {
                return chai.request(app)
                    .post('/course/details')
                    .send(reqBody)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        // Store in var for future testing
                        data = res.body;
                    });
            }).timeout(30000);

            // Check the returned details properties
            it('Details Object Props', () => {
                expect(data).to.have.property('Title').and.to.be.a('string');
                expect(data).to.have.property('Code').and.to.be.a('string');
                expect(data).to.have.property('CrsNumber').and.to.be.a('string');
                expect(data).to.have.property('SeqNumber').and.to.be.a('string');
                expect(data).to.have.property('Term').and.to.be.a('string');
                expect(data).to.have.property('Levels').and.to.be.a('string');
                expect(data).to.have.property('Campus').and.to.be.a('string');
                expect(data).to.have.property('SchedType').and.to.be.a('string');
                expect(data).to.have.property('Delivery').and.to.be.a('string');
                expect(data).to.have.property('CrHours').and.to.be.a('number');
                expect(data).to.have.property('Description').and.to.be.a('string');
                expect(data).to.have.property('Capacity').and.to.be.a('number');
                expect(data).to.have.property('SeatsTaken').and.to.be.a('number');
                expect(data).to.have.property('SeatsRemaining').and.to.be.a('number');

                expect(data).to.have.property('AvailTerms').and.to.be.a('array');
                expect(data.AvailTerms[0]).to.have.property('code').and.to.be.a('string');
                expect(data.AvailTerms[0]).to.have.property('desc').and.to.be.a('string');
            });

            // On fail - error handling
            it('On Fail', () => {
                let temp = {crn: '11736'};
                return chai.request(app)
                    .post('/course/details')
                    .send(temp)
                    .then((res) => {
                        expect(res.status).to.equal(500);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');

                        expect(res.body).to.have.property('message').and.to.be.a('string');
                        expect(res.body).to.have.property('title').and.to.be.a('string');
                        expect(res.body).to.have.property('errCode').and.to.be.a('number');
                    });
            }).timeout(30000);
        });


    });
});