/** Norsk liste: "a", "a og b", "a, b og c" */
export function formatNbList(arr: readonly string[]): string {
    if (arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} og ${arr[1]}`;
    return `${arr.slice(0, -1).join(", ")} og ${arr[arr.length - 1]}`;
}
