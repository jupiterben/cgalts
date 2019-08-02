import assert = require("assert");

export enum Sign {
    NEGATIVE = -1, ZERO = 0, POSITIVE = 1,

    // Orientation constants:
    RIGHT_TURN = -1, LEFT_TURN = 1,

    CLOCKWISE = -1, COUNTERCLOCKWISE = 1,

    COLLINEAR = 0, COPLANAR = 0, DEGENERATE = 0,

    // Oriented_side constants:
    ON_NEGATIVE_SIDE = -1, ON_ORIENTED_BOUNDARY = 0, ON_POSITIVE_SIDE = 1,

    // Comparison_result constants:
    SMALLER = -1, EQUAL = 0, LARGER = 1
};
export type Orientation = Sign;
export type Real = number;
export type Int = number;

class _One_root_point_2 {
    _x: number;
    _y: number;
    x() { return this._x; }
    y() { return this._y; }
}
export type Point_2 = _One_root_point_2;


function Compare_number(a: number, b) {
    if (a < b) return Sign.SMALLER;
    if (a > b) return Sign.LARGER;
    return Sign.EQUAL;
}

export function Compare_xy_2(p1, p2): Sign {
    if (p1 === p2)
        return (Sign.EQUAL);

    const res = Compare_number(p1.x(), p2.x());
    if (res !== Sign.EQUAL)
        return (res);

    return Compare_number(p1.y(), p2.y());
}



export class X_monotone_curve_2 {

}

export class General_polygon_2 {
    m_xcurves: Array<X_monotone_curve_2>
}

export class General_polygon_with_holes_2 {
    m_pgn: General_polygon_2;
    m_holes: Array<General_polygon_2>;
}

/**
 * Representation of an x-monotone circular arc.
 */
class _X_monotone_circle_segment_2 {
    _source: _One_root_point_2;
    _target: _One_root_point_2;
    _first;
    _second;
    _third;
}

class CircleC2 {
    _center: Point_2;
    _squared_radius: Real;
    _orient: Orientation;

    constructor(c: Point_2, squared_radius: Real, orientation: Orientation) {
        this._center = c;
        this._squared_radius = squared_radius;
        this._orient = orientation;
    }
    center() { return this._center; }
    squared_radius() { return this._squared_radius; }
    orientation() { return this._orient; }
}

namespace CGAL {
    export function opposite<T>(t: T) { return -t; }
}

class Circle_2 extends CircleC2 {
    constructor(c: Point_2, squared_radius: Real, orient = Sign.COUNTERCLOCKWISE) {
        super(c, squared_radius, orient);
    }

    opposite() {
        return new Circle_2(this.center(), this.squared_radius(), CGAL.opposite(this.orientation()));
    }
}

/**
 *  Representation of a circle, a circular arc or a line segment.
 */
interface ISegmentParam1 {
    c,
    r,
    orient,
    Source,
    target,
}
interface ISegmentParam2{
    circ: Circle_2,

}

class _Circle_segment_2 {
    _is_full = false;
    _has_radius = true;
    _radius: Real
    _source?: Point_2;
    _target?: Point_2;
    _circ: Circle_2;
    constructor(Circle_2 ) {
        this._circ = new Circle_2();
    }

}


export const CGAL_assertion = assert;
