
import std, { IForwardIterator } from "tstl";
import { Sign } from '../enum';

interface IPoint2 {
};

interface Equal_2 {
    (a: IPoint2, b: IPoint2): boolean;
}
interface Left_turn_2 {

}
interface Orientation_2 {
    (a: IPoint2, b: IPoint2, c: IPoint2): Sign.LEFT_TURN | Sign.RIGHT_TURN | Sign.ZERO;
}
interface Less_rotate_ccw_2 {

}
interface Less_signed_distance_to_line_2 {

}
interface Less_xy_2 {
    (a: IPoint2, b: IPoint2): boolean;
}
interface Less_yx_2 {
    (a: IPoint2, b: IPoint2): boolean;
}

interface Convex_hull_traits {
    equal_2_object(): Equal_2;
    left_turn_2_object(): Left_turn_2;
    orientation_2_object(): Orientation_2;
    less_rotate_ccw_2_object(): Less_rotate_ccw_2;
    less_signed_distance_to_line_2_object(): Less_signed_distance_to_line_2;
    less_xy_2_object(): Less_xy_2;
    less_yx_2_object(): Less_yx_2;
}

type ForwardIterator = IForwardIterator<IPoint2>;

interface IOutputIterator<T> {
    value: T;
};

// function ch_graham_andrew(first: ForwardIterator, last: ForwardIterator, ch_traits: Convex_hull_traits) {
//     const V = Array.from(input);
//     V.sort(ch_traits.less_xy_2_object());

//     const equal_points = ch_traits.equal_2_object();
//     if (equal_points(V[0], V[V.length - 1])) {
//         return [V[0]];
//     }
// }

interface NSWE<T> {
    n?: T;
    w?: T;
    s?: T;
    e?: T;
}

function ch_nswe_point<T extends ForwardIterator>(first: T, last: T,
    nswe: NSWE<T>,
    ch_traits: Convex_hull_traits) {
    const lexicographically_xy_smaller = ch_traits.less_xy_2_object();
    const lexicographically_yx_smaller = ch_traits.less_yx_2_object();
    let n = first;
    let s = first;
    let w = first;
    let e = first;
    while (first !== last) {
        if (lexicographically_xy_smaller(first.value, w.value)) w = first;
        if (lexicographically_xy_smaller(e, first)) e = first;
        if (lexicographically_yx_smaller(n, first)) n = first;
        if (lexicographically_yx_smaller(first, s)) s = first;
        first = first.next() as T;
    }
    nswe.n = n;
    nswe.s = s;
    nswe.w = w;
    nswe.e = e;
}

function ch_nswe_point_with_order(first: ForwardIterator, last: ForwardIterator,
    nswe: NSWE<ForwardIterator>, ch_traits: Convex_hull_traits): ForwardIterator[] {
    ch_nswe_point(first, last, nswe, ch_traits);
    const { n, s, w, e } = nswe;
    const V = new std.Vector([n, s, w, e]);
    std.sort(V.begin(), V.end());
    return [V[0], V[1], V[2], V[3]];
}


function ch_akl_toussaint(first: ForwardIterator, last: ForwardIterator,
    result: IOutputIterator<IPoint2>,
    ch_traits: Convex_hull_traits) {
    const nswe: NSWE<ForwardIterator> = {};
    const ranges = ch_nswe_point_with_order(first, last, nswe, ch_traits);
    const { n, s, w, e } = nswe;

    const left_turn = ch_traits.left_turn_2_object();
    const equal_points = ch_traits.equal_2_object();

    if (equal_points(n.value, s.value)) {
        result.value = w.value;
        return result;
    }

    const region1 = new std.Vector<IPoint2>();
    const region2 = new std.Vector<IPoint2>();
    const region3 = new std.Vector<IPoint2>();
    const region4 = new std.Vector<IPoint2>();
    region1.push_back(w.value);
    region2.push_back(s.value);
    region3.push_back(e.value);
    region4.push_back(n.value);

    const duplicated_extreme_points = (ranges[0] === ranges[1] ? 1 : 0) +
        (ranges[1] === ranges[2] ? 1 : 0) +
        (ranges[2] === ranges[3] ? 1 : 0);

    if (duplicated_extreme_points > 0) {
        ch_akl_toussaint_assign_points_to_regions_deg(first, ranges[0], left_turn, nswe, region1, region2, region3, region4, duplicated_extreme_points, ch_traits);
        if (ranges[0] !== ranges[1])
            ch_akl_toussaint_assign_points_to_regions_deg(std.next(ranges[0]), ranges[1], left_turn, nswe, region1, region2, region3, region4, duplicated_extreme_points, ch_traits);
        if (ranges[1] !== ranges[2])
            ch_akl_toussaint_assign_points_to_regions_deg(std.next(ranges[1]), ranges[2], left_turn, nswe, region1, region2, region3, region4, duplicated_extreme_points, ch_traits);
        if (ranges[2] !== ranges[3])
            ch_akl_toussaint_assign_points_to_regions_deg(std.next(ranges[2]), ranges[3], left_turn, nswe, region1, region2, region3, region4, duplicated_extreme_points, ch_traits);
        ch_akl_toussaint_assign_points_to_regions_deg(std.next(ranges[3]), last, left_turn, nswe, region1, region2, region3, region4, duplicated_extreme_points, ch_traits);
    }
    else {
        ch_akl_toussaint_assign_points_to_regions(first, ranges[0], left_turn, nswe, region1, region2, region3, region4, ch_traits);
        ch_akl_toussaint_assign_points_to_regions(std.next(ranges[0]), ranges[1], left_turn, nswe, region1, region2, region3, region4, ch_traits);
        ch_akl_toussaint_assign_points_to_regions(std.next(ranges[1]), ranges[2], left_turn, nswe, region1, region2, region3, region4, ch_traits);
        ch_akl_toussaint_assign_points_to_regions(std.next(ranges[2]), ranges[3], left_turn, nswe, region1, region2, region3, region4, ch_traits);
        ch_akl_toussaint_assign_points_to_regions(std.next(ranges[3]), last, left_turn, nswe, region1, region2, region3, region4, ch_traits);
    }

    const less_xy_2_object = ch_traits.less_xy_2_object();
    const greater = (a, b) => { return less_xy_2_object(b, a); }
    std.sort(std.next(region1.begin()), region1.end(), less_xy_2_object);
    std.sort(std.next(region2.begin()), region2.end(), less_xy_2_object);
    std.sort(std.next(region3.begin()), region3.end(), greater);
    std.sort(std.next(region4.begin()), region4.end(), greater);

    if (!equal_points(w.value, s.value)) {
        region1.push_back(s.value);
        ch__ref_graham_andrew_scan(region1.begin(), region1.end(),
            result, ch_traits);
    }
    if (!equal_points(s.value, e.value)) {
        region2.push_back(e.value);
        ch__ref_graham_andrew_scan(region2.begin(), region2.end(),
            result, ch_traits);
    }
    if (!equal_points(e.value, n.value)) {
        region3.push_back(n.value);
        ch__ref_graham_andrew_scan(region3.begin(), region3.end(),
            result, ch_traits);
    }
    if (!equal_points(n.value, w.value)) {
        region4.push_back(w.value);
        ch__ref_graham_andrew_scan(region4.begin(), region4.end(),
            result, ch_traits);
    }
}

function ch_akl_toussaint_assign_points_to_regions(first: ForwardIterator, last: ForwardIterator,
    left_turn: any,
    nwse: NSWE<ForwardIterator>,
    region1: std.Vector<IPoint2>,
    region2: std.Vector<IPoint2>,
    region3: std.Vector<IPoint2>,
    region4: std.Vector<IPoint2>,
    ch_traits: Convex_hull_traits) {
    const { n, w, s, e } = nwse;
    for (; first != last; first = first.next()) {
        if (left_turn(e.value, w.value, first.value)) {
            if (left_turn(s.value, w.value, first.value)) region1.push_back(first.value);
            else if (left_turn(e.value, s.value, first.value)) region2.push_back(first.value);
        }
        else {
            if (left_turn(n.value, e.value, first.value)) region3.push_back(first.value);
            else if (left_turn(w.value, n.value, first.value)) region4.push_back(first.value);
        }
    }
}

function ch_akl_toussaint_assign_points_to_regions_deg(first: ForwardIterator, last: ForwardIterator,
    left_turn: any,
    nswe: NSWE<any>,
    region1: std.Vector<IPoint2>,
    region2: std.Vector<IPoint2>,
    region3: std.Vector<IPoint2>,
    region4: std.Vector<IPoint2>,
    duplicated_exteme_points: number, traits: Convex_hull_traits) {

    const { n, s, w, e } = nswe;
    const r1 = (s == w ? region2 : region1);
    const r3 = (n == e ? region4 : region3);
    switch (duplicated_exteme_points) {
        case 2:
            {
                const orient = traits.orientation_2_object();
                for (; first != last; first = first.next()) {
                    switch (orient(e.value, w.value, first.value)) {
                        case Sign.LEFT_TURN:
                            r1.push_back(first.value);
                            break;
                        case Sign.RIGHT_TURN:
                            r3.push_back(first.value);
                            break;
                        default:
                            break;
                    }
                }
                break;
            }
        default: //this is case 1
            if (s == w || s == e) {
                for (; first != last; first = first.next()) {
                    if (left_turn(e.value, w.value, first.value))
                        r1.push_back(first.value);
                    else {
                        if (left_turn(n.value, e.value, first.value)) region3.push_back(first.value);
                        else if (left_turn(w.value, n.value, first.value)) region4.push_back(first.value);
                    }
                }
            }
            else {
                for (; first != last; first = first.next()) {
                    //note that e!=w and s!=n except if the convex hull is a point (they are lexicographically sorted)
                    if (left_turn(e.value, w.value, first.value)) {
                        if (s != w && left_turn(s.value, w.value, first.value)) region1.push_back(first.value);
                        else if (e != s && left_turn(e.value, s.value, first.value)) region2.push_back(first.value);
                    }
                    else
                        r3.push_back(first.value);
                }
            }
    }
}

function ch__ref_graham_andrew_scan<BidirectionalIterator, OutputIterator>(first: BidirectionalIterator,
    last: BidirectionalIterator,
    result: OutputIterator,
    ch_traits: Convex_hull_traits) {

    const left_turn = ch_traits.left_turn_2_object();

    const S = new std.Vector<BidirectionalIterator>();
    BidirectionalIterator              alpha;
    BidirectionalIterator              beta;
    BidirectionalIterator              iter;
    CGAL_ch_precondition(first != last);
    CGAL_ch_precondition(std:: next(first) != last);

    --last;
    CGAL_ch_precondition(!equal_points(* first,* last));
    S.push_back(last);
    S.push_back(first);

    iter = first;
    do {
        ++iter;
    }
    while ((iter != last) && !left_turn(* last, * first, * iter));

    if (iter != last) {
        S.push_back(iter);
        typedef typename std:: vector<BidirectionalIterator>:: reverse_iterator
    rev_iterator;
        rev_iterator  stack_rev_iter = S.rbegin();
        alpha = iter;
        beta = * ++stack_rev_iter;

        for (++iter; iter != last; ++iter) {
            if (left_turn(* alpha, * iter, * last)) {
                while (!left_turn(* beta, * alpha, * iter)) {
                    S.pop_back();
                    alpha = beta;
                    stack_rev_iter = S.rbegin();
                    beta = * ++stack_rev_iter;
                    CGAL_ch_assertion(S.size() >= 2);
                }
                S.push_back(iter);
                beta = alpha;
                alpha = iter;
            }
        }

    }

    typedef typename std:: vector<BidirectionalIterator>:: iterator std_iterator;
    std_iterator  stack_iter = S.begin();
    for (++stack_iter; stack_iter != S.end(); ++stack_iter) { * result =  ** stack_iter; ++result; }
    return result;
}