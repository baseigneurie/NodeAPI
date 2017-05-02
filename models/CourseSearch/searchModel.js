
var nullHelper = require('../../helpers/nullcheck');

function loadSearchResults(data, lkp) {
    let courses = [];

    if (data && data.length > 0) {
        for (let row of data) {

            row = nullHelper.nullCheckRow(row);

            let r = {
                TermStart: row[0].toString(),
                CodeKey: row[1],
                CrnKey: row[2],
                Title: row[3],
                CourseNumber: row[4],
                SubjectNumber: row[5],
                CEUInd: row[6],
                SchdCode: row[8],
                AvailableSeats: row[9],
                TermWeeks: row[10],
                Credits: row[11],
                Room: row[12],
                BeginTime: row[13],
                EndTime: row[14],
                Building: row[15],
                BuildingDesc: row[28],
                DelMethod: row[29],
                Fees: row[25],
                Instructor: row[26],
                Campus: row[27],
                Section: {
                    Num: row[7],
                    StartDate: row[17].toString(),
                    EndDate: row[16].toString(),
                    Sunday: row[18],
                    Monday: row[19],
                    Tuesday: row[20],
                    Wednesday: row[21],
                    Thursday: row[22],
                    Friday: row[23],
                    Saturday: row[24]
                }
            };

            courses.push(r);
        }
    }

    courses = prepCourses(courses, lkp);

    return courses;
}

function loadSearchParams(lkp) {
    try {
        var d = '%';

        if (!nullHelper.nullOrBlank(lkp.delivery.selected)) {
            d = lkp.delivery.selected;
            if (online(d)) {
                d = '%';
            }
        }

        let params = {
            term: nullHelper.nullOrBlank(lkp.term.selected) ? '%' : lkp.term.selected,
            dept: nullHelper.nullOrBlank(lkp.department.selected) ? '%' : lkp.department.selected,
            subject: nullHelper.nullOrBlank(lkp.courseNumber.subject) ? '%' : lkp.courseNumber.subject.toString(),
            course: nullHelper.nullOrBlank(lkp.courseNumber.course) ? '%' : lkp.courseNumber.course.toString(),
            section: nullHelper.nullOrBlank(lkp.courseNumber.section) ? '%' : lkp.courseNumber.section.toString(),
            title: nullHelper.nullOrBlank(lkp.title) ? '%' : lkp.title,
            campus: nullHelper.nullOrBlank(lkp.location.selected) ? '%' : lkp.location.selected,
            delivery: d,
            program: nullHelper.nullOrBlank(lkp.program.selected) ? '%' : lkp.program.selected,
            trmlike: nullHelper.nullOrBlank(lkp.trmlike) ? '%' : lkp.trmlike.toString(),
            trmnotlike: nullHelper.nullOrBlank(lkp.trmnotlike) ? '%' : lkp.trmnotlike.toString()
        };

        return params;
    } catch(err) {
        throw err;
    }
}

function getResults(orc, lkp, qry) {
    return new Promise((resolve, reject) => {
        try {
            let params = loadSearchParams(lkp);
            orc.proc(qry.getSearchResults, params, (err, data) => {
                if (err) reject(err);
                let results = loadSearchResults(data, lkp);
                resolve(results);
            });
        } catch(err) {
            reject(err);
        }
    });
}

function prepCourses(courses, lkp) {
    var crn = 0;
    var sort = 0;

    if (online(lkp.delivery.selected)) {
        courses = courses.filter(function(item) {
            return (item.DelMethod === lkp.delivery.selected || item.DelMethod === 'MyChoice');
        });
    }

    courses.sort(compare);

    courses.forEach(function(item) {
        item = findDates(item);

        item.Weekday = '';
        item = findWeekday(item);

        item.Hours = '';
        if (item.BeginTime) {
            item = convertTime(item);
            item.Hours = item.BeginTime + ' - ' + item.EndTime;
        }

        item.Location = findLocation(item);

        item.FullCourseNum = item.SubjectNumber + '-' + item.CourseNumber + '-' + item.Section.Num;

        item.Credits = item.Credits.toString();

        item.Fees = item.Fees.trim();

        item.BookLink = "XXXXXXXXXXXXX" +
            lkp.term.selected + '&div-1=&dept-1=' +
            item.SubjectNumber + '&course-1=' +
            item.CourseNumber + '&section-1=' + item.Section.Num;

        if (item.AvailableSeats < 0) {
            item.AvailableSeats = 0;
        }

        item.Class='firstRow';
        item.CrnDisp = item.CrnKey;
        if (item.CrnKey === crn) {
            item.Class='hidden-row';
            item.CrnDisp = 'AND';
            item.BookLink = '';

            // Needed for sorting by columns
            sort++;
            item.Sort = sort;
        } else {
            sort = 0;
            item.Sort = 0;
        }
        crn = item.CrnKey;
    });

    return courses;
}

function findDates(item) {
    var startDate = new Date(item.Section.StartDate);
    var endDate = new Date(item.Section.EndDate);
    item.Section.StartDate = startDate.toLocaleDateString();
    item.Section.EndDate = endDate.toLocaleDateString();
    return item;
}

function findWeekday(item) {
    var sec = item.Section;

    if (sec.Monday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Monday : item.Weekday += "<br />" + sec.Monday;
    } else if (sec.Tuesday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Tuesday : item.Weekday += "<br />" + sec.Tuesday;
    } else if (sec.Wednesday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Wednesday : item.Weekday += "<br />" + sec.Wednesday;
    } else if (sec.Thursday !== '') {
        item.Weekday === '' ? item.Weekday = 'Th' : item.Weekday += "<br />Th";
    } else if (sec.Friday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Friday : item.Weekday += "<br />" + sec.Friday;
    } else if (sec.Saturday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Saturday : item.Weekday += "<br />" + sec.Saturday;
    } else if (sec.Sunday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Sunday : item.Weekday += "<br />" + sec.Sunday;
    }

    return item;
}

function findLocation(item) {
    var location = '';

    if (item.Building.toUpperCase() === 'TPHI') {
        location = item.Campus;
    } else {
        if (item.Building.length > 0) {
            location = item.BuildingDesc;
        }

        if (item.Building.length > 0 && item.Room.length > 0) {
            location += ' - ' + item.Room;
        }

        switch(item.SchdCode.toUpperCase()) {
            case "PBC":
            case "VBC":
            case "CD":
            case "VC1":
                location = item.DelMethod;
                break;

            case "VC2":
                location = item.DelMethod + "<br />" + location;
                break;

            case "CBT":
            case "INT":
            case "VC3":
            case "VC4":
            case "CCN":
            case "SI":
            case "RIS":
            case "TLP":
            case "TV1":
            case "TV2":
            case "WTC":
            case "WON":
            case "FE":
            case "MC":
                location = "<a href='XXXXXXXXXXXXX' target='_blank'>" + item.DelMethod + "</a><br />" + location;
                break;

            default:
                break;
        }
    }

    return location;
}

function convertTime(item) {
    var startPeriod = ' AM';
    var endPeriod = ' AM';
    var start = parseInt(item.BeginTime);
    var end = parseInt(item.EndTime);

    if (start >= 1200) {
        startPeriod = ' PM';

        if (start >= 1300) {
            start = start - 1200;
        }
    }

    if (end >= 1200) {
        endPeriod = ' PM';

        if (end >= 1300) {
            end = end - 1200;
        }
    }

    item.BeginTime = parseTime(start) + startPeriod;
    item.EndTime = parseTime(end) + endPeriod;

    return item;
}

function parseTime(time) {
    var s = time.toString();
    var len = s.length;
    return s.substring(0, (len - 2)) + ":" + s.substring(len - 2);
}

function compare(a, b) {
    if (a.CrnKey < b.CrnKey) {
        return -1;
    }
    if (a.CrnKey > b.CrnKey) {
        return 1;
    }
    return 0;
}

function online(method) {
    if (method === 'Internet-Online' || method === 'Hybrid-Multiple Delivery') {
        return true;
    }

    return false;
}


module.exports = {
    getResults: getResults
}
