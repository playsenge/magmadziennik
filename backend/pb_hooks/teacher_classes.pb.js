/// <reference path="../pb_data/types.d.ts" />

// Not each teacher should be able to view each grade, only those
// where students have class set to class where teacher is in teacher_subject_pairs
// and teaches the subject that grade is from OR teacher is admin
onRecordsListRequest((e) => {
   const utils = require(`${__hooks}/utils.js`);

   e.result.items = utils.teacherGradesAccessFilter(e, e.result.items, utils.fix);
}, "grades");

onRecordViewRequest((e) => {
   const utils = require(`${__hooks}/utils.js`);

   e.record = utils.teacherGradesAccessFilter(e, [e.record], utils.fix)[0];
}, "grades");

// Non-admin teachers should only be allowed to see data of classes that they teach in
// OR see only the name if they request it, no more
onRecordsListRequest((e) => {
   const utils = require(`${__hooks}/utils.js`);
   
   e.result.items = utils.teacherClassesAccessFilter(e, e.result.items, utils.fix);
}, "classes");

onRecordViewRequest((e) => {
   const utils = require(`${__hooks}/utils.js`);

   e.record = utils.teacherClassesAccessFilter(e, [e.record], utils.fix)[0];
}, "classes");
