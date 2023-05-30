const worktimeParser = (worktime) => {
    // We need this check in case of old workhour/-day property values, formatted like 'Opt1 Opt2'
    const items = [];
    try {
        const jsonArray = JSON.parse(worktime);

        for (let i = 0; i < jsonArray.length; i += 1) {
            items.push(jsonArray[i]);
        }
    } catch (e) {
        items.push(worktime);
    }
    return items.join(", ");
};

export default worktimeParser;
