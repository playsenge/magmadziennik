/// <reference path="../pb_data/types.d.ts" />

// Not each teacher should be able to view each grade, only those
// where students have class set to class where teacher is in teacher_subject_pairs
// and teaches the subject that grade is from OR teacher is admin
onRecordsListRequest((e) => {
   const utils = require(`${__hooks}/utils.js`);

   e.result.items = utils.teacherFilter(e, e.result.items, utils.fix);
}, "grades");

onRecordViewRequest((e) => {
   const utils = require(`${__hooks}/utils.js`);
   
   e.record = utils.teacherFilter(e, [e.record], utils.fix)[0];
}, "grades");
