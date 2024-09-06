module.exports = {
    log: (data) => {
        console.log("\n\x1b[38;5;206mDEV\n \x1b[0m" + JSON.stringify(data, undefined, 2));
    },
    fix: (data) => {
        return JSON.parse(JSON.stringify(data));
    }, // Monkeypatch for data not working for some reason
    teacherGradesAccessFilter: (e, items, fix) => {
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

            const fetchedClass = fix($app.dao().findRecordById("classes", item.class));
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
    },
    teacherClassesAccessFilter: (e, items, fix) => {
        // If accessing through PocketBase admin panel, ignore
        if (e.httpContext.get("admin") !== null)
            return items;

        const user = fix(e.httpContext.get("authRecord"));

        // Students viewing their own classes is secure by default
        if (user.collectionName !== "teachers")
            return items;

        // Admin teachers can view all of the data
        if (user.admin === true)
            return items;

        const filteredItems = [];

        items.forEach((ogItem) => {
            const item = fix(ogItem);

            // If teacher doesn't teach in that class, they can't view it
            // TODO: Make it only show the name instead (for searching students
            // in Messages class will have to fetched to view for example Foo Bar
            // (3d) but other data should stay censored)
            if (!Object.keys(item.teacher_subject_pairs).includes(user.id)) {
                return;
            }

            filteredItems.push(ogItem);
        });

        return filteredItems;
    },
}
