const chai = require('chai');
const expect = require('chai').expect;
const model = require('../models/CourseSearch/courseModel.js');

const orc = require('../data/oracle');

describe('Course Model', () => {
    describe('getLookup', () => {
        let data = {};

        // Get lookup form object
        it('Passing', (done) => {
            model.getLookup().then((result) => {
                expect(result).to.be.a('object');
                data = result;
                done();
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
        it('On fail', () => {
            let temp = orc.proc;
            orc.select = () => { throw new Error('asdfasdfasdf') };
            
            model.getLookup().then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
            });

            orc.select = temp;
        });
    });

    describe('getResults', () => {
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

        // Get search results object
        it('Passing', (done) => {
            model.getResults(reqBody).then((result) => {
                expect(result).to.be.a('array');
                expect(result[0]).to.be.an('object');
                data = result;
                done();
            });
        }).timeout(30000);

        // Check the returned objects properties
        it('Testing result object', () => {
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

            model.getResults(reqBody).then((result) => {
                // should not resolve
            }).catch((err) => {
                expect(err).to.be.an('error');
            });
        }).timeout(30000);
    });

    describe('getDeptsProgs', () => {
        let data = {};

        // Get Departments/Programs object
        it('Passing', (done) => {
            model.getDeptsProgs('20192').then((result) => {
                expect(result).to.be.an('object');
                data = result;
                done();
            });
        }).timeout(30000);

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

        // Failed request - error handling
        it('On Fail', () => {
            let temp = orc.proc;
            orc.proc = () => { throw new Error('asdfasdfasdf') };

            model.getDeptsProgs('201918').then((result) => {
                // should not resolve
            }).catch((err) => {
                expect(err).to.be.an('error');
            });

            orc.proc = temp;
        }).timeout(30000);
    });

    describe('getDetails', () => {
        let data = {};
        let reqBody = {
            crn: '11736',
            term: '201911'
        };

        // Get Details form object
        it('Passing', (done) => {
            model.getDetails(reqBody).then((result) => {
                expect(result).to.be.an('object');
                data = result.body;
                done();
            });
        }).timeout(30000);

        // Failed request - error handling
        it('On Fail', () => {
            let temp = orc.proc;
            orc.proc = () => { throw new Error('asdfasdfasdf') };

            model.getDeptsProgs().then((result) => {
                // should not resolve
            }).catch((err) => {
                expect(err).to.be.an('error');
                orc.proc = temp;
            });

        }).timeout(30000);

    });


});