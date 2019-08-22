export default function analytics(...props) {
    if (window.ga) {
        window.ga(...props);
    }
}
