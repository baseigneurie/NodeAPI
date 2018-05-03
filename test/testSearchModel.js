const chai = require('chai');
const expect = require('chai').expect;
const model = require('../models/CourseSearch/searchModel.js');

const orc = require('../data/oracle');

describe('Search Model', () => {
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

    describe('getResults', () => {
        let data = {};

        // Get locations
        it('Passing', (done) => {
            model.getResults(reqBody).then((result) => {
                expect(result).to.be.an('array');
                expect(result[0]).to.be.an('object');
                data = result;
                done();
            });
        }).timeout(30000);

        // Check the returned objects properties
        it('Search Results Object Props', () => {
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

        // Failed retrieval
        it('Failed', (done) => {
            let temp = orc.proc;
            orc.proc = () => { throw new Error('asdfasdfasdf') };

            model.getResults().then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
                orc.proc = temp;
            });            
            done();
        });
    });

    describe('getResultsByCourse', () => {
        let data = {};

        reqBody.term.selected = {};

        // Get locations
        it('Passing', (done) => {
            model.getResultsByCourse(reqBody).then((result) => {
                expect(result).to.be.an('array');
                expect(result[0]).to.be.an('object');
                data = result;
                done();
            });
        });

        // Check the returned objects properties
        it('Search Results Object Props', () => {
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

        // Failed retrieval
        it('Failed', (done) => {
            let temp = orc.proc;
            orc.proc = () => { throw new Error('asdfasdfasdf') };

            model.getResults().then((result) => {
            }).catch((err) => {
                expect(err).to.be.an('error');
                orc.proc = temp;
            });
            done();
        });
    });
});