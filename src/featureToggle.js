export default function featureToggle() {
    const value = localStorage.getItem('toggleFeatures');
    return value === 'favoritter';
}
