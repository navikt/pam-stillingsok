const worktimeParser = (worktime) => {
    // We need this check in case of old workhour/-day property values, formatted like 'Opt1 Opt2'
    let items = [];
    try {
        const jsonArray = JSON.parse(worktime);

        for (let i = 0; i < jsonArray.length; i++) {
            items.push(jsonArray[i]);
        }
    } catch (e) {
        items.push(worktime);
    }
    return items.join(", ");
};

export default worktimeParser;
