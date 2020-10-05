
const DefaultTolerance = 0.001;


export function roundToTol(num: number, tol = DefaultTolerance) {
    return Math.round(num / tol) * tol;
}