const orc = require('../../data/oracle');
const qry = require('../../data/queries');
const null_helper = require('../../helpers/nullcheck');
let moment = require('moment');

function loadSearchResults(data, lkp) {
    let courses = [];

    if (data && data.length > 0) {
        for (let row of data) {
            row = null_helper.nullCheckRow(row);

			let starting = moment(row[17]).add(1, 'hours');
			let ending = moment(row[16]).add(1, 'hours');

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
                Credits: row[11].toFixed(1),
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
					StartDate: starting.format('l'),
					EndDate: ending.format('l'),
                    Sunday: row[18],
                    Monday: row[19],
                    Tuesday: row[20],
                    Wednesday: row[21],
                    Thursday: row[22],
                    Friday: row[23],
                    Saturday: row[24]
                },
				ClassType: row[30]
            };

            courses.push(r);
        }
    }

    courses = prepCourses(courses, lkp);
    return courses;
}

function loadSearchParams(lkp) {
    try {
        let d = '%';

        if (!null_helper.nullOrBlank(lkp.delivery.selected)) {
            d = lkp.delivery.selected;
            if (online(d)) {
                d = '%';
            }
        }

        let params = {
            term: null_helper.nullOrBlank(lkp.term.selected.TermCode) ? '%' : lkp.term.selected.TermCode,
            dept: null_helper.nullOrBlank(lkp.department.selected) ? '%' : lkp.department.selected,
            subject: null_helper.nullOrBlank(lkp.courseNumber.subject) ? '%' : lkp.courseNumber.subject.toString(),
            course: null_helper.nullOrBlank(lkp.courseNumber.course) ? '%' : lkp.courseNumber.course.toString(),
            section: null_helper.nullOrBlank(lkp.courseNumber.section) ? '%' : lkp.courseNumber.section.toString(),
            title: null_helper.nullOrBlank(lkp.title) ? '%' : lkp.title,
            campus: null_helper.nullOrBlank(lkp.location.selected) ? '%' : lkp.location.selected,
            delivery: d,
            program: null_helper.nullOrBlank(lkp.program.selected) ? '%' : lkp.program.selected,
            trmlike: null_helper.nullOrBlank(lkp.trmlike) ? '' : lkp.trmlike.toString(),
            trmnotlike: null_helper.nullOrBlank(lkp.trmnotlike) ? '' : lkp.trmnotlike.toString()
        };

        return params;
    } catch(err) {
        throw err;
    }
}

function getResults(lkp) {
    return new Promise((resolve, reject) => {
        let params = loadSearchParams(lkp);
        orc.proc(qry.getSearchResults, params).then((res) => {
            if (!res || res.length === 0) throw new Error('No search results were returned');
            resolve(loadSearchResults(res, lkp));
        }).catch((err) => {
            reject(err);
        });
    });
}

function getResultsByCourse(lkp) {
    return new Promise((resolve, reject) => {
        let filter = loadSearchParams(lkp);
        let params = { subject: filter.subject, course: filter.course };
        orc.proc(qry.getResultsByCourse, params).then((res) => {
            if (!res || res.length === 0) throw new Error('No search results were returned');
            resolve(loadSearchResults(res, lkp));
        }).catch((err) => {
            reject(err);
        });
    });
}

function prepCourses(courses, lkp) {
    let crn = 0;
    let sort = 0;

    if (online(lkp.delivery.selected)) {
        courses = courses.filter(function(item) {
            return (item.DelMethod === lkp.delivery.selected || item.DelMethod === 'MyChoice');
        });
    }

    courses.sort(compare);

	// Sort the dates first.
	let tempArray = [];
	courses.forEach((item) => {
		if (item.CrnKey !== crn) {
			let group = courses.filter((crs) => { return crs.CrnKey === item.CrnKey});
			if (group.length !== 0) {
				group.sort((a, b) => {
					return new Date(a.Section.StartDate) - new Date(b.Section.StartDate);
				});

				if (tempArray.length > 0) {
					tempArray = tempArray.concat(group);
				} else {
					tempArray = group;
				}
			}
		}
		crn = item.CrnKey;
	});

	courses = tempArray;
	crn = 0;

    courses.forEach(function(item) {
		// item = findDates(item);

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

        item.BookLink = 'http://www.bkstr.com/webapp/wcs/stores/servlet/booklookServlet?bookstore_id-1=798&term_id-1=' +
            lkp.term.selected.TermCode + '&div-1=&dept-1=' +
            item.SubjectNumber + '&course-1=' +
            item.CourseNumber + '&section-1=' + item.Section.Num;

        if (item.AvailableSeats < 0 || item.AvailableSeats === '') {
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
    let startDate = new Date(item.Section.StartDate);
    let endDate = new Date(item.Section.EndDate);
	item.Section.StartDate = (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + startDate.getFullYear();
	item.Section.EndDate = (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + endDate.getFullYear();
    return item;
}

function findWeekday(item) {
    let sec = item.Section;

    if (sec.Monday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Monday : item.Weekday += ', ' + sec.Monday;
    }
	if (sec.Tuesday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Tuesday : item.Weekday += ', ' + sec.Tuesday;
    }
	if (sec.Wednesday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Wednesday : item.Weekday += ', ' + sec.Wednesday;
    }
	if (sec.Thursday !== '') {
        item.Weekday === '' ? item.Weekday = 'Th' : item.Weekday += ', Th';
    }
	if (sec.Friday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Friday : item.Weekday += ', ' + sec.Friday;
    }
	if (sec.Saturday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Saturday : item.Weekday += ', ' + sec.Saturday;
    }
	if (sec.Sunday !== '') {
        item.Weekday === '' ? item.Weekday = sec.Sunday : item.Weekday += ', ' + sec.Sunday;
    }

    return item;
}

function findLocation(item) {
    let location = '';

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
            case 'PBC':
            case 'VBC':
            case 'CD':
            case 'VC1':
                location = item.DelMethod;
                break;

            case 'VC2':
                location = item.DelMethod + "<br />" + location;
                break;

            case 'CBT':
            case 'INT':
            case 'VC3':
            case 'VC4':
            case 'CCN':
            case 'SI':
            case 'RIS':
            case 'TLP':
            case 'TV1':
            case 'TV2':
            case 'WTC':
            case 'WON':
            case 'FE':
            case 'MC':
                location = "<a href='https://mycvtc.cvtc.edu/site/student/Pages/Ways-of-Learning.aspx' target='_blank'>" + item.DelMethod + '</a><br />' + location;
                break;

            default:
                break;
        }
    }

    return location;
}

function convertTime(item) {
    let startPeriod = ' AM';
    let endPeriod = ' AM';
    let start = parseInt(item.BeginTime);
    let end = parseInt(item.EndTime);

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
    let s = time.toString();
    let len = s.length;
    return s.substring(0, (len - 2)) + ':' + s.substring(len - 2);
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
    getResults: getResults,
    getResultsByCourse: getResultsByCourse
}
