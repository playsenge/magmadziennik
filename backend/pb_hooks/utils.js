module.exports = {
    log: (data) => {
        console.log("\n\x1b[38;5;206mDEV\n \x1b[0m" + JSON.stringify(data, undefined, 2));
    },
    fix: (data) => {
        return JSON.parse(JSON.stringify(data));
    }, // Monkeypatch for data not working for some reason
    teacherFilter: (e, items, fix) => {
        // If accessing through PocketBase admin panel, ignore
        if (e.httpContext.get("admin") !== null)
            return items;

        const user = fix(e.httpContext.get("authRecord"));

        // Students viewing their own grades is secure by default
        if (user.collectionName !== "teachers")
            return items;

        // Admin teachers can view all of the data
        if (user.admin === true)
            return items;

        const filteredItems = [];

        items.forEach((ogItem) => {
            const item = fix(ogItem);

            const fetchedStudent = fix($app.dao().findRecordById("students", item.student));

            // If student is not in any class, only administrators can view their grades
            if (fetchedStudent.class === "")
                return;

            const fetchedClass = fix($app.dao().findRecordById("classes", fetchedStudent.class));
            const pairs = fetchedClass.teacher_subject_pairs;

            const matchedPairs = fix(pairs[user.id]) || [];

            // If teacher doesn't teach that student that subject in that class then they can't see that grade
            if (!matchedPairs.includes(item.subject)) {
                return;
            }

            // If all conditions match, include grade in response!
            filteredItems.push(ogItem);
        });

        return filteredItems;
    }
}
